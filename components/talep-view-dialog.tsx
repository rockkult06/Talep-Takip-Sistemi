"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, User, MapPin, FileText, Activity } from "lucide-react"
import type { Talep } from "@/types/talep"

interface TalepLog {
  id: number
  islem_tipi: string
  alan_adi?: string
  eski_deger?: string
  yeni_deger?: string
  aciklama?: string
  islem_tarihi: string
  kullanici: string
}

interface TalepViewDialogProps {
  talep: Talep | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TalepViewDialog({ talep, open, onOpenChange }: TalepViewDialogProps) {
  const [logs, setLogs] = useState<TalepLog[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (talep && open) {
      loadLogs()
    }
  }, [talep, open])

  const loadLogs = async () => {
    if (!talep) return

    setLoading(true)
    try {
      const response = await fetch(`/api/talepler/${talep.id}/logs`)
      if (response.ok) {
        const data = await response.json()
        setLogs(data)
      }
    } catch (error) {
      console.error('Loglar yüklenirken hata:', error)
    } finally {
      setLoading(false)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR')
  }

  const getIslemTipiText = (tip: string) => {
    switch (tip) {
      case 'guncelleme':
        return 'Güncelleme'
      case 'silme':
        return 'Silme'
      case 'durum_degisikligi':
        return 'Durum Değişikliği'
      default:
        return tip
    }
  }

  if (!talep) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Talep Detayları</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6">
            {/* Talep Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Talep Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <User className="w-4 h-4" />
                      Talep Sahibi
                    </div>
                    <p className="font-medium">{talep.talepSahibi}</p>
                    <p className="text-sm text-muted-foreground">{talep.talepSahibiAciklamasi}</p>
                    {talep.talepSahibiDigerAciklama && (
                      <p className="text-sm text-muted-foreground mt-1">{talep.talepSahibiDigerAciklama}</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <MapPin className="w-4 h-4" />
                      Konum Bilgileri
                    </div>
                    <p className="font-medium">{talep.talepIlcesi}</p>
                    <p className="text-sm text-muted-foreground">Bölge: {talep.bolge}</p>
                    <p className="text-sm text-muted-foreground">Hat No: {talep.hatNo}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">İşletici</div>
                    <p className="font-medium">{talep.isletici}</p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">İletim Şekli</div>
                    <p className="font-medium">{talep.talepIletimSekli}</p>
                    {talep.evrakTarihi && (
                      <p className="text-sm text-muted-foreground">
                        {talep.evrakTarihi} - {talep.evrakSayisi}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Talep Özeti</div>
                  <p className="whitespace-pre-wrap">{talep.talepOzeti}</p>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Yapılan İş</div>
                  <p className="whitespace-pre-wrap">{talep.yapılanIs}</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Durum</div>
                    <Badge variant={getDurumBadgeVariant(talep.talepDurumu)}>
                      {talep.talepDurumu}
                    </Badge>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <Clock className="w-4 h-4" />
                      Güncelleme Tarihi
                    </div>
                    <p className="font-medium">{talep.guncellemeTarihi}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Log Kayıtları */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  İşlem Geçmişi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loglar yükleniyor...</p>
                  </div>
                ) : logs.length > 0 ? (
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div key={log.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getIslemTipiText(log.islem_tipi)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {log.kullanici}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(log.islem_tarihi)}
                          </span>
                        </div>
                        
                        {log.alan_adi && (
                          <div className="text-sm mb-1">
                            <span className="font-medium">Alan:</span> {log.alan_adi}
                          </div>
                        )}
                        
                        {log.eski_deger && log.yeni_deger && (
                          <div className="text-sm space-y-1">
                            <div>
                              <span className="font-medium">Eski Değer:</span>
                              <span className="text-red-600 ml-1">{log.eski_deger}</span>
                            </div>
                            <div>
                              <span className="font-medium">Yeni Değer:</span>
                              <span className="text-green-600 ml-1">{log.yeni_deger}</span>
                            </div>
                          </div>
                        )}
                        
                        {log.aciklama && (
                          <div className="text-sm mt-2">
                            <span className="font-medium">Açıklama:</span>
                            <p className="text-muted-foreground mt-1">{log.aciklama}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Henüz işlem geçmişi bulunmuyor.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 