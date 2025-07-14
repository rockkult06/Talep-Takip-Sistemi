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
      SELECT talep_durumu FROM talepler WHERE id = ${id}
    `;

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

    // Eğer durum değiştiyse geçmişe kaydet
    if (mevcutTalep.length > 0 && mevcutTalep[0].talep_durumu !== body.talepDurumu) {
      await sql`
        INSERT INTO talep_durum_gecmisi (talep_id, eski_durum, yeni_durum)
        VALUES (${id}, ${mevcutTalep[0].talep_durumu}, ${body.talepDurumu})
      `;
    }

    if (guncelTalep.length === 0) {
      return NextResponse.json(
        { error: 'Talep bulunamadı' },
        { status: 404 }
      );
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

    const silinenTalep = await sql`
      DELETE FROM talepler 
      WHERE id = ${id}
      RETURNING *
    `;

    if (silinenTalep.length === 0) {
      return NextResponse.json(
        { error: 'Talep bulunamadı' },
        { status: 404 }
      );
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