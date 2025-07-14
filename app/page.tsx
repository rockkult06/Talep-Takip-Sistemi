"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import TalepForm from "@/components/talep-form"
import TalepTable from "@/components/talep-table"
import type { Talep } from "@/types/talep"

export default function TalepTakipSistemi() {
  const [talepler, setTalepler] = useState<Talep[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Talepleri veritabanından yükle
  const talepleriYukle = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/talepler')
      if (!response.ok) {
        throw new Error('Talepler yüklenemedi')
      }
      const data = await response.json()
      setTalepler(data)
    } catch (error) {
      console.error('Talepler yüklenirken hata:', error)
      toast({
        title: "Hata",
        description: "Talepler yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    talepleriYukle()
  }, [])

  const handleTalepEkle = async (yeniTalep: Omit<Talep, "id" | "guncellemeTarihi">) => {
    try {
      const response = await fetch('/api/talepler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(yeniTalep),
      })

      if (!response.ok) {
        throw new Error('Talep eklenemedi')
      }

      const eklenenTalep = await response.json()
      setTalepler(prev => [eklenenTalep, ...prev])
      
      toast({
        title: "Başarılı",
        description: "Talep başarıyla eklendi.",
      })
    } catch (error) {
      console.error('Talep eklenirken hata:', error)
      toast({
        title: "Hata",
        description: "Talep eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleTalepGuncelle = async (id: string, guncelTalep: Partial<Talep>) => {
    try {
      const response = await fetch(`/api/talepler/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guncelTalep),
      })

      if (!response.ok) {
        throw new Error('Talep güncellenemedi')
      }

      const guncellenenTalep = await response.json()
      setTalepler(prev => 
        prev.map(talep => 
          talep.id === id ? guncellenenTalep : talep
        )
      )

      toast({
        title: "Başarılı",
        description: "Talep başarıyla güncellendi.",
      })
    } catch (error) {
      console.error('Talep güncellenirken hata:', error)
      toast({
        title: "Hata",
        description: "Talep güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleTalepSil = async (id: string) => {
    try {
      const response = await fetch(`/api/talepler/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Talep silinemedi')
      }

      setTalepler(prev => prev.filter(talep => talep.id !== id))
      
      toast({
        title: "Başarılı",
        description: "Talep başarıyla silindi.",
      })
    } catch (error) {
      console.error('Talep silinirken hata:', error)
      toast({
        title: "Hata",
        description: "Talep silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">Talep Takip Sistemi</h1>
        <p className="text-muted-foreground text-center">Talep girişi, takibi ve yönetimi için kapsamlı sistem</p>
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Talep Girişi</TabsTrigger>
          <TabsTrigger value="table">Talep Takibi</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Yeni Talep Girişi</CardTitle>
              <CardDescription>Aşağıdaki formu doldurarak yeni bir talep oluşturun</CardDescription>
            </CardHeader>
            <CardContent>
              <TalepForm onSubmit={handleTalepEkle} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Talep Takip Tablosu</CardTitle>
              <CardDescription>Mevcut talepleri görüntüleyin, düzenleyin ve yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Talepler yükleniyor...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Toplam {talepler.length} talep bulundu
                    </p>
                    <Button 
                      onClick={talepleriYukle} 
                      variant="outline" 
                      size="sm"
                    >
                      Yenile
                    </Button>
                  </div>
                  <TalepTable
                    talepler={talepler}
                    onTalepGuncelle={handleTalepGuncelle}
                    onTalepSil={handleTalepSil}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
