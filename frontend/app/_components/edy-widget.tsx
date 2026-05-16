'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import livekit-client to avoid SSR issues
const getLiveKitClient = async () => {
  const { Room, RoomEvent, ParticipantEvent, Track } = await import('livekit-client');
  return { Room, RoomEvent, ParticipantEvent, Track };
};

type Status = 'idle' | 'connecting' | 'connected' | 'listening' | 'error';

export default function EdyWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [isMicOn, setIsMicOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const roomRef = useRef<any>(null);
  const router = useRouter();

  const handleConnect = async () => {
    try {
      setStatus('connecting');
      setError(null);

      // Fetch token from backend
      const response = await fetch('/api/edy/token', { method: 'POST' });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get token');
      }

      const { token, url, room } = await response.json();

      // Dynamic import livekit-client
      const { Room, RoomEvent, ParticipantEvent, Track } = await getLiveKitClient();

      // Create room instance
      const newRoom = new Room({
        autoManageVideo: false,
        autoSubscribe: true,
      });

      // Handle incoming audio from Edy
      newRoom.on(RoomEvent.TrackSubscribed, (track, pub, participant) => {
        if (track.kind === Track.Kind.Audio) {
          const audioElement = track.attach();
          audioElement.autoplay = true;
          audioElement.style.display = 'none';
          document.body.appendChild(audioElement);
        }
      });

      // Handle connection state
      newRoom.on(RoomEvent.Connected, () => {
        setStatus('connected');
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        setStatus('idle');
        roomRef.current = null;
      });

      // Handle participant updates (Edy speaking)
      newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
        participant.on(ParticipantEvent.IsSpeakingChanged, (isSpeaking) => {
          if (isSpeaking && participant.name !== 'You') {
            setStatus('listening');
          }
        });
      });

      newRoom.on(RoomEvent.DataReceived, () => {
        // Data received from Edy (if any)
      });

      // Store room reference
      roomRef.current = newRoom;

      // Connect to the room
      await newRoom.connect(url, token);

      // Enable microphone
      await newRoom.localParticipant.setMicrophoneEnabled(true);
      setIsMicOn(true);
      setStatus('connected');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      setError(message);
      setStatus('error');
      console.error('Edy connection error:', err);
    }
  };

  const handleDisconnect = async () => {
    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
    }
    setIsOpen(false);
    setStatus('idle');
    setIsMicOn(false);
    setError(null);
  };

  const toggleMicrophone = async () => {
    if (roomRef.current) {
      await roomRef.current.localParticipant.setMicrophoneEnabled(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connecting':
        return 'Conectando a Edy...';
      case 'connected':
        return 'Listo para hablar';
      case 'listening':
        return 'Edy está hablando...';
      case 'error':
        return `Error: ${error}`;
      default:
        return 'Cerrado';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
      case 'listening':
        return 'text-emerald-600';
      case 'error':
        return 'text-red-600';
      case 'connecting':
        return 'text-blue-600';
      default:
        return 'text-zinc-500';
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
    };
  }, []);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          if (isOpen) {
            handleDisconnect();
          } else {
            setIsOpen(true);
            if (status === 'idle') {
              handleConnect();
            }
          }
        }}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center text-2xl font-semibold ${
          isOpen || status !== 'idle'
            ? 'bg-[#5B4FFF] text-white shadow-[#5B4FFF]/40 scale-110'
            : 'bg-[#5B4FFF] text-white shadow-[#5B4FFF]/30 hover:scale-105'
        } ${status === 'listening' ? 'animate-pulse' : ''}`}
        title="Chat con Edy"
      >
        🎤
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="h-1.5 bg-gradient-to-r from-[#5B4FFF] to-[#9B8FFF]" />
          <div className="p-5 border-b border-black/5 flex items-center justify-between">
            <h2 className="font-bold text-lg text-zinc-900">Edy - Asistente de Cursos</h2>
            <button
              onClick={handleDisconnect}
              className="text-zinc-400 hover:text-zinc-600 transition-colors text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-5 min-h-[200px] max-h-[400px] overflow-y-auto bg-zinc-50">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            ) : status === 'idle' ? (
              <div className="text-center text-zinc-500 py-8">
                <p className="text-sm">Haz clic en el botón de micrófono para comenzar</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-[#5B4FFF]/20 flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#5B4FFF] animate-pulse" />
                </div>
                <p className="text-sm text-zinc-600">
                  {status === 'connecting' && 'Conectando...'}
                  {status === 'connected' && 'Conectado. Habla ahora.'}
                  {status === 'listening' && 'Edy está hablando...'}
                </p>
              </div>
            )}
          </div>

          {/* Status */}
          <div className={`text-xs font-medium text-center py-3 border-t border-black/5 ${getStatusColor()}`}>
            {getStatusText()}
          </div>

          {/* Footer */}
          {status !== 'idle' && status !== 'error' && (
            <div className="p-4 border-t border-black/5 flex gap-2">
              <button
                onClick={toggleMicrophone}
                className={`flex-1 py-2 rounded-lg font-medium transition-all text-sm ${
                  isMicOn
                    ? 'bg-[#5B4FFF] text-white hover:bg-[#4A3EE0]'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                {isMicOn ? '🎤 Micrófono ON' : '🔇 Micrófono OFF'}
              </button>
              <button
                onClick={handleDisconnect}
                className="flex-1 py-2 rounded-lg font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-all text-sm"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
