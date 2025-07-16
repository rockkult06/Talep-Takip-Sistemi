"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Lock } from "lucide-react"

interface LoginFormProps {
  onLogin: (kullaniciAdi: string, sifre: string) => void
  loading: boolean
  error?: string
}

export default function LoginForm({ onLogin, loading, error }: LoginFormProps) {
  const [kullaniciAdi, setKullaniciAdi] = useState("")
  const [sifre, setSifre] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (kullaniciAdi && sifre) {
      onLogin(kullaniciAdi, sifre)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Talep Takip Sistemi</CardTitle>
          <CardDescription>
            Kullanıcı adı ve şifrenizi girerek sisteme giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="kullanici-adi">Kullanıcı Adı</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="kullanici-adi"
                  type="text"
                  placeholder="Kullanıcı adınızı girin"
                  value={kullaniciAdi}
                  onChange={(e) => setKullaniciAdi(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sifre">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="sifre"
                  type="password"
                  placeholder="Şifrenizi girin"
                  value={sifre}
                  onChange={(e) => setSifre(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !kullaniciAdi || !sifre}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>


        </CardContent>
      </Card>
    </div>
  )
} 