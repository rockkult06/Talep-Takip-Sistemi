import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// Talep güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // Önce mevcut talebi al
    const mevcutTalep = await sql`
      SELECT * FROM talepler WHERE id = ${id}
    `;

    if (mevcutTalep.length === 0) {
      return NextResponse.json(
        { error: 'Talep bulunamadı' },
        { status: 404 }
      );
    }

    const eskiTalep = mevcutTalep[0];

    const guncelTalep = await sql`
      UPDATE talepler 
      SET 
        talep_sahibi = ${body.talepSahibi},
        talep_sahibi_aciklamasi = ${body.talepSahibiAciklamasi},
        talep_sahibi_diger_aciklama = ${body.talepSahibiDigerAciklama || null},
        talep_ilcesi = ${body.talepIlcesi},
        bolge = ${body.bolge},
        hat_no = ${body.hatNo},
        isletici = ${body.isletici},
        talep_ozeti = ${body.talepOzeti},
        talep_iletim_sekli = ${body.talepIletimSekli},
        evrak_tarihi = ${body.evrakTarihi || null},
        evrak_sayisi = ${body.evrakSayisi || null},
        yapilan_is = ${body.yapılanIs},
        talep_durumu = ${body.talepDurumu},
        guncelleme_tarihi = NOW()
      WHERE id = ${id}
      RETURNING 
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

    // Değişiklikleri logla (eğer tablo varsa)
    try {
      const alanlar = [
        { db: 'talep_sahibi', frontend: 'talepSahibi', label: 'Talep Sahibi' },
        { db: 'talep_sahibi_aciklamasi', frontend: 'talepSahibiAciklamasi', label: 'Talep Sahibi Açıklaması' },
        { db: 'talep_sahibi_diger_aciklama', frontend: 'talepSahibiDigerAciklama', label: 'Diğer Açıklama' },
        { db: 'talep_ilcesi', frontend: 'talepIlcesi', label: 'Talep İlçesi' },
        { db: 'bolge', frontend: 'bolge', label: 'Bölge' },
        { db: 'hat_no', frontend: 'hatNo', label: 'Hat No' },
        { db: 'isletici', frontend: 'isletici', label: 'İşletici' },
        { db: 'talep_ozeti', frontend: 'talepOzeti', label: 'Talep Özeti' },
        { db: 'talep_iletim_sekli', frontend: 'talepIletimSekli', label: 'Talep İletim Şekli' },
        { db: 'evrak_tarihi', frontend: 'evrakTarihi', label: 'Evrak Tarihi' },
        { db: 'evrak_sayisi', frontend: 'evrakSayisi', label: 'Evrak Sayısı' },
        { db: 'yapilan_is', frontend: 'yapılanIs', label: 'Yapılan İş' },
        { db: 'talep_durumu', frontend: 'talepDurumu', label: 'Talep Durumu' }
      ];

      for (const alan of alanlar) {
        const eskiDeger = eskiTalep[alan.db];
        const yeniDeger = body[alan.frontend];
        
        if (eskiDeger !== yeniDeger) {
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
              ${id}, 
              'guncelleme', 
              ${alan.label}, 
              ${eskiDeger || ''}, 
              ${yeniDeger || ''}, 
              ${`${alan.label} alanı güncellendi`},
              ${request.headers.get('x-user-id') || null},
              ${request.headers.get('x-user-name') || 'Sistem'}
            )
          `;
        }
      }
    } catch (logError) {
      console.error('Log yazma hatası:', logError);
      // Log hatası güncelleme işlemini durdurmaz
    }

    // Eğer durum değiştiyse eski geçmiş tablosuna da kaydet (geriye uyumluluk)
    if (eskiTalep.talep_durumu !== body.talepDurumu) {
      await sql`
        INSERT INTO talep_durum_gecmisi (talep_id, eski_durum, yeni_durum)
        VALUES (${id}, ${eskiTalep.talep_durumu}, ${body.talepDurumu})
      `;
    }

    return NextResponse.json(guncelTalep[0]);
  } catch (error) {
    console.error('Talep güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Talep güncellenemedi' },
      { status: 500 }
    );
  }
}

// Talep sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Önce mevcut talebi al
    const mevcutTalep = await sql`
      SELECT * FROM talepler WHERE id = ${id}
    `;

    if (mevcutTalep.length === 0) {
      return NextResponse.json(
        { error: 'Talep bulunamadı' },
        { status: 404 }
      );
    }

    const silinenTalep = await sql`
      DELETE FROM talepler 
      WHERE id = ${id}
      RETURNING *
    `;

    // Silme işlemini logla (eğer tablo varsa)
    try {
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
          ${id}, 
          'silme', 
          'Talep', 
          ${JSON.stringify(mevcutTalep[0])}, 
          '', 
          'Talep tamamen silindi',
          ${request.headers.get('x-user-id') || null},
          ${request.headers.get('x-user-name') || 'Sistem'}
        )
      `;
    } catch (logError) {
      console.error('Log yazma hatası:', logError);
      // Log hatası silme işlemini durdurmaz
    }

    return NextResponse.json({ message: 'Talep başarıyla silindi' });
  } catch (error) {
    console.error('Talep silinirken hata:', error);
    return NextResponse.json(
      { error: 'Talep silinemedi' },
      { status: 500 }
    );
  }
} 