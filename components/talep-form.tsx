"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import type { Talep } from "@/types/talep"

interface TalepFormProps {
  onSubmit: (talep: Omit<Talep, "id" | "guncellemeTarihi">) => void
}

const IZMIR_ILCELERI = [
  "Aliağa",
  "Balçova",
  "Bayındır",
  "Bayraklı",
  "Bergama",
  "Beydağ",
  "Bornova",
  "Buca",
  "Çeşme",
  "Çiğli",
  "Dikili",
  "Foça",
  "Gaziemir",
  "Güzelbahçe",
  "Karabağlar",
  "Karaburun",
  "Karşıyaka",
  "Kemalpaşa",
  "Kınık",
  "Kiraz",
  "Konak",
  "Menderes",
  "Menemen",
  "Narlıdere",
  "Ödemiş",
  "Seferihisar",
  "Selçuk",
  "Tire",
  "Torbalı",
  "Urla",
]

const IC_PAYDAS_SECENEKLERI = ["Otobüs İşletme Dairesi Başkanlığı", "Ulaşım Planlama Dairesi Başkanlığı"]

const DIS_PAYDAS_SECENEKLERI = ["İlçe Belediyesi", "Muhtarlık", "Meclis Üyesi", "İzulaş", "Diğer"]

export default function TalepForm({ onSubmit }: TalepFormProps) {
  const [formData, setFormData] = useState({
    talepSahibi: "",
    talepSahibiAciklamasi: "",
    talepSahibiDigerAciklama: "",
    talepIlcesi: "",
    bolge: "",
    hatNo: "",
    isletici: "",
    talepOzeti: "",
    talepIletimSekli: "",
    evrakTarihi: "",
    evrakSayisi: "",
    yapılanIs: "",
    talepDurumu: "",
  })

  const validateForm = () => {
    const errors: string[] = []

    // Zorunlu alanları kontrol et
    if (!formData.talepSahibi) {
      errors.push("Talep Sahibi seçilmelidir")
    }
    if (!formData.talepSahibiAciklamasi) {
      errors.push("Talep Sahibi Açıklaması seçilmelidir")
    }
    if (formData.talepSahibi === "Dış Paydaş" && formData.talepSahibiAciklamasi === "Diğer" && !formData.talepSahibiDigerAciklama) {
      errors.push("Diğer Açıklama girilmelidir")
    }
    if (!formData.talepIlcesi) {
      errors.push("Talep İlçesi seçilmelidir")
    }
    if (!formData.bolge) {
      errors.push("Bölge seçilmelidir")
    }
    if (!formData.hatNo) {
      errors.push("Hat No girilmelidir")
    }
    if (!formData.isletici) {
      errors.push("İşletici seçilmelidir")
    }
    if (!formData.talepOzeti) {
      errors.push("Talep Özeti girilmelidir")
    }
    if (!formData.talepIletimSekli) {
      errors.push("Talep İletim Şekli seçilmelidir")
    }
    if (!formData.yapılanIs) {
      errors.push("Yapılan İş girilmelidir")
    }
    if (!formData.talepDurumu) {
      errors.push("Talep Durumu seçilmelidir")
    }

    // EBYS için özel kontroller
    if (formData.talepIletimSekli === "Elektronik Belge Yönetim Sistemi (EBYS)") {
      if (!formData.evrakTarihi) {
        errors.push("EBYS seçildiğinde Evrak Tarihi girilmelidir")
      }
      if (!formData.evrakSayisi) {
        errors.push("EBYS seçildiğinde Evrak Sayısı girilmelidir")
      }
    }

    return errors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateForm()
    
    if (errors.length > 0) {
      alert("Lütfen aşağıdaki eksik alanları doldurun:\n\n" + errors.join("\n"))
      return
    }

    onSubmit(formData)

    // Formu sıfırla
    setFormData({
      talepSahibi: "",
      talepSahibiAciklamasi: "",
      talepSahibiDigerAciklama: "",
      talepIlcesi: "",
      bolge: "",
      hatNo: "",
      isletici: "",
      talepOzeti: "",
      talepIletimSekli: "",
      evrakTarihi: "",
      evrakSayisi: "",
      yapılanIs: "",
      talepDurumu: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Talep Sahibi */}
        <div className="space-y-2">
          <Label htmlFor="talepSahibi">Talep Sahibi *</Label>
          <Select
            value={formData.talepSahibi}
            onValueChange={(value) => {
              handleInputChange("talepSahibi", value)
              handleInputChange("talepSahibiAciklamasi", "")
              handleInputChange("talepSahibiDigerAciklama", "")
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Talep sahibini seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="İç Paydaş">İç Paydaş</SelectItem>
              <SelectItem value="Dış Paydaş">Dış Paydaş</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Talep Sahibi Açıklaması */}
        {formData.talepSahibi && (
          <div className="space-y-2">
            <Label htmlFor="talepSahibiAciklamasi">Talep Sahibi Açıklaması *</Label>
            <Select
              value={formData.talepSahibiAciklamasi}
              onValueChange={(value) => {
                handleInputChange("talepSahibiAciklamasi", value)
                if (value !== "Diğer") {
                  handleInputChange("talepSahibiDigerAciklama", "")
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Açıklama seçin" />
              </SelectTrigger>
              <SelectContent>
                {formData.talepSahibi === "İç Paydaş"
                  ? IC_PAYDAS_SECENEKLERI.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))
                  : DIS_PAYDAS_SECENEKLERI.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Diğer Açıklama */}
        {formData.talepSahibi === "Dış Paydaş" && formData.talepSahibiAciklamasi === "Diğer" && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="talepSahibiDigerAciklama">Diğer Açıklama *</Label>
            <Input
              id="talepSahibiDigerAciklama"
              value={formData.talepSahibiDigerAciklama}
              onChange={(e) => handleInputChange("talepSahibiDigerAciklama", e.target.value)}
              placeholder="Lütfen açıklama girin"
              required
            />
          </div>
        )}

        {/* Talep İlçesi */}
        <div className="space-y-2">
          <Label htmlFor="talepIlcesi">Talep İlçesi *</Label>
          <Select value={formData.talepIlcesi} onValueChange={(value) => handleInputChange("talepIlcesi", value)}>
            <SelectTrigger>
              <SelectValue placeholder="İlçe seçin" />
            </SelectTrigger>
            <SelectContent>
              {IZMIR_ILCELERI.map((ilce) => (
                <SelectItem key={ilce} value={ilce}>
                  {ilce}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bölge */}
        <div className="space-y-2">
          <Label htmlFor="bolge">Bölge *</Label>
          <Select value={formData.bolge} onValueChange={(value) => handleInputChange("bolge", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Bölge seçin" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((bolge) => (
                <SelectItem key={bolge} value={bolge.toString()}>
                  {bolge}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Hat No */}
        <div className="space-y-2">
          <Label htmlFor="hatNo">Hat No *</Label>
          <Input
            id="hatNo"
            value={formData.hatNo}
            onChange={(e) => handleInputChange("hatNo", e.target.value)}
            placeholder="Hat numarasını girin"
            required
          />
        </div>

        {/* İşletici */}
        <div className="space-y-2">
          <Label htmlFor="isletici">İşletici *</Label>
          <Select value={formData.isletici} onValueChange={(value) => handleInputChange("isletici", value)}>
            <SelectTrigger>
              <SelectValue placeholder="İşletici seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Eshot">Eshot</SelectItem>
              <SelectItem value="İzTaşıt">İzTaşıt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Talep İletim Şekli */}
        <div className="space-y-2">
          <Label htmlFor="talepIletimSekli">Talep İletim Şekli *</Label>
          <Select
            value={formData.talepIletimSekli}
            onValueChange={(value) => {
              handleInputChange("talepIletimSekli", value)
              if (value !== "Elektronik Belge Yönetim Sistemi (EBYS)") {
                handleInputChange("evrakTarihi", "")
                handleInputChange("evrakSayisi", "")
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="İletim şekli seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Şifahi">Şifahi</SelectItem>
              <SelectItem value="Toplantı">Toplantı</SelectItem>
              <SelectItem value="E-posta">E-posta</SelectItem>
              <SelectItem value="Elektronik Belge Yönetim Sistemi (EBYS)">
                Elektronik Belge Yönetim Sistemi (EBYS)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Talep Durumu */}
        <div className="space-y-2">
          <Label htmlFor="talepDurumu">Talep Durumu *</Label>
          <Select value={formData.talepDurumu} onValueChange={(value) => handleInputChange("talepDurumu", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Durum seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="İletildi">İletildi</SelectItem>
              <SelectItem value="Değerlendirilecek">Değerlendirilecek</SelectItem>
              <SelectItem value="Olumlu">Olumlu</SelectItem>
              <SelectItem value="Olumsuz">Olumsuz</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* EBYS Bilgileri */}
      {formData.talepIletimSekli === "Elektronik Belge Yönetim Sistemi (EBYS)" && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">EBYS Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="evrakTarihi">Evrak Tarihi *</Label>
                <Input
                  id="evrakTarihi"
                  type="date"
                  value={formData.evrakTarihi}
                  onChange={(e) => handleInputChange("evrakTarihi", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evrakSayisi">Evrak Sayısı *</Label>
                <Input
                  id="evrakSayisi"
                  value={formData.evrakSayisi}
                  onChange={(e) => handleInputChange("evrakSayisi", e.target.value)}
                  placeholder="Evrak sayısını girin"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Talep Özeti */}
      <div className="space-y-2">
        <Label htmlFor="talepOzeti">Talep Özeti *</Label>
        <Textarea
          id="talepOzeti"
          value={formData.talepOzeti}
          onChange={(e) => handleInputChange("talepOzeti", e.target.value)}
          placeholder="Talep özetini girin"
          rows={4}
          required
        />
      </div>

      {/* Talebe İlişkin Yapılan İş */}
      <div className="space-y-2">
        <Label htmlFor="yapılanIs">Talebe İlişkin Yapılan İş *</Label>
        <Textarea
          id="yapılanIs"
          value={formData.yapılanIs}
          onChange={(e) => handleInputChange("yapılanIs", e.target.value)}
          placeholder="Yapılan işleri açıklayın"
          rows={4}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Talebi Kaydet
      </Button>
    </form>
  )
}
