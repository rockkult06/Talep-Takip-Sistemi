"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Download, Upload, Trash2, Edit, Eye } from "lucide-react"
import type { Talep } from "@/types/talep"
import * as XLSX from "xlsx"
import RaporDialog from "./rapor-dialog"
import TalepEditDialog from "./talep-edit-dialog"
import TalepViewDialog from "./talep-view-dialog"

interface TalepTableProps {
  talepler: Talep[]
  onTalepGuncelle: (id: string, guncelTalep: Partial<Talep>) => void
  onTalepSil: (id: string) => void
}

type SortField = keyof Talep
type SortDirection = "asc" | "desc"

export default function TalepTable({ talepler, onTalepGuncelle, onTalepSil }: TalepTableProps) {
  const [sortField, setSortField] = useState<SortField>("guncellemeTarihi")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [filters, setFilters] = useState({
    talepSahibi: "",
    talepIlcesi: "",
    talepDurumu: "",
    isletici: "",
    search: "",
  })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedTalep, setSelectedTalep] = useState<Talep | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedTalepler = useMemo(() => {
    const filtered = talepler.filter((talep) => {
      return (
        (!filters.talepSahibi || filters.talepSahibi === "all" || talep.talepSahibi === filters.talepSahibi) &&
        (!filters.talepIlcesi || filters.talepIlcesi === "all" || talep.talepIlcesi === filters.talepIlcesi) &&
        (!filters.talepDurumu || filters.talepDurumu === "all" || talep.talepDurumu === filters.talepDurumu) &&
        (!filters.isletici || filters.isletici === "all" || talep.isletici === filters.isletici) &&
        (!filters.search ||
          talep.talepOzeti.toLowerCase().includes(filters.search.toLowerCase()) ||
          talep.hatNo.toLowerCase().includes(filters.search.toLowerCase()) ||
          talep.yapılanIs.toLowerCase().includes(filters.search.toLowerCase()))
      )
    })

    return filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (!aValue && !bValue) return 0
      if (!aValue) return sortDirection === "asc" ? -1 : 1
      if (!bValue) return sortDirection === "asc" ? 1 : -1

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [talepler, filters, sortField, sortDirection])

  const handleExcelExport = () => {
    const exportData = filteredAndSortedTalepler.map((talep) => ({
      "Talep Sahibi": talep.talepSahibi,
      "Talep Sahibi Açıklaması": talep.talepSahibiAciklamasi,
      "Diğer Açıklama": talep.talepSahibiDigerAciklama || "",
      "Talep İlçesi": talep.talepIlcesi,
      Bölge: talep.bolge,
      "Hat No": talep.hatNo,
      İşletici: talep.isletici,
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
    XLSX.utils.book_append_sheet(wb, ws, "Talepler")
    XLSX.writeFile(wb, `talepler_${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const handleExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        const importedTalepler: Talep[] = jsonData.map((row: any, index) => ({
          id: `imported_${Date.now()}_${index}`,
          talepSahibi: row["Talep Sahibi"] || "",
          talepSahibiAciklamasi: row["Talep Sahibi Açıklaması"] || "",
          talepSahibiDigerAciklama: row["Diğer Açıklama"] || "",
          talepIlcesi: row["Talep İlçesi"] || "",
          bolge: row["Bölge"] || "",
          hatNo: row["Hat No"] || "",
          isletici: row["İşletici"] || "",
          talepOzeti: row["Talep Özeti"] || "",
          talepIletimSekli: row["Talep İletim Şekli"] || "",
          evrakTarihi: row["Evrak Tarihi"] || "",
          evrakSayisi: row["Evrak Sayısı"] || "",
          yapılanIs: row["Yapılan İş"] || "",
          talepDurumu: row["Talep Durumu"] || "",
          guncellemeTarihi: row["Güncelleme Tarihi"] || new Date().toLocaleDateString("tr-TR"),
        }))

        // Excel import özelliği veritabanı entegrasyonu için kaldırıldı
        alert("Excel import özelliği şu anda kullanılamıyor. Lütfen talepleri manuel olarak ekleyin.")
        event.target.value = "" // Input'u temizle
      } catch (error) {
        alert("Excel dosyası okunurken hata oluştu. Lütfen dosya formatını kontrol edin.")
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleEditTalep = (talep: Talep) => {
    setSelectedTalep(talep)
    setEditDialogOpen(true)
  }

  const handleViewTalep = (talep: Talep) => {
    setSelectedTalep(talep)
    setViewDialogOpen(true)
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

  const uniqueValues = {
    talepSahibi: [...new Set(talepler.map((t) => t.talepSahibi))],
    talepIlcesi: [...new Set(talepler.map((t) => t.talepIlcesi))],
    talepDurumu: [...new Set(talepler.map((t) => t.talepDurumu))],
    isletici: [...new Set(talepler.map((t) => t.isletici))],
  }

  return (
    <div className="space-y-6">
      {/* Excel İşlemleri ve Rapor */}
      <Card>
        <CardHeader>
          <CardTitle>Dışa Aktarma ve Raporlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleExcelExport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Excel'e Aktar
            </Button>
            <div className="flex items-center gap-2">
              <Label htmlFor="excel-import" className="cursor-pointer">
                <Button className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Excel'den Yükle
                </Button>
              </Label>
              <Input
                id="excel-import"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelImport}
                className="hidden"
              />
            </div>
            <RaporDialog talepler={talepler} />
          </div>
        </CardContent>
      </Card>

      {/* Filtreler */}
      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Genel Arama</Label>
              <Input
                placeholder="Özet, hat no, yapılan iş..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Talep Sahibi</Label>
              <Select
                value={filters.talepSahibi}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, talepSahibi: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tümü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {uniqueValues.talepSahibi.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>İlçe</Label>
              <Select
                value={filters.talepIlcesi}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, talepIlcesi: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tümü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {uniqueValues.talepIlcesi.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Durum</Label>
              <Select
                value={filters.talepDurumu}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, talepDurumu: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tümü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {uniqueValues.talepDurumu.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>İşletici</Label>
              <Select
                value={filters.isletici}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, isletici: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tümü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {uniqueValues.isletici.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tablo */}
      <Card>
        <CardHeader>
          <CardTitle>Talepler ({filteredAndSortedTalepler.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("talepSahibi")}>
                    <div className="flex items-center gap-1">
                      Talep Sahibi
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("talepSahibiAciklamasi")}>
                    <div className="flex items-center gap-1">
                      Açıklama
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("talepIlcesi")}>
                    <div className="flex items-center gap-1">
                      İlçe
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("bolge")}>
                    <div className="flex items-center gap-1">
                      Bölge
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("hatNo")}>
                    <div className="flex items-center gap-1">
                      Hat No
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("isletici")}>
                    <div className="flex items-center gap-1">
                      İşletici
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Talep Özeti</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("talepIletimSekli")}>
                    <div className="flex items-center gap-1">
                      İletim Şekli
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Yapılan İş</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("talepDurumu")}>
                    <div className="flex items-center gap-1">
                      Durum
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("guncellemeTarihi")}>
                    <div className="flex items-center gap-1">
                      Güncelleme
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTalepler.map((talep) => (
                  <TableRow key={talep.id}>
                    <TableCell className="font-medium">{talep.talepSahibi}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <div className="truncate">{talep.talepSahibiAciklamasi}</div>
                        {talep.talepSahibiDigerAciklama && (
                          <div className="text-sm text-muted-foreground truncate">{talep.talepSahibiDigerAciklama}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{talep.talepIlcesi}</TableCell>
                    <TableCell>{talep.bolge}</TableCell>
                    <TableCell>{talep.hatNo}</TableCell>
                    <TableCell>{talep.isletici}</TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate" title={talep.talepOzeti}>
                        {talep.talepOzeti}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[150px]">
                        <div className="truncate">{talep.talepIletimSekli}</div>
                        {talep.evrakTarihi && (
                          <div className="text-sm text-muted-foreground">
                            {talep.evrakTarihi} - {talep.evrakSayisi}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate" title={talep.yapılanIs}>
                        {talep.yapılanIs}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getDurumBadgeVariant(talep.talepDurumu)}>{talep.talepDurumu}</Badge>
                    </TableCell>
                    <TableCell>{talep.guncellemeTarihi}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTalep(talep)}
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTalep(talep)}
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Bu talebi silmek istediğinizden emin misiniz?")) {
                              onTalepSil(talep.id)
                            }
                          }}
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredAndSortedTalepler.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Henüz talep bulunmuyor veya filtrelere uygun talep yok.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modaller */}
      <TalepEditDialog
        talep={selectedTalep}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={onTalepGuncelle}
      />
      
      <TalepViewDialog
        talep={selectedTalep}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  )
}
