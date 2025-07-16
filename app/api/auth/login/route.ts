import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    console.log('Login endpoint çağrıldı');
    
    // Environment variable kontrolü
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable bulunamadı');
      console.error('Mevcut environment variables:', {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        DATABASE_URL_EXISTS: !!process.env.DATABASE_URL
      });
      return NextResponse.json(
        { 
          error: 'Veritabanı bağlantısı yapılandırılmamış',
          details: 'DATABASE_URL environment variable tanımlanmamış. Lütfen .env.local dosyası oluşturun ve veritabanı URL\'inizi ekleyin.'
        },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    const { kullaniciAdi, sifre } = body;

    console.log('Gelen veriler:', { kullaniciAdi, sifre: sifre ? '***' : 'boş' });

    if (!kullaniciAdi || !sifre) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // Veritabanı bağlantısını test et
    console.log('Veritabanı bağlantısı test ediliyor...');
    try {
      const testResult = await sql`SELECT 1 as test`;
      console.log('Veritabanı bağlantısı başarılı:', testResult);
    } catch (dbError) {
      console.error('Veritabanı bağlantı hatası:', dbError);
      return NextResponse.json(
        { 
          error: 'Veritabanı bağlantısı başarısız',
          details: dbError instanceof Error ? dbError.message : 'Bilinmeyen veritabanı hatası'
        },
        { status: 500 }
      );
    }

    // Kullanıcıyı veritabanından bul
    console.log('Kullanıcı sorgusu başlatılıyor...');
    
    let kullanicilar;
    try {
      kullanicilar = await sql`
        SELECT id, kullanici_adi, sifre_hash, ad_soyad, rol, aktif
        FROM kullanicilar 
        WHERE kullanici_adi = ${kullaniciAdi}
      `;
      console.log('Kullanıcı sorgusu başarılı, sonuç sayısı:', kullanicilar.length);
    } catch (queryError) {
      console.error('Kullanıcı sorgusu hatası:', queryError);
      return NextResponse.json(
        { 
          error: 'Kullanıcı sorgusu başarısız',
          details: queryError instanceof Error ? queryError.message : 'Bilinmeyen sorgu hatası'
        },
        { status: 500 }
      );
    }

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
    try {
      await sql`
        UPDATE kullanicilar 
        SET son_giris_tarihi = NOW()
        WHERE id = ${kullanici.id}
      `;
      console.log('Son giriş tarihi güncellendi');
    } catch (updateError) {
      console.error('Son giriş tarihi güncelleme hatası:', updateError);
      // Bu hata kritik değil, devam edebiliriz
    }

    // Kullanıcı bilgilerini döndür (şifre hariç)
    const { sifre_hash, ...kullaniciBilgileri } = kullanici;

    console.log('Login başarılı, kullanıcı bilgileri döndürülüyor');
    return NextResponse.json({
      message: 'Giriş başarılı',
      kullanici: kullaniciBilgileri
    });

  } catch (error) {
    console.error('Login genel hatası:', error);
    console.error('Hata türü:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Hata mesajı:', error instanceof Error ? error.message : 'Bilinmeyen hata');
    console.error('Hata stack:', error instanceof Error ? error.stack : 'Stack yok');
    
    return NextResponse.json(
      { 
        error: 'Giriş işlemi başarısız oldu', 
        details: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      },
      { status: 500 }
    );
  }
} 