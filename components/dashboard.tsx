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
    <div className="space-y-8">
      {/* KPI Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Toplam Talep</h3>
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{stats.totalTalepler}</div>
          <p className="text-sm text-gray-500 mt-1">
            Tüm talepler
          </p>
        </div>

        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Yeni Talepler</h3>
            <Clock className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{stats.yeniTalepler}</div>
          <p className="text-sm text-gray-500 mt-1">
            Değerlendirilecek
          </p>
        </div>

        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Olumlu Sonuç</h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{stats.olumluTalepler}</div>
          <p className="text-sm text-gray-500 mt-1">
            %{stats.durumYuzdeleri.olumlu.toFixed(1)} oranında
          </p>
        </div>

        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Son 30 Gün</h3>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{stats.son30Gun}</div>
          <p className="text-sm text-gray-500 mt-1">
            Yeni talep
          </p>
        </div>
      </div>

      {/* Durum Dağılımı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="modern-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Durum Dağılımı</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="rounded-full">Değerlendirilecek</Badge>
                  <span className="text-sm font-medium">{stats.yeniTalepler}</span>
                </div>
                <span className="text-sm text-gray-500">
                  %{stats.durumYuzdeleri.yeni.toFixed(1)}
                </span>
              </div>
              <Progress value={stats.durumYuzdeleri.yeni} className="h-3 rounded-full" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="rounded-full">Olumlu</Badge>
                  <span className="text-sm font-medium">{stats.olumluTalepler}</span>
                </div>
                <span className="text-sm text-gray-500">
                  %{stats.durumYuzdeleri.olumlu.toFixed(1)}
                </span>
              </div>
              <Progress value={stats.durumYuzdeleri.olumlu} className="h-3 rounded-full" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="destructive" className="rounded-full">Olumsuz</Badge>
                  <span className="text-sm font-medium">{stats.olumsuzTalepler}</span>
                </div>
                <span className="text-sm text-gray-500">
                  %{stats.durumYuzdeleri.olumsuz.toFixed(1)}
                </span>
              </div>
              <Progress value={stats.durumYuzdeleri.olumsuz} className="h-3 rounded-full" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="rounded-full">İletildi</Badge>
                  <span className="text-sm font-medium">{stats.iletildiTalepler}</span>
                </div>
                <span className="text-sm text-gray-500">
                  %{stats.durumYuzdeleri.iletildi.toFixed(1)}
                </span>
              </div>
              <Progress value={stats.durumYuzdeleri.iletildi} className="h-3 rounded-full" />
            </div>
          </div>
        </div>

        {/* İlçe Dağılımı */}
        <div className="modern-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">En Çok Talep Olan İlçeler</h3>
          </div>
          <div className="space-y-4">
            {topIlceler.map(([ilce, sayi], index) => (
              <div key={ilce} className="flex items-center justify-between p-3 bg-white/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-700">{ilce}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-800">{sayi}</span>
                  <span className="text-sm text-gray-500">
                    talep
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* İşletici Dağılımı ve Hızlı İstatistikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="modern-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">En Aktif İşleticiler</h3>
          </div>
          <div className="space-y-4">
            {topIsleticiler.map(([isletici, sayi], index) => (
              <div key={isletici} className="flex items-center justify-between p-3 bg-white/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-700">{isletici}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-800">{sayi}</span>
                  <span className="text-sm text-gray-500">
                    talep
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modern-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Hızlı İstatistikler</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Benzersiz Talep Sahipleri</span>
              </div>
              <span className="text-xl font-bold text-gray-800">
                {new Set(talepler.map(t => t.talepSahibi)).size}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Toplam İlçe</span>
              </div>
              <span className="text-xl font-bold text-gray-800">
                {new Set(talepler.map(t => t.talepIlcesi)).size}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">Toplam İşletici</span>
              </div>
              <span className="text-xl font-bold text-gray-800">
                {new Set(talepler.map(t => t.isletici)).size}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Bekleyen Talepler</span>
              </div>
              <span className="text-xl font-bold text-orange-600">
                {stats.yeniTalepler}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="modern-card p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Başarı Oranı</p>
              <p className="text-3xl font-bold text-blue-700">
                %{stats.totalTalepler > 0 ? ((stats.olumluTalepler / stats.totalTalepler) * 100).toFixed(1) : '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="modern-card p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Aylık Trend</p>
              <p className="text-3xl font-bold text-green-700">
                {stats.son30Gun}
              </p>
              <p className="text-xs text-green-600">son 30 gün</p>
            </div>
          </div>
        </div>

        <div className="modern-card p-6 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Ortalama</p>
              <p className="text-3xl font-bold text-purple-700">
                {stats.totalTalepler > 0 ? (stats.totalTalepler / Math.max(1, new Set(talepler.map(t => t.talepSahibi)).size)).toFixed(1) : '0'}
              </p>
              <p className="text-xs text-purple-600">talep/kişi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 