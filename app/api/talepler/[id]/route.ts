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
      RETURNING *
    `;

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