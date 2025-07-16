"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import TalepForm from "@/components/talep-form"
import TalepTable from "@/components/talep-table"
import Dashboard from "@/components/dashboard"
import LoginForm from "@/components/login-form"
import UserManagementDialog from "@/components/user-management-dialog"
import { Shield, LogOut, User } from "lucide-react"
import type { Talep } from "@/types/talep"

interface Kullanici {
  id: number
  kullanici_adi: string
  ad_soyad: string
  rol: string
  aktif: boolean
}

export default function TalepTakipSistemi() {
  const [talepler, setTalepler] = useState<Talep[]>([])
  const [loading, setLoading] = useState(true)
  const [kullanici, setKullanici] = useState<Kullanici | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [userManagementOpen, setUserManagementOpen] = useState(false)
  const { toast } = useToast()

  // Giriş işlemi
  const handleLogin = async (kullaniciAdi: string, sifre: string) => {
    setLoginLoading(true)
    setLoginError("")
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kullaniciAdi, sifre }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Giriş başarısız')
      }

      const data = await response.json()
      setKullanici(data.kullanici)
      
      toast({
        title: "Başarılı",
        description: `Hoş geldiniz, ${data.kullanici.ad_soyad}!`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Giriş başarısız'
      setLoginError(errorMessage)
      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoginLoading(false)
    }
  }

  // Çıkış işlemi
  const handleLogout = () => {
    setKullanici(null)
    toast({
      title: "Çıkış yapıldı",
      description: "Başarıyla çıkış yaptınız.",
    })
  }

  // Talepleri veritabanından yükle
  const talepleriYukle = async () => {
    if (!kullanici) return
    
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
    if (kullanici) {
      talepleriYukle()
    }
  }, [kullanici])

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
      
      // State'i güncelle
      setTalepler(prev => 
        prev.map(talep => 
          talep.id === id ? guncellenenTalep : talep
        )
      )

      toast({
        title: "Başarılı",
        description: "Talep başarıyla güncellendi.",
      })

      // Sayfayı yenile
      setTimeout(() => {
        window.location.reload()
      }, 1000)

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

  // Giriş yapılmamışsa login formunu göster
  if (!kullanici) {
    return <LoginForm onLogin={handleLogin} loading={loginLoading} error={loginError} />
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Talep Takip Sistemi</h1>
            <p className="text-muted-foreground">Talep girişi, takibi ve yönetimi için kapsamlı sistem</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span>{kullanici.ad_soyad}</span>
              <span className="text-muted-foreground">({kullanici.rol === 'admin' ? 'Admin' : 'Kullanıcı'})</span>
            </div>
            {kullanici.rol === 'admin' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserManagementOpen(true)}
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Kullanıcı Yönetimi
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Çıkış
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="form">Talep Girişi</TabsTrigger>
          <TabsTrigger value="table">Talep Takibi</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>Talep takip sistemi istatistikleri ve analizler</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Dashboard yükleniyor...</p>
                  </div>
                </div>
              ) : (
                <Dashboard talepler={talepler} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

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
                    onTalepEkle={handleTalepEkle}
                    onTalepleriYenile={talepleriYukle}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Kullanıcı Yönetimi Modalı */}
      <UserManagementDialog
        open={userManagementOpen}
        onOpenChange={setUserManagementOpen}
      />
    </div>
  )
}
