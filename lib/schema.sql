-- Talepler tablosu oluşturma
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
);

-- Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS kullanicilar (
  id SERIAL PRIMARY KEY,
  kullanici_adi VARCHAR(50) UNIQUE NOT NULL,
  sifre_hash VARCHAR(255) NOT NULL,
  ad_soyad VARCHAR(100) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'kullanici', -- 'admin', 'kullanici'
  aktif BOOLEAN DEFAULT true,
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  son_giris_tarihi TIMESTAMP
);

-- Talep değişiklik logları için tablo
CREATE TABLE IF NOT EXISTS talep_loglari (
  id SERIAL PRIMARY KEY,
  talep_id INTEGER REFERENCES talepler(id) ON DELETE CASCADE,
  islem_tipi VARCHAR(50) NOT NULL, -- 'guncelleme', 'silme', 'durum_degisikligi'
  alan_adi VARCHAR(100),
  eski_deger TEXT,
  yeni_deger TEXT,
  aciklama TEXT,
  islem_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  kullanici_id INTEGER REFERENCES kullanicilar(id),
  kullanici_adi VARCHAR(100)
);

-- Durum değişikliklerini takip etmek için tablo (geriye uyumluluk için korundu)
CREATE TABLE IF NOT EXISTS talep_durum_gecmisi (
  id SERIAL PRIMARY KEY,
  talep_id INTEGER REFERENCES talepler(id) ON DELETE CASCADE,
  eski_durum VARCHAR(100),
  yeni_durum VARCHAR(100) NOT NULL,
  degisiklik_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  degistiren_kullanici VARCHAR(100) DEFAULT 'Sistem'
);

-- İndeksler ekleme (performans için)
CREATE INDEX IF NOT EXISTS idx_talepler_guncelleme_tarihi ON talepler(guncelleme_tarihi DESC);
CREATE INDEX IF NOT EXISTS idx_talepler_talep_durumu ON talepler(talep_durumu);
CREATE INDEX IF NOT EXISTS idx_talepler_talep_ilcesi ON talepler(talep_ilcesi);
CREATE INDEX IF NOT EXISTS idx_talep_loglari_talep_id ON talep_loglari(talep_id);
CREATE INDEX IF NOT EXISTS idx_talep_loglari_islem_tarihi ON talep_loglari(islem_tarihi DESC);
CREATE INDEX IF NOT EXISTS idx_talep_loglari_kullanici_id ON talep_loglari(kullanici_id);
CREATE INDEX IF NOT EXISTS idx_kullanicilar_kullanici_adi ON kullanicilar(kullanici_adi);
CREATE INDEX IF NOT EXISTS idx_kullanicilar_rol ON kullanicilar(rol);
CREATE INDEX IF NOT EXISTS idx_talep_durum_gecmisi_talep_id ON talep_durum_gecmisi(talep_id);
CREATE INDEX IF NOT EXISTS idx_talep_durum_gecmisi_degisiklik_tarihi ON talep_durum_gecmisi(degisiklik_tarihi DESC);

-- İlk admin kullanıcısını ekle (şifre: Planlama2025)
INSERT INTO kullanicilar (kullanici_adi, sifre_hash, ad_soyad, rol) 
VALUES ('Admin01', '116c26365634ad5bf077f82d59f8345e0c6b0f7a3db607de5f60a69f5a093ba2', 'Sistem Yöneticisi', 'admin')
ON CONFLICT (kullanici_adi) DO NOTHING; 