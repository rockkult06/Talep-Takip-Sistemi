import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Tüm "Dış Taşıt" değerlerini "İzTaşıt" olarak güncelle
    const result = await sql`
      UPDATE talepler 
      SET isletici = 'İzTaşıt' 
      WHERE isletici = 'Dış Taşıt'
    `

    return NextResponse.json({ 
      success: true, 
      message: "İşletici değerleri güncellendi",
      changes: result.length 
    })
  } catch (error) {
    console.error("İşletici güncelleme hatası:", error)
    return NextResponse.json(
      { error: "İşletici güncellenirken hata oluştu" },
      { status: 500 }
    )
  }
} 