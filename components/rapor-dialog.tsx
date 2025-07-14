"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download } from "lucide-react"
import type { Talep } from "@/types/talep"
import * as XLSX from "xlsx"

interface RaporDialogProps {
  talepler: Talep[]
}

export default function RaporDialog({ talepler }: RaporDialogProps) {
  const [open, setOpen] = useState(false)
  const [baslangicTarihi, setBaslangicTarihi] = useState("")
  const [bitisTarihi, setBitisTarihi] = useState("")
  const [yeniGelenRaporlar, setYeniGelenRaporlar] = useState(false)
  const [durumuDegisenTalepler, setDurumuDegisenTalepler] = useState(false)
  const [raporVerileri, setRaporVerileri] = useState<Talep[]>([])

  const raporOlustur = () => {
    if (!baslangicTarihi || !bitisTarihi) {
      alert("Lütfen tarih aralığını seçin")
      return
    }

    if (!yeniGelenRaporlar && !durumuDegisenTalepler) {
      alert("Lütfen en az bir rapor türü seçin")
      return
    }

    // Tarih formatını düzelt - saat bilgisini ekle
    const baslangic = new Date(baslangicTarihi + 'T00:00:00')
    const bitis = new Date(bitisTarihi + 'T23:59:59')

    console.log('Filtreleme başlangıç:', baslangic)
    console.log('Filtreleme bitiş:', bitis)
    console.log('Toplam talep sayısı:', talepler.length)

    let filtrelenmisTalepler: Talep[] = []

    // Tarih aralığına göre filtrele
    const tarihAraligindakiTalepler = talepler.filter((talep) => {
      // Tarih formatını düzelt
      let talepTarihi: Date
      try {
        // Eğer tarih string formatındaysa parse et
        if (typeof talep.guncellemeTarihi === 'string') {
          // Türkçe tarih formatını parse et (örn: "15.12.2023")
          const tarihParcalari = talep.guncellemeTarihi.split('.')
          if (tarihParcalari.length === 3) {
            talepTarihi = new Date(parseInt(tarihParcalari[2]), parseInt(tarihParcalari[1]) - 1, parseInt(tarihParcalari[0]))
          } else {
            talepTarihi = new Date(talep.guncellemeTarihi)
          }
        } else {
          talepTarihi = new Date(talep.guncellemeTarihi)
        }
      } catch (error) {
        console.error('Tarih parse hatası:', talep.guncellemeTarihi, error)
        return false
      }

      const tarihUygun = talepTarihi >= baslangic && talepTarihi <= bitis
      console.log(`Talep ${talep.id}: ${talep.guncellemeTarihi} -> ${talepTarihi}, uygun: ${tarihUygun}`)
      
      return tarihUygun
    })

    console.log('Tarih aralığındaki talep sayısı:', tarihAraligindakiTalepler.length)

    if (yeniGelenRaporlar) {
      // Yeni gelen raporlar - tarih aralığındaki tüm talepler
      filtrelenmisTalepler.push(...tarihAraligindakiTalepler)
      console.log('Yeni gelen raporlar eklendi:', tarihAraligindakiTalepler.length)
    }

    if (durumuDegisenTalepler) {
      // Durumu değişen talepler (İletildi dışındaki durumlar)
      const durumuDegisenTaleplerListesi = tarihAraligindakiTalepler.filter((talep) => {
        return talep.talepDurumu !== "İletildi" && 
               (talep.talepDurumu === "Değerlendirilecek" || 
                talep.talepDurumu === "Olumlu" || 
                talep.talepDurumu === "Olumsuz")
      })
      filtrelenmisTalepler.push(...durumuDegisenTaleplerListesi)
      console.log('Durumu değişen talepler eklendi:', durumuDegisenTaleplerListesi.length)
    }

    // Tekrarlanan talepleri kaldır
    const benzersizTalepler = filtrelenmisTalepler.filter((talep, index, self) => 
      index === self.findIndex(t => t.id === talep.id)
    )

    console.log('Benzersiz talep sayısı:', benzersizTalepler.length)

    setRaporVerileri(benzersizTalepler)

    // Rapor oluşturulduktan sonra otomatik olarak Excel indirme işlemini tetikle
    if (benzersizTalepler.length > 0) {
      // Kısa bir gecikme ile Excel indirme işlemini tetikle
      setTimeout(() => {
        raporuIndir()
      }, 100)
    } else {
      alert("Seçilen kriterlere uygun talep bulunamadı")
    }
  }

  const raporuIndir = () => {
    if (raporVerileri.length === 0) {
      alert("İndirilecek rapor bulunamadı")
      return
    }

    const exportData = raporVerileri.map((talep) => ({
      "Talep ID": talep.id,
      "Talep Sahibi": talep.talepSahibi,
      "Talep Sahibi Açıklaması": talep.talepSahibiAciklamasi,
      "Diğer Açıklama": talep.talepSahibiDigerAciklama || "",
      "Talep İlçesi": talep.talepIlcesi,
      "Bölge": talep.bolge,
      "Hat No": talep.hatNo,
      "İşletici": talep.isletici,
      "Talep Özeti": talep.talepOzeti,
      "Talep İletim Şekli": talep.talepIletimSekli,
      "Evrak Tarihi": talep.evrakTarihi || "",
      "Evrak Sayısı": talep.evrakSayisi || "",
      "Yapılan İş": talep.yapılanIs,
      "Talep Durumu": talep.talepDurumu,
      "Güncelleme Tarihi": talep.guncellemeTarihi,
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Rapor")
    
    const tarihAraligi = `${baslangicTarihi}_${bitisTarihi}`
    const raporTuru = []
    if (yeniGelenRaporlar) raporTuru.push("YeniGelen")
    if (durumuDegisenTalepler) raporTuru.push("DurumuDegisen")
    
    const dosyaAdi = `talep_raporu_${tarihAraligi}_${raporTuru.join("_")}.xlsx`
    
    try {
      XLSX.writeFile(wb, dosyaAdi)
      alert(`Rapor başarıyla indirildi: ${dosyaAdi}`)
    } catch (error) {
      console.error('Excel dosyası oluşturulurken hata:', error)
      alert('Rapor indirilirken bir hata oluştu')
    }
  }

  const getDurumBadgeVariant = (durum: string) => {
    switch (durum) {
      case "Olumlu":
        return "default"
      case "Olumsuz":
        return "destructive"
      case "İletildi":
        return "secondary"
      case "Değerlendirilecek":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Rapor Al
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Talep Raporu Oluştur</DialogTitle>
          <DialogDescription>
            Tarih aralığı ve rapor türü seçerek özel rapor oluşturun
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tarih Aralığı */}
          <Card>
            <CardHeader>
              <CardTitle>Tarih Aralığı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baslangic-tarihi">Başlangıç Tarihi</Label>
                  <Input
                    id="baslangic-tarihi"
                    type="date"
                    value={baslangicTarihi}
                    onChange={(e) => setBaslangicTarihi(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bitis-tarihi">Bitiş Tarihi</Label>
                  <Input
                    id="bitis-tarihi"
                    type="date"
                    value={bitisTarihi}
                    onChange={(e) => setBitisTarihi(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rapor Türleri */}
          <Card>
            <CardHeader>
              <CardTitle>Rapor Türleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                                 <div className="flex items-center space-x-2">
                   <Checkbox
                     id="yeni-gelen"
                     checked={yeniGelenRaporlar}
                     onCheckedChange={(checked) => setYeniGelenRaporlar(checked as boolean)}
                   />
                   <Label htmlFor="yeni-gelen" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                     Yeni Gelen Raporlar
                   </Label>
                   <span className="text-xs text-muted-foreground ml-2">
                     (Belirtilen tarih aralığında oluşturulan talepler)
                   </span>
                 </div>
                 <div className="flex items-center space-x-2">
                   <Checkbox
                     id="durumu-degisen"
                     checked={durumuDegisenTalepler}
                     onCheckedChange={(checked) => setDurumuDegisenTalepler(checked as boolean)}
                   />
                   <Label htmlFor="durumu-degisen" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                     Durumu Değişen Talepler
                   </Label>
                   <span className="text-xs text-muted-foreground ml-2">
                     (Değerlendirilecek, Olumlu, Olumsuz durumundaki talepler)
                   </span>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Rapor Oluştur Butonu */}
          <div className="flex justify-center">
            <Button onClick={raporOlustur} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Rapor Oluştur
            </Button>
          </div>

          {/* Rapor Sonuçları */}
          {raporVerileri.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Rapor Sonuçları ({raporVerileri.length} talep)
                  <Button onClick={raporuIndir} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Excel'e İndir
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {raporVerileri.map((talep) => (
                    <div key={talep.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">#{talep.id}</span>
                          <Badge variant={getDurumBadgeVariant(talep.talepDurumu)}>
                            {talep.talepDurumu}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {talep.guncellemeTarihi}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Talep Sahibi:</span> {talep.talepSahibi}
                        </div>
                        <div>
                          <span className="font-medium">İlçe:</span> {talep.talepIlcesi}
                        </div>
                        <div>
                          <span className="font-medium">Hat No:</span> {talep.hatNo}
                        </div>
                        <div>
                          <span className="font-medium">İşletici:</span> {talep.isletici}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Özet:</span>
                        <p className="text-sm text-muted-foreground mt-1">{talep.talepOzeti}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 