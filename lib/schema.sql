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

-- Durum değişikliklerini takip etmek için tablo
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
CREATE INDEX IF NOT EXISTS idx_talep_durum_gecmisi_talep_id ON talep_durum_gecmisi(talep_id);
CREATE INDEX IF NOT EXISTS idx_talep_durum_gecmisi_degisiklik_tarihi ON talep_durum_gecmisi(degisiklik_tarihi DESC); 