import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server-client"
import { getServerSession } from "@/lib/session/server"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { tenant } = await getServerSession()
  if (!tenant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
  const { id } = params
  
  // Get the published product
  const { data: publishedProduct, error: fetchError } = await supabaseAdmin
    .from("published_products")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single()
  
  if (fetchError || !publishedProduct) {
    return NextResponse.json({ error: "Published product not found" }, { status: 404 })
  }
  
  // Check if it's in a failed state
  if (publishedProduct.status !== 'failed') {
    return NextResponse.json({ error: "Product is not in a failed state" }, { status: 400 })
  }
  
  // Reset status for retry
  const { error: updateError } = await supabaseAdmin
    .from("published_products")
    .update({
      status: 'queued',
      sync_status: 'pending',
      error_message: null,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
  
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }
  
  return NextResponse.json({ 
    success: true, 
    message: "Product queued for retry" 
  })
} 