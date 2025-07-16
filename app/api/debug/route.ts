import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Debug endpoint çağrıldı');
    
    // Environment variables kontrolü
    const envVars = {
      DATABASE_URL: process.env.DATABASE_URL ? 'Tanımlı' : 'Tanımlı değil',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    };
    
    console.log('Environment variables:', envVars);
    
    return NextResponse.json({
      message: 'Debug bilgileri',
      environment: envVars,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug hatası:', error);
    return NextResponse.json(
      { error: 'Debug hatası', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
} 