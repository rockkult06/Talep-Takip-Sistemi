import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    console.log('Login endpoint çağrıldı');
    
    const body = await request.json();
    const { kullaniciAdi, sifre } = body;

    console.log('Gelen veriler:', { kullaniciAdi, sifre: sifre ? '***' : 'boş' });

    if (!kullaniciAdi || !sifre) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // Kullanıcıyı veritabanından bul
    console.log('Veritabanı sorgusu başlatılıyor...');
    
    const kullanicilar = await sql`
      SELECT id, kullanici_adi, sifre_hash, ad_soyad, rol, aktif
      FROM kullanicilar 
      WHERE kullanici_adi = ${kullaniciAdi}
    `;

    console.log('Veritabanı sonucu:', kullanicilar.length, 'kullanıcı bulundu');

    if (kullanicilar.length === 0) {
      console.log('Kullanıcı bulunamadı');
      return NextResponse.json(
        { error: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      );
    }

    const kullanici = kullanicilar[0];
    console.log('Kullanıcı bulundu:', { 
      id: kullanici.id, 
      kullanici_adi: kullanici.kullanici_adi, 
      rol: kullanici.rol,
      aktif: kullanici.aktif 
    });

    // Kullanıcı aktif mi kontrol et
    if (!kullanici.aktif) {
      return NextResponse.json(
        { error: 'Hesabınız aktif değil' },
        { status: 401 }
      );
    }

    // Şifreyi kontrol et (basit hash kontrolü)
    const sifreHash = crypto.createHash('sha256').update(sifre).digest('hex');
    console.log('Şifre hash kontrolü:', {
      girilenSifreHash: sifreHash,
      veritabanindakiHash: kullanici.sifre_hash,
      eslesme: sifreHash === kullanici.sifre_hash
    });
    
    const sifreGecerli = sifreHash === kullanici.sifre_hash;
    
    if (!sifreGecerli) {
      console.log('Şifre eşleşmedi');
      return NextResponse.json(
        { error: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      );
    }
    
    console.log('Şifre doğrulandı');

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
    console.error('Hata detayı:', error instanceof Error ? error.message : 'Bilinmeyen hata');
    return NextResponse.json(
      { error: 'Giriş işlemi başarısız oldu', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
} 