"use client"

import React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowUpDown, Download, Upload, Trash2, Edit, Eye, ChevronDown, ChevronRight, LayoutGrid } from "lucide-react"
import type { Talep } from "@/types/talep"
import * as XLSX from "xlsx"
import RaporDialog from "./rapor-dialog"
import TalepEditDialog from "./talep-edit-dialog"
import TalepViewDialog from "./talep-view-dialog"

interface TalepTableProps {
  talepler: Talep[]
  onTalepGuncelle: (id: string, guncelTalep: Partial<Talep>) => void
  onTalepSil: (id: string) => void
  onTalepEkle?: (yeniTalep: Omit<Talep, "id" | "guncellemeTarihi">) => void
}

type SortField = keyof Talep
type SortDirection = "asc" | "desc"

export default function TalepTable({ talepler, onTalepGuncelle, onTalepSil, onTalepEkle }: TalepTableProps) {
  const [sortField, setSortField] = useState<SortField>("guncellemeTarihi")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [compactView, setCompactView] = useState(true)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedTalepler, setSelectedTalepler] = useState<Set<string>>(new Set())
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

  const toggleRowExpansion = (talepId: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(talepId)) {
      newExpandedRows.delete(talepId)
    } else {
      newExpandedRows.add(talepId)
    }
    setExpandedRows(newExpandedRows)
  }

  const toggleTalepSelection = (talepId: string) => {
    const newSelectedTalepler = new Set(selectedTalepler)
    if (newSelectedTalepler.has(talepId)) {
      newSelectedTalepler.delete(talepId)
    } else {
      newSelectedTalepler.add(talepId)
    }
    setSelectedTalepler(newSelectedTalepler)
  }

  const toggleAllTalepler = () => {
    if (selectedTalepler.size === filteredAndSortedTalepler.length) {
      setSelectedTalepler(new Set())
    } else {
      setSelectedTalepler(new Set(filteredAndSortedTalepler.map(t => t.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedTalepler.size === 0) {
      alert("Lütfen silinecek talepleri seçin")
      return
    }

    if (!confirm(`${selectedTalepler.size} talebi silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const response = await fetch('/api/talepler/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: Array.from(selectedTalepler) }),
      })

      const result = await response.json()
      
      if (response.ok) {
        alert(result.message)
        setSelectedTalepler(new Set())
        // Sayfayı yenile
        window.location.reload()
      } else {
        alert("Silme işlemi başarısız: " + result.error)
      }
    } catch (error) {
      console.error('Toplu silme hatası:', error)
      alert("Silme işlemi sırasında hata oluştu")
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

  const handleExcelImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        if (jsonData.length === 0) {
          alert("Excel dosyasında veri bulunamadı")
          event.target.value = ""
          return
        }

        const importedTalepler = jsonData.map((row: any) => ({
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
          talepDurumu: row["Talep Durumu"] || "Değerlendirilecek",
        }))

        // Verileri API'ye gönder
        const response = await fetch('/api/talepler/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ talepler: importedTalepler }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Import işlemi başarısız oldu')
        }

        const result = await response.json()
        alert(`Başarılı: ${result.message}`)
        
        // Sayfayı yenile
        window.location.reload()
        
      } catch (error) {
        console.error('Excel import hatası:', error)
        alert(`Excel import hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
      } finally {
        event.target.value = "" // Input'u temizle
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
    talepSahibi: [...new Set(talepler.map((t) => t.talepSahibi))].filter(Boolean),
    talepIlcesi: [...new Set(talepler.map((t) => t.talepIlcesi))].filter(Boolean),
    talepDurumu: [...new Set(talepler.map((t) => t.talepDurumu))].filter(Boolean),
    isletici: [...new Set(talepler.map((t) => t.isletici))].filter(Boolean),
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
              <Button 
                onClick={() => document.getElementById('excel-import')?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Excel'den Yükle
              </Button>
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
          <div className="flex items-center justify-between">
            <CardTitle>Talepler ({filteredAndSortedTalepler.length})</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={compactView ? "default" : "outline"}
                size="sm"
                onClick={() => setCompactView(!compactView)}
                className="flex items-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                {compactView ? "Kompakt Görünüm" : "Tam Görünüm"}
              </Button>

              {selectedTalepler.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Seçilenleri Sil ({selectedTalepler.size})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedTalepler.size === filteredAndSortedTalepler.length && filteredAndSortedTalepler.length > 0}
                      onCheckedChange={toggleAllTalepler}
                    />
                  </TableHead>
                  {!compactView && (
                    <TableHead className="cursor-pointer" onClick={() => handleSort("talepSahibi")}>
                      <div className="flex items-center gap-1">
                        Talep Sahibi
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                  )}
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
                  {!compactView && (
                    <TableHead className="cursor-pointer" onClick={() => handleSort("isletici")}>
                      <div className="flex items-center gap-1">
                        İşletici
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                  )}
                  <TableHead>Talep Özeti</TableHead>
                  {!compactView && (
                    <>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("talepIletimSekli")}>
                        <div className="flex items-center gap-1">
                          İletim Şekli
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </TableHead>
                      <TableHead>Yapılan İş</TableHead>
                    </>
                  )}
                  <TableHead className="cursor-pointer" onClick={() => handleSort("talepDurumu")}>
                    <div className="flex items-center gap-1">
                      Durum
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  {!compactView && (
                    <TableHead className="cursor-pointer" onClick={() => handleSort("guncellemeTarihi")}>
                      <div className="flex items-center gap-1">
                        Güncelleme
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                  )}
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTalepler.map((talep) => (
                  <React.Fragment key={talep.id}>
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          checked={selectedTalepler.has(talep.id)}
                          onCheckedChange={() => toggleTalepSelection(talep.id)}
                        />
                      </TableCell>
                      {!compactView && (
                        <TableCell className="font-medium">{talep.talepSahibi}</TableCell>
                      )}
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
                      {!compactView && (
                        <TableCell>{talep.isletici}</TableCell>
                      )}
                      <TableCell>
                        <div className="max-w-[300px] truncate" title={talep.talepOzeti}>
                          {talep.talepOzeti}
                        </div>
                      </TableCell>
                      {!compactView && (
                        <>
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
                        </>
                      )}
                      <TableCell>
                        <Badge variant={getDurumBadgeVariant(talep.talepDurumu)}>{talep.talepDurumu}</Badge>
                      </TableCell>
                      {!compactView && (
                        <TableCell>{talep.guncellemeTarihi}</TableCell>
                      )}
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRowExpansion(talep.id)}
                            title="Detayları Göster/Gizle"
                          >
                            {expandedRows.has(talep.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </Button>
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
                          onClick={async () => {
                            if (confirm("Bu talebi silmek istediğinizden emin misiniz?")) {
                              try {
                                const response = await fetch(`/api/talepler/${talep.id}`, {
                                  method: 'DELETE',
                                })
                                
                                if (response.ok) {
                                  alert("Talep başarıyla silindi")
                                  window.location.reload()
                                } else {
                                  const result = await response.json()
                                  alert("Silme işlemi başarısız: " + result.error)
                                }
                              } catch (error) {
                                console.error('Silme hatası:', error)
                                alert("Silme işlemi sırasında hata oluştu")
                              }
                            }
                          }}
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(talep.id) && (
                      <TableRow>
                        <TableCell colSpan={compactView ? 7 : 11} className="p-0">
                          <div className="bg-muted/50 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {!compactView && (
                                <div>
                                  <strong>Talep Sahibi:</strong> {talep.talepSahibi}
                                </div>
                              )}
                              <div>
                                <strong>İşletici:</strong> {talep.isletici}
                              </div>
                              <div>
                                <strong>İletim Şekli:</strong> {talep.talepIletimSekli}
                              </div>
                              <div>
                                <strong>Evrak Tarihi:</strong> {talep.evrakTarihi || "-"}
                              </div>
                              <div>
                                <strong>Evrak Sayısı:</strong> {talep.evrakSayisi || "-"}
                              </div>
                              <div>
                                <strong>Yapılan İş:</strong> {talep.yapılanIs}
                              </div>
                              {!compactView && (
                                <div>
                                  <strong>Güncelleme Tarihi:</strong> {talep.guncellemeTarihi}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
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
