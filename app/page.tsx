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
  const [activeTab, setActiveTab] = useState("dashboard")
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 modern-header">
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Talep Takip Sistemi</h1>
              <p className="text-muted-foreground text-lg">Talep girişi, takibi ve yönetimi için kapsamlı sistem</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-sm modern-card px-4 py-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{kullanici.ad_soyad}</span>
                <span className="text-muted-foreground">({kullanici.rol === 'admin' ? 'Admin' : 'Kullanıcı'})</span>
              </div>
              {kullanici.rol === 'admin' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUserManagementOpen(true)}
                  className="modern-button flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Kullanıcı Yönetimi
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="modern-button flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>
        
        {/* Sticky Tabs */}
        <div className="container mx-auto px-6 max-w-7xl pb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="modern-tabs grid w-full grid-cols-3 p-1">
              <TabsTrigger value="dashboard" className="rounded-xl">Dashboard</TabsTrigger>
              <TabsTrigger value="form" className="rounded-xl">Talep Girişi</TabsTrigger>
              <TabsTrigger value="table" className="rounded-xl">Talep Takibi</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto p-6 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="dashboard">
            <div className="modern-card p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-muted-foreground">Talep takip sistemi istatistikleri ve analizler</p>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Dashboard yükleniyor...</p>
                  </div>
                </div>
              ) : (
                <Dashboard talepler={talepler} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="form">
            <div className="modern-card p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Yeni Talep Girişi</h2>
                <p className="text-muted-foreground">Aşağıdaki formu doldurarak yeni bir talep oluşturun</p>
              </div>
              <TalepForm onSubmit={handleTalepEkle} />
            </div>
          </TabsContent>

          <TabsContent value="table">
            <div className="modern-card p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Talep Takip Tablosu</h2>
                <p className="text-muted-foreground">Mevcut talepleri görüntüleyin, düzenleyin ve yönetin</p>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Talepler yükleniyor...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Toplam {talepler.length} talep bulundu
                    </p>
                    <Button 
                      onClick={talepleriYukle} 
                      variant="outline" 
                      size="sm"
                      className="modern-button"
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
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Kullanıcı Yönetimi Modalı */}
      <UserManagementDialog
        open={userManagementOpen}
        onOpenChange={setUserManagementOpen}
      />
    </div>
  )
}
