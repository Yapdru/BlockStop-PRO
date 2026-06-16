import { NextRequest, NextResponse } from 'next/server';
import * as speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      );
    }

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `BlockStop PRO (${email})`,
      issuer: 'BlockStop',
      length: 32
    });

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

    return NextResponse.json({
      secret: secret.base32,
      qrCode
    });
  } catch (error) {
    console.error('2FA generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate 2FA' },
      { status: 500 }
    );
  }
}
