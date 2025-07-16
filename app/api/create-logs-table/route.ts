import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST() {
  try {
    // Talep logları tablosunu oluştur
    await sql`
      CREATE TABLE IF NOT EXISTS talep_loglari (
        id SERIAL PRIMARY KEY,
        talep_id INTEGER NOT NULL,
        islem_tipi VARCHAR(50) NOT NULL,
        alan_adi VARCHAR(100),
        eski_deger TEXT,
        yeni_deger TEXT,
        aciklama TEXT,
        islem_tarihi TIMESTAMP DEFAULT NOW(),
        kullanici_id INTEGER,
        kullanici_adi VARCHAR(100)
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Talep logları tablosu başarıyla oluşturuldu'
    });

  } catch (error) {
    console.error('Log tablosu oluşturma hatası:', error);
    return NextResponse.json({
      error: 'Log tablosu oluşturulamadı: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata')
    }, { status: 500 });
  }
} 