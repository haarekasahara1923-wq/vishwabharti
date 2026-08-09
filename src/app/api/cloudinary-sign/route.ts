import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      return NextResponse.json({ error: "Cloudinary is not fully configured on the server" }, { status: 500 });
    }

    // Generate signature: The string to sign must be alphabetical by key.
    const stringToSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}
