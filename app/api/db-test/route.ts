import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    console.log('DB Test endpoint çağrıldı');
    
    // Basit veritabanı testi
    const testResult = await sql`SELECT 1 as test`;
    console.log('Basit test sonucu:', testResult);
    
    // Kullanıcılar tablosunu kontrol et
    try {
      const kullanicilar = await sql`SELECT COUNT(*) as count FROM kullanicilar`;
      console.log('Kullanıcı sayısı:', kullanicilar[0]);
      
      return NextResponse.json({
        message: 'Veritabanı bağlantısı başarılı',
        testResult: testResult[0],
        userCount: kullanicilar[0]
      });
    } catch (tableError) {
      console.error('Kullanıcılar tablosu hatası:', tableError);
      return NextResponse.json({
        message: 'Veritabanı bağlantısı var ama kullanıcılar tablosu yok',
        testResult: testResult[0],
        tableError: tableError instanceof Error ? tableError.message : 'Bilinmeyen tablo hatası'
      });
    }
    
  } catch (error) {
    console.error('DB Test hatası:', error);
    return NextResponse.json(
      { 
        error: 'Veritabanı bağlantısı başarısız', 
        details: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      },
      { status: 500 }
    );
  }
} 