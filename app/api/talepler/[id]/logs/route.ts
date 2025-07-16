import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// Talep loglarını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const logs = await sql`
      SELECT 
        id,
        islem_tipi,
        alan_adi,
        eski_deger,
        yeni_deger,
        aciklama,
        islem_tarihi,
        kullanici_adi as kullanici
      FROM talep_loglari 
      WHERE talep_id = ${id}
      ORDER BY islem_tarihi DESC
    `;

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Loglar getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Loglar getirilemedi' },
      { status: 500 }
    );
  }
} 