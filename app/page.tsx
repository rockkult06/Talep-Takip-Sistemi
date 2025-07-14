"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TalepForm from "@/components/talep-form"
import TalepTable from "@/components/talep-table"
import type { Talep } from "@/types/talep"

export default function TalepTakipSistemi() {
  const [talepler, setTalepler] = useState<Talep[]>([])

  useEffect(() => {
    // Local Storage'dan verileri yükle
    const savedTalepler = localStorage.getItem("talepler")
    if (savedTalepler) {
      setTalepler(JSON.parse(savedTalepler))
    }
  }, [])

  const handleTalepEkle = (yeniTalep: Omit<Talep, "id" | "guncellemeTarihi">) => {
    const talep: Talep = {
      ...yeniTalep,
      id: Date.now().toString(),
      guncellemeTarihi: new Date().toLocaleDateString("tr-TR"),
    }

    const yeniTalepler = [...talepler, talep]
    setTalepler(yeniTalepler)
    localStorage.setItem("talepler", JSON.stringify(yeniTalepler))
  }

  const handleTalepGuncelle = (id: string, guncelTalep: Partial<Talep>) => {
    const yeniTalepler = talepler.map((talep) =>
      talep.id === id ? { ...talep, ...guncelTalep, guncellemeTarihi: new Date().toLocaleDateString("tr-TR") } : talep,
    )
    setTalepler(yeniTalepler)
    localStorage.setItem("talepler", JSON.stringify(yeniTalepler))
  }

  const handleTalepSil = (id: string) => {
    const yeniTalepler = talepler.filter((talep) => talep.id !== id)
    setTalepler(yeniTalepler)
    localStorage.setItem("talepler", JSON.stringify(yeniTalepler))
  }

  const handleTalepleriYukle = (yeniTalepler: Talep[]) => {
    setTalepler(yeniTalepler)
    localStorage.setItem("talepler", JSON.stringify(yeniTalepler))
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
              <TalepTable
                talepler={talepler}
                onTalepGuncelle={handleTalepGuncelle}
                onTalepSil={handleTalepSil}
                onTalepleriYukle={handleTalepleriYukle}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
