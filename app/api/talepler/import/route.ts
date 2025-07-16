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
    const skippedTalepler = [];
    const errorTalepler = [];

    for (let i = 0; i < talepler.length; i++) {
      const talep = talepler[i];
      try {
        // Talep verilerini doğrula - daha esnek kontrol
        const eksikAlanlar = [];
        
        if (!talep.talepSahibi) eksikAlanlar.push('Talep Sahibi');
        if (!talep.talepSahibiAciklamasi) eksikAlanlar.push('Talep Sahibi Açıklaması');
        if (!talep.talepIlcesi) eksikAlanlar.push('Talep İlçesi');
        if (!talep.bolge) eksikAlanlar.push('Bölge');
        // Hat No artık zorunlu değil
        if (!talep.isletici) eksikAlanlar.push('İşletici');
        if (!talep.talepOzeti) eksikAlanlar.push('Talep Özeti');
        if (!talep.talepIletimSekli) eksikAlanlar.push('Talep İletim Şekli');
        if (!talep.yapılanIs) eksikAlanlar.push('Yapılan İş');
        if (!talep.talepDurumu) eksikAlanlar.push('Talep Durumu');

        if (eksikAlanlar.length > 0) {
          console.warn(`Satır ${i + 1}: Eksik alanlar nedeniyle atlandı - ${eksikAlanlar.join(', ')}`);
          skippedTalepler.push({
            satir: i + 1,
            eksikAlanlar,
            talep
          });
          continue;
        }

        // Talebi veritabanına ekle
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
        console.error(`Satır ${i + 1}: Talep import hatası:`, error, talep);
        errorTalepler.push({
          satir: i + 1,
          hata: error instanceof Error ? error.message : 'Bilinmeyen hata',
          talep
        });
        // Hata durumunda diğer talepleri etkilememesi için devam et
      }
    }

    const toplamSatir = talepler.length;
    const basarili = importedTalepler.length;
    const atlanan = skippedTalepler.length;
    const hatali = errorTalepler.length;

    return NextResponse.json({
      success: true,
      message: `Import tamamlandı: ${basarili} başarılı, ${atlanan} atlandı, ${hatali} hatalı`,
      detaylar: {
        toplamSatir,
        basarili,
        atlanan,
        hatali,
        importedTalepler,
        skippedTalepler,
        errorTalepler
      }
    });

  } catch (error) {
    console.error('Excel import hatası:', error);
    return NextResponse.json(
      { error: 'Excel import işlemi başarısız oldu' },
      { status: 500 }
    );
  }
} 