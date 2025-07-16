import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    // Log tablosunun varlığını kontrol et
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'talep_loglari'
      );
    `;

    if (!tableExists[0]?.exists) {
      return NextResponse.json({
        error: 'talep_loglari tablosu bulunamadı',
        tableExists: false
      });
    }

    // Tablo yapısını kontrol et
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'talep_loglari'
      ORDER BY ordinal_position;
    `;

    // Örnek log kaydı ekle
    const testLog = await sql`
      INSERT INTO talep_loglari (
        talep_id, 
        islem_tipi, 
        alan_adi, 
        eski_deger, 
        yeni_deger, 
        aciklama,
        kullanici_id,
        kullanici_adi
      )
      VALUES (
        1, 
        'test', 
        'Test Alan', 
        'Eski Değer', 
        'Yeni Değer', 
        'Test log kaydı',
        null,
        'Test Kullanıcı'
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      tableExists: true,
      columns: columns,
      testLog: testLog[0]
    });

  } catch (error) {
    console.error('Log test hatası:', error);
    return NextResponse.json({
      error: 'Log testi başarısız: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'),
      tableExists: false
    }, { status: 500 });
  }
} 