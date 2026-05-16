import { NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get LiveKit config from environment
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      console.error('Missing LiveKit environment variables');
      return NextResponse.json(
        { error: 'LiveKit not configured' },
        { status: 500 }
      );
    }

    // Generate unique room and participant name
    const roomName = `edy-${user.id}`;
    const participantName = user.email || user.id;

    // Create signed access token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      ttl: 600, // 10 minutes
    });

    // Grant permissions to join room
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canPublishData: false,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      url: livekitUrl,
      room: roomName,
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
