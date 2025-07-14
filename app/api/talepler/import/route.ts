import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// Excel'den talep import et
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { talepler } = body;

    if (!Array.isArray(talepler) || talepler.length === 0) {
      return NextResponse.json(
        { error: 'Geçerli talep verisi bulunamadı' },
        { status: 400 }
      );
    }

    const importedTalepler = [];

    for (const talep of talepler) {
      try {
        const yeniTalep = await sql`
          INSERT INTO talepler (
            talep_sahibi,
            talep_sahibi_aciklamasi,
            talep_sahibi_diger_aciklama,
            talep_ilcesi,
            bolge,
            hat_no,
            isletici,
            talep_ozeti,
            talep_iletim_sekli,
            evrak_tarihi,
            evrak_sayisi,
            yapilan_is,
            talep_durumu,
            guncelleme_tarihi
          ) VALUES (
            ${talep.talepSahibi},
            ${talep.talepSahibiAciklamasi},
            ${talep.talepSahibiDigerAciklama || null},
            ${talep.talepIlcesi},
            ${talep.bolge},
            ${talep.hatNo},
            ${talep.isletici},
            ${talep.talepOzeti},
            ${talep.talepIletimSekli},
            ${talep.evrakTarihi || null},
            ${talep.evrakSayisi || null},
            ${talep.yapılanIs},
            ${talep.talepDurumu},
            NOW()
          ) RETURNING 
            id,
            talep_sahibi as "talepSahibi",
            talep_sahibi_aciklamasi as "talepSahibiAciklamasi",
            talep_sahibi_diger_aciklama as "talepSahibiDigerAciklama",
            talep_ilcesi as "talepIlcesi",
            bolge,
            hat_no as "hatNo",
            isletici,
            talep_ozeti as "talepOzeti",
            talep_iletim_sekli as "talepIletimSekli",
            evrak_tarihi as "evrakTarihi",
            evrak_sayisi as "evrakSayisi",
            yapilan_is as "yapılanIs",
            talep_durumu as "talepDurumu",
            guncelleme_tarihi as "guncellemeTarihi"
        `;

        if (yeniTalep.length > 0) {
          importedTalepler.push(yeniTalep[0]);
        }
      } catch (error) {
        console.error('Talep import hatası:', error);
        // Hata durumunda devam et, diğer talepleri import etmeye çalış
      }
    }

    return NextResponse.json({
      message: `${importedTalepler.length} talep başarıyla import edildi`,
      importedTalepler
    });
  } catch (error) {
    console.error('Excel import hatası:', error);
    return NextResponse.json(
      { error: 'Excel import işlemi başarısız oldu' },
      { status: 500 }
    );
  }
} 