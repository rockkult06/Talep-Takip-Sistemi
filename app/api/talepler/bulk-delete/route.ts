import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Geçerli ID listesi gerekli' },
        { status: 400 }
      );
    }

    // Önce silinecek talepleri al
    const silinecekTalepler = await sql`
      SELECT * FROM talepler WHERE id = ANY(${ids})
    `;

    if (silinecekTalepler.length === 0) {
      return NextResponse.json(
        { error: 'Silinecek talep bulunamadı' },
        { status: 404 }
      );
    }

    // Talepleri sil
    const silinenTalepler = await sql`
      DELETE FROM talepler 
      WHERE id = ANY(${ids})
      RETURNING *
    `;

    // Silme işlemlerini logla (eğer tablo varsa)
    try {
      for (const talep of silinecekTalepler) {
        await sql`
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
            ${talep.id}, 
            'toplu_silme', 
            'Talep', 
            ${JSON.stringify(talep)}, 
            '', 
            'Talep toplu silme işlemi ile silindi',
            ${request.headers.get('x-user-id') || null},
            ${request.headers.get('x-user-name') || 'Sistem'}
          )
        `;
      }
    } catch (logError) {
      console.error('Log yazma hatası:', logError);
      // Log hatası silme işlemini durdurmaz
    }

    return NextResponse.json({ 
      success: true,
      message: `${silinenTalepler.length} talep başarıyla silindi`,
      deletedCount: silinenTalepler.length
    });
  } catch (error) {
    console.error('Toplu talep silme hatası:', error);
    return NextResponse.json(
      { error: 'Talepler silinemedi: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') },
      { status: 500 }
    );
  }
} 