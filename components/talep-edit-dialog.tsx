"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Talep } from "@/types/talep"

interface TalepEditDialogProps {
  talep: Talep | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, guncelTalep: Partial<Talep>) => void
}

export default function TalepEditDialog({ talep, open, onOpenChange, onSave }: TalepEditDialogProps) {
  const [formData, setFormData] = useState<Partial<Talep>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (talep) {
      setFormData(talep)
    }
  }, [talep])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!talep) return

    setLoading(true)
    try {
      await onSave(talep.id, formData)
      onOpenChange(false)
    } catch (error) {
      console.error('Talep güncellenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Talep, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!talep) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Talep Düzenle</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Talep Sahibi Bilgileri */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="talepSahibi">Talep Sahibi *</Label>
                <Input
                  id="talepSahibi"
                  value={formData.talepSahibi || ""}
                  onChange={(e) => handleInputChange("talepSahibi", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="talepSahibiAciklamasi">Talep Sahibi Açıklaması *</Label>
                <Input
                  id="talepSahibiAciklamasi"
                  value={formData.talepSahibiAciklamasi || ""}
                  onChange={(e) => handleInputChange("talepSahibiAciklamasi", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="talepSahibiDigerAciklama">Diğer Açıklama</Label>
                <Textarea
                  id="talepSahibiDigerAciklama"
                  value={formData.talepSahibiDigerAciklama || ""}
                  onChange={(e) => handleInputChange("talepSahibiDigerAciklama", e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Konum Bilgileri */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="talepIlcesi">Talep İlçesi *</Label>
                <Input
                  id="talepIlcesi"
                  value={formData.talepIlcesi || ""}
                  onChange={(e) => handleInputChange("talepIlcesi", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="bolge">Bölge *</Label>
                <Input
                  id="bolge"
                  value={formData.bolge || ""}
                  onChange={(e) => handleInputChange("bolge", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="hatNo">Hat No *</Label>
                <Input
                  id="hatNo"
                  value={formData.hatNo || ""}
                  onChange={(e) => handleInputChange("hatNo", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* İşletici ve İletim Bilgileri */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="isletici">İşletici *</Label>
                <Input
                  id="isletici"
                  value={formData.isletici || ""}
                  onChange={(e) => handleInputChange("isletici", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="talepIletimSekli">Talep İletim Şekli *</Label>
                <Input
                  id="talepIletimSekli"
                  value={formData.talepIletimSekli || ""}
                  onChange={(e) => handleInputChange("talepIletimSekli", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Evrak Bilgileri */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="evrakTarihi">Evrak Tarihi</Label>
                <Input
                  id="evrakTarihi"
                  type="date"
                  value={formData.evrakTarihi || ""}
                  onChange={(e) => handleInputChange("evrakTarihi", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="evrakSayisi">Evrak Sayısı</Label>
                <Input
                  id="evrakSayisi"
                  value={formData.evrakSayisi || ""}
                  onChange={(e) => handleInputChange("evrakSayisi", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Talep Özeti */}
          <div>
            <Label htmlFor="talepOzeti">Talep Özeti *</Label>
            <Textarea
              id="talepOzeti"
              value={formData.talepOzeti || ""}
              onChange={(e) => handleInputChange("talepOzeti", e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Yapılan İş */}
          <div>
            <Label htmlFor="yapılanIs">Yapılan İş *</Label>
            <Textarea
              id="yapılanIs"
              value={formData.yapılanIs || ""}
              onChange={(e) => handleInputChange("yapılanIs", e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Talep Durumu */}
          <div>
            <Label htmlFor="talepDurumu">Talep Durumu *</Label>
            <Select
              value={formData.talepDurumu || ""}
              onValueChange={(value) => handleInputChange("talepDurumu", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Değerlendirilecek">Değerlendirilecek</SelectItem>
                <SelectItem value="İletildi">İletildi</SelectItem>
                <SelectItem value="Olumlu">Olumlu</SelectItem>
                <SelectItem value="Olumsuz">Olumsuz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Güncelleniyor..." : "Güncelle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 