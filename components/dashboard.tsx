"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MapPin,
  Activity,
  BarChart3,
  PieChart
} from "lucide-react"
import type { Talep } from "@/types/talep"

interface DashboardProps {
  talepler: Talep[]
}

export default function Dashboard({ talepler }: DashboardProps) {
  const stats = useMemo(() => {
    const totalTalepler = talepler.length
    const yeniTalepler = talepler.filter(t => t.talepDurumu === "Değerlendirilecek").length
    const olumluTalepler = talepler.filter(t => t.talepDurumu === "Olumlu").length
    const olumsuzTalepler = talepler.filter(t => t.talepDurumu === "Olumsuz").length
    const iletildiTalepler = talepler.filter(t => t.talepDurumu === "İletildi").length
    
    // İlçe bazında dağılım
    const ilceDagilimi = talepler.reduce((acc, talep) => {
      acc[talep.talepIlcesi] = (acc[talep.talepIlcesi] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // İşletici bazında dağılım
    const isleticiDagilimi = talepler.reduce((acc, talep) => {
      acc[talep.isletici] = (acc[talep.isletici] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Son 30 günlük trend
    const son30Gun = talepler.filter(talep => {
      const talepTarihi = new Date(talep.guncellemeTarihi)
      const bugun = new Date()
      const gunFarki = (bugun.getTime() - talepTarihi.getTime()) / (1000 * 3600 * 24)
      return gunFarki <= 30
    }).length

    // Durum yüzdeleri
    const durumYuzdeleri = {
      yeni: totalTalepler > 0 ? (yeniTalepler / totalTalepler) * 100 : 0,
      olumlu: totalTalepler > 0 ? (olumluTalepler / totalTalepler) * 100 : 0,
      olumsuz: totalTalepler > 0 ? (olumsuzTalepler / totalTalepler) * 100 : 0,
      iletildi: totalTalepler > 0 ? (iletildiTalepler / totalTalepler) * 100 : 0,
    }

    return {
      totalTalepler,
      yeniTalepler,
      olumluTalepler,
      olumsuzTalepler,
      iletildiTalepler,
      son30Gun,
      ilceDagilimi,
      isleticiDagilimi,
      durumYuzdeleri
    }
  }, [talepler])

  const topIlceler = Object.entries(stats.ilceDagilimi)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  const topIsleticiler = Object.entries(stats.isleticiDagilimi)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* KPI Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Talep</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTalepler}</div>
            <p className="text-xs text-muted-foreground">
              Tüm talepler
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yeni Talepler</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.yeniTalepler}</div>
            <p className="text-xs text-muted-foreground">
              Değerlendirilecek
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Olumlu Sonuç</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.olumluTalepler}</div>
            <p className="text-xs text-muted-foreground">
              %{stats.durumYuzdeleri.olumlu.toFixed(1)} oranında
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Son 30 Gün</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.son30Gun}</div>
            <p className="text-xs text-muted-foreground">
              Yeni talep
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Durum Dağılımı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Durum Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Değerlendirilecek</Badge>
                  <span className="text-sm font-medium">{stats.yeniTalepler}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  %{stats.durumYuzdeleri.yeni.toFixed(1)}
                </span>
              </div>
              <Progress value={stats.durumYuzdeleri.yeni} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Olumlu</Badge>
                  <span className="text-sm font-medium">{stats.olumluTalepler}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  %{stats.durumYuzdeleri.olumlu.toFixed(1)}
                </span>
              </div>
              <Progress value={stats.durumYuzdeleri.olumlu} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Olumsuz</Badge>
                  <span className="text-sm font-medium">{stats.olumsuzTalepler}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  %{stats.durumYuzdeleri.olumsuz.toFixed(1)}
                </span>
              </div>
              <Progress value={stats.durumYuzdeleri.olumsuz} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">İletildi</Badge>
                  <span className="text-sm font-medium">{stats.iletildiTalepler}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  %{stats.durumYuzdeleri.iletildi.toFixed(1)}
                </span>
              </div>
              <Progress value={stats.durumYuzdeleri.iletildi} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* İlçe Dağılımı */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              En Çok Talep Olan İlçeler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topIlceler.map(([ilce, sayi], index) => (
                <div key={ilce} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{ilce}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{sayi}</span>
                    <span className="text-xs text-muted-foreground">
                      talep
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* İşletici Dağılımı ve Hızlı İstatistikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              En Aktif İşleticiler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topIsleticiler.map(([isletici, sayi], index) => (
                <div key={isletici} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{isletici}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{sayi}</span>
                    <span className="text-xs text-muted-foreground">
                      talep
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Hızlı İstatistikler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Benzersiz Talep Sahipleri</span>
                </div>
                <span className="text-lg font-bold">
                  {new Set(talepler.map(t => t.talepSahibi)).size}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Toplam İlçe</span>
                </div>
                <span className="text-lg font-bold">
                  {new Set(talepler.map(t => t.talepIlcesi)).size}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Toplam İşletici</span>
                </div>
                <span className="text-lg font-bold">
                  {new Set(talepler.map(t => t.isletici)).size}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Bekleyen Talepler</span>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {stats.yeniTalepler}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Başarı Oranı</p>
                <p className="text-2xl font-bold text-blue-700">
                  %{stats.totalTalepler > 0 ? ((stats.olumluTalepler / stats.totalTalepler) * 100).toFixed(1) : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Aylık Trend</p>
                <p className="text-2xl font-bold text-green-700">
                  {stats.son30Gun}
                </p>
                <p className="text-xs text-green-600">son 30 gün</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Ortalama</p>
                <p className="text-2xl font-bold text-purple-700">
                  {stats.totalTalepler > 0 ? (stats.totalTalepler / Math.max(1, new Set(talepler.map(t => t.talepSahibi)).size)).toFixed(1) : '0'}
                </p>
                <p className="text-xs text-purple-600">talep/kişi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 