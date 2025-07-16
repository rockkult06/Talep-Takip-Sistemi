import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    console.log('Test endpoint çağrıldı');
    
    // Veritabanı bağlantısını test et
    const result = await sql`SELECT 1 as test`;
    console.log('Veritabanı test sonucu:', result);
    
    // Kullanıcılar tablosunu kontrol et
    const kullanicilar = await sql`SELECT COUNT(*) as count FROM kullanicilar`;
    console.log('Kullanıcı sayısı:', kullanicilar);
    
    return NextResponse.json({
      message: 'Test başarılı',
      dbTest: result[0],
      userCount: kullanicilar[0]
    });
  } catch (error) {
    console.error('Test hatası:', error);
    return NextResponse.json(
      { error: 'Test başarısız', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
} 