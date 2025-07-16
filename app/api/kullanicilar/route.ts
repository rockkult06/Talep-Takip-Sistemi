import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import crypto from 'crypto';

// Kullanıcıları listele
export async function GET() {
  try {
    const kullanicilar = await sql`
      SELECT 
        id, 
        kullanici_adi, 
        ad_soyad, 
        rol, 
        aktif, 
        olusturma_tarihi,
        son_giris_tarihi
      FROM kullanicilar 
      ORDER BY olusturma_tarihi DESC
    `;

    return NextResponse.json(kullanicilar);
  } catch (error) {
    console.error('Kullanıcılar getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar getirilemedi' },
      { status: 500 }
    );
  }
}

// Yeni kullanıcı ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kullanici_adi, sifre, ad_soyad, rol } = body;

    if (!kullanici_adi || !sifre || !ad_soyad) {
      return NextResponse.json(
        { error: 'Kullanıcı adı, şifre ve ad soyad gereklidir' },
        { status: 400 }
      );
    }

    // Kullanıcı adı zaten var mı kontrol et
    const mevcutKullanici = await sql`
      SELECT id FROM kullanicilar WHERE kullanici_adi = ${kullanici_adi}
    `;

    if (mevcutKullanici.length > 0) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Şifreyi hash'le
    const sifreHash = crypto.createHash('sha256').update(sifre).digest('hex');

    // Yeni kullanıcıyı ekle
    const yeniKullanici = await sql`
      INSERT INTO kullanicilar (kullanici_adi, sifre_hash, ad_soyad, rol)
      VALUES (${kullanici_adi}, ${sifreHash}, ${ad_soyad}, ${rol || 'kullanici'})
      RETURNING id, kullanici_adi, ad_soyad, rol, aktif, olusturma_tarihi
    `;

    return NextResponse.json({
      message: 'Kullanıcı başarıyla eklendi',
      kullanici: yeniKullanici[0]
    });

  } catch (error) {
    console.error('Kullanıcı eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcı eklenemedi' },
      { status: 500 }
    );
  }
} 