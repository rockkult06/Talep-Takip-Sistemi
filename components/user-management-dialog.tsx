"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, UserPlus, Edit, Trash2, Shield, Users } from "lucide-react"

interface Kullanici {
  id: number
  kullanici_adi: string
  ad_soyad: string
  rol: string
  aktif: boolean
  olusturma_tarihi: string
  son_giris_tarihi?: string
}

interface UserManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UserManagementDialog({ open, onOpenChange }: UserManagementDialogProps) {
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    kullanici_adi: "",
    sifre: "",
    ad_soyad: "",
    rol: "kullanici"
  })
  const [editingUser, setEditingUser] = useState<Kullanici | null>(null)

  useEffect(() => {
    if (open) {
      loadKullanicilar()
    }
  }, [open])

  const loadKullanicilar = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/kullanicilar')
      if (response.ok) {
        const data = await response.json()
        setKullanicilar(data)
      } else {
        setError('Kullanıcılar yüklenemedi')
      }
    } catch (error) {
      setError('Kullanıcılar yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = editingUser ? `/api/kullanicilar/${editingUser.id}` : '/api/kullanicilar'
      const method = editingUser ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'İşlem başarısız')
      }

      await loadKullanicilar()
      resetForm()
      onOpenChange(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bilinmeyen hata')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/kullanicilar/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Kullanıcı silinemedi')
      }

      await loadKullanicilar()
    } catch (error) {
      setError('Kullanıcı silinirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (kullanici: Kullanici) => {
    setEditingUser(kullanici)
    setFormData({
      kullanici_adi: kullanici.kullanici_adi,
      sifre: "",
      ad_soyad: kullanici.ad_soyad,
      rol: kullanici.rol
    })
  }

  const resetForm = () => {
    setFormData({
      kullanici_adi: "",
      sifre: "",
      ad_soyad: "",
      rol: "kullanici"
    })
    setEditingUser(null)
  }

  const getRolBadgeVariant = (rol: string) => {
    return rol === 'admin' ? 'default' : 'secondary'
  }

  const getAktifBadgeVariant = (aktif: boolean) => {
    return aktif ? 'default' : 'destructive'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Kullanıcı Yönetimi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Yeni Kullanıcı Formu */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kullanici-adi">Kullanıcı Adı</Label>
                    <Input
                      id="kullanici-adi"
                      value={formData.kullanici_adi}
                      onChange={(e) => setFormData(prev => ({ ...prev, kullanici_adi: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sifre">
                      {editingUser ? 'Yeni Şifre (boş bırakılabilir)' : 'Şifre'}
                    </Label>
                    <Input
                      id="sifre"
                      type="password"
                      value={formData.sifre}
                      onChange={(e) => setFormData(prev => ({ ...prev, sifre: e.target.value }))}
                      required={!editingUser}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ad-soyad">Ad Soyad</Label>
                    <Input
                      id="ad-soyad"
                      value={formData.ad_soyad}
                      onChange={(e) => setFormData(prev => ({ ...prev, ad_soyad: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rol">Rol</Label>
                    <Select
                      value={formData.rol}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, rol: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kullanici">Kullanıcı</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        {editingUser ? <Edit className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                        {editingUser ? 'Güncelle' : 'Ekle'}
                      </>
                    )}
                  </Button>
                  {editingUser && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      İptal
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Kullanıcı Listesi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Kullanıcı Listesi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Yükleniyor...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kullanıcı Adı</TableHead>
                        <TableHead>Ad Soyad</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Son Giriş</TableHead>
                        <TableHead>İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {kullanicilar.map((kullanici) => (
                        <TableRow key={kullanici.id}>
                          <TableCell className="font-medium">{kullanici.kullanici_adi}</TableCell>
                          <TableCell>{kullanici.ad_soyad}</TableCell>
                          <TableCell>
                            <Badge variant={getRolBadgeVariant(kullanici.rol)}>
                              {kullanici.rol === 'admin' ? 'Admin' : 'Kullanıcı'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getAktifBadgeVariant(kullanici.aktif)}>
                              {kullanici.aktif ? 'Aktif' : 'Pasif'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {kullanici.son_giris_tarihi 
                              ? new Date(kullanici.son_giris_tarihi).toLocaleDateString('tr-TR')
                              : 'Hiç giriş yapmamış'
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(kullanici)}
                                disabled={loading}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(kullanici.id)}
                                disabled={loading || kullanici.kullanici_adi === 'Admin01'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 