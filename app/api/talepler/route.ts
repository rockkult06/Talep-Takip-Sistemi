import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import type { Talep } from '@/types/talep';

// Talepleri getir
export async function GET() {
  try {
    const talepler = await sql`
      SELECT 
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
      FROM talepler 
      ORDER BY guncelleme_tarihi DESC
    `;
    
    return NextResponse.json(talepler);
  } catch (error) {
    console.error('Talepler getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Talepler getirilemedi' },
      { status: 500 }
    );
  }
}

// Yeni talep ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      talepSahibi,
      talepSahibiAciklamasi,
      talepSahibiDigerAciklama,
      talepIlcesi,
      bolge,
      hatNo,
      isletici,
      talepOzeti,
      talepIletimSekli,
      evrakTarihi,
      evrakSayisi,
      yapılanIs,
      talepDurumu
    } = body;

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
        ${talepSahibi},
        ${talepSahibiAciklamasi},
        ${talepSahibiDigerAciklama || null},
        ${talepIlcesi},
        ${bolge},
        ${hatNo},
        ${isletici},
        ${talepOzeti},
        ${talepIletimSekli},
        ${evrakTarihi || null},
        ${evrakSayisi || null},
        ${yapılanIs},
        ${talepDurumu},
        NOW()
      )
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

    return NextResponse.json(yeniTalep[0]);
  } catch (error) {
    console.error('Talep eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Talep eklenemedi' },
      { status: 500 }
    );
  }
} 