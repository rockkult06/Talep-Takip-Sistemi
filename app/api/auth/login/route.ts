import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kullaniciAdi, sifre } = body;

    if (!kullaniciAdi || !sifre) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // Kullanıcıyı veritabanından bul
    const kullanicilar = await sql`
      SELECT id, kullanici_adi, sifre_hash, ad_soyad, rol, aktif
      FROM kullanicilar 
      WHERE kullanici_adi = ${kullaniciAdi}
    `;

    if (kullanicilar.length === 0) {
      return NextResponse.json(
        { error: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      );
    }

    const kullanici = kullanicilar[0];

    // Kullanıcı aktif mi kontrol et
    if (!kullanici.aktif) {
      return NextResponse.json(
        { error: 'Hesabınız aktif değil' },
        { status: 401 }
      );
    }

    // Şifreyi kontrol et (basit hash kontrolü)
    const sifreHash = crypto.createHash('sha256').update(sifre).digest('hex');
    const sifreGecerli = sifreHash === kullanici.sifre_hash;
    
    if (!sifreGecerli) {
      return NextResponse.json(
        { error: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Son giriş tarihini güncelle
    await sql`
      UPDATE kullanicilar 
      SET son_giris_tarihi = NOW()
      WHERE id = ${kullanici.id}
    `;

    // Kullanıcı bilgilerini döndür (şifre hariç)
    const { sifre_hash, ...kullaniciBilgileri } = kullanici;

    return NextResponse.json({
      message: 'Giriş başarılı',
      kullanici: kullaniciBilgileri
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    return NextResponse.json(
      { error: 'Giriş işlemi başarısız oldu' },
      { status: 500 }
    );
  }
} 