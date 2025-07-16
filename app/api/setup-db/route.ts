import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    console.log('Veritabanı setup başlatılıyor...');
    
    // Schema dosyasını oku
    const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Schema dosyası okundu, boyut:', schemaSQL.length, 'karakter');
    
    // Temel tabloları oluştur
    console.log('Temel tablolar oluşturuluyor...');
    
    // Talepler tablosu
    await sql`
      CREATE TABLE IF NOT EXISTS talepler (
        id SERIAL PRIMARY KEY,
        talep_sahibi VARCHAR(255) NOT NULL,
        talep_sahibi_aciklamasi VARCHAR(255) NOT NULL,
        talep_sahibi_diger_aciklama TEXT,
        talep_ilcesi VARCHAR(100) NOT NULL,
        bolge VARCHAR(10) NOT NULL,
        hat_no VARCHAR(50) NOT NULL,
        isletici VARCHAR(100) NOT NULL,
        talep_ozeti TEXT NOT NULL,
        talep_iletim_sekli VARCHAR(255) NOT NULL,
        evrak_tarihi DATE,
        evrak_sayisi VARCHAR(100),
        yapilan_is TEXT NOT NULL,
        talep_durumu VARCHAR(100) NOT NULL,
        guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Talepler tablosu oluşturuldu');
    
    // Kullanıcılar tablosu
    await sql`
      CREATE TABLE IF NOT EXISTS kullanicilar (
        id SERIAL PRIMARY KEY,
        kullanici_adi VARCHAR(50) UNIQUE NOT NULL,
        sifre_hash VARCHAR(255) NOT NULL,
        ad_soyad VARCHAR(100) NOT NULL,
        rol VARCHAR(20) NOT NULL DEFAULT 'kullanici',
        aktif BOOLEAN DEFAULT true,
        olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        son_giris_tarihi TIMESTAMP
      )
    `;
    console.log('Kullanıcılar tablosu oluşturuldu');
    
    // Talep logları tablosu
    await sql`
      CREATE TABLE IF NOT EXISTS talep_loglari (
        id SERIAL PRIMARY KEY,
        talep_id INTEGER REFERENCES talepler(id) ON DELETE CASCADE,
        islem_tipi VARCHAR(50) NOT NULL,
        alan_adi VARCHAR(100),
        eski_deger TEXT,
        yeni_deger TEXT,
        aciklama TEXT,
        islem_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        kullanici_id INTEGER REFERENCES kullanicilar(id),
        kullanici_adi VARCHAR(100)
      )
    `;
    console.log('Talep logları tablosu oluşturuldu');
    
    // İndeksler
    await sql`CREATE INDEX IF NOT EXISTS idx_talepler_guncelleme_tarihi ON talepler(guncelleme_tarihi DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_talepler_talep_durumu ON talepler(talep_durumu)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_talepler_talep_ilcesi ON talepler(talep_ilcesi)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_talep_loglari_talep_id ON talep_loglari(talep_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_talep_loglari_islem_tarihi ON talep_loglari(islem_tarihi DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_talep_loglari_kullanici_id ON talep_loglari(kullanici_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_kullanicilar_kullanici_adi ON kullanicilar(kullanici_adi)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_kullanicilar_rol ON kullanicilar(rol)`;
    console.log('İndeksler oluşturuldu');
    
    // İlk admin kullanıcısını ekle
    await sql`
      INSERT INTO kullanicilar (kullanici_adi, sifre_hash, ad_soyad, rol) 
      VALUES ('Admin01', '116c26365634ad5bf077f82d59f8345e0c6b0f7a3db607de5f60a69f5a093ba2', 'Sistem Yöneticisi', 'admin')
      ON CONFLICT (kullanici_adi) DO NOTHING
    `;
    console.log('Admin kullanıcısı eklendi');
    
    // Kullanıcıları kontrol et
    const kullanicilar = await sql`SELECT COUNT(*) as count FROM kullanicilar`;
    console.log('Kullanıcı sayısı:', kullanicilar[0]);
    
    return NextResponse.json({
      message: 'Veritabanı setup tamamlandı',
      userCount: kullanicilar[0]
    });
    
  } catch (error) {
    console.error('Setup hatası:', error);
    return NextResponse.json(
      { 
        error: 'Veritabanı setup başarısız', 
        details: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      },
      { status: 500 }
    );
  }
} 