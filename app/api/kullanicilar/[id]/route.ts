import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import crypto from 'crypto';

// Kullanıcı güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;
    const { kullanici_adi, sifre, ad_soyad, rol } = body;

    if (!kullanici_adi || !ad_soyad) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve ad soyad gereklidir' },
        { status: 400 }
      );
    }

    // Kullanıcı adı başka bir kullanıcı tarafından kullanılıyor mu kontrol et
    const mevcutKullanici = await sql`
      SELECT id FROM kullanicilar 
      WHERE kullanici_adi = ${kullanici_adi} AND id != ${id}
    `;

    if (mevcutKullanici.length > 0) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Güncelleme sorgusu
    let updateQuery;
    if (sifre) {
      // Şifre değiştirilecekse
      const sifreHash = crypto.createHash('sha256').update(sifre).digest('hex');
      updateQuery = sql`
        UPDATE kullanicilar 
        SET kullanici_adi = ${kullanici_adi}, 
            sifre_hash = ${sifreHash}, 
            ad_soyad = ${ad_soyad}, 
            rol = ${rol || 'kullanici'}
        WHERE id = ${id}
        RETURNING id, kullanici_adi, ad_soyad, rol, aktif, olusturma_tarihi
      `;
    } else {
      // Şifre değiştirilmeyecekse
      updateQuery = sql`
        UPDATE kullanicilar 
        SET kullanici_adi = ${kullanici_adi}, 
            ad_soyad = ${ad_soyad}, 
            rol = ${rol || 'kullanici'}
        WHERE id = ${id}
        RETURNING id, kullanici_adi, ad_soyad, rol, aktif, olusturma_tarihi
      `;
    }

    const guncellenenKullanici = await updateQuery;

    if (guncellenenKullanici.length === 0) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Kullanıcı başarıyla güncellendi',
      kullanici: guncellenenKullanici[0]
    });

  } catch (error) {
    console.error('Kullanıcı güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcı güncellenemedi' },
      { status: 500 }
    );
  }
}

// Kullanıcı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Admin01 kullanıcısını silmeye izin verme
    const kullanici = await sql`
      SELECT kullanici_adi FROM kullanicilar WHERE id = ${id}
    `;

    if (kullanici.length > 0 && kullanici[0].kullanici_adi === 'Admin01') {
      return NextResponse.json(
        { error: 'Ana admin kullanıcısı silinemez' },
        { status: 400 }
      );
    }

    const silinenKullanici = await sql`
      DELETE FROM kullanicilar 
      WHERE id = ${id}
      RETURNING id, kullanici_adi, ad_soyad
    `;

    if (silinenKullanici.length === 0) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Kullanıcı başarıyla silindi',
      kullanici: silinenKullanici[0]
    });

  } catch (error) {
    console.error('Kullanıcı silinirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcı silinemedi' },
      { status: 500 }
    );
  }
} 