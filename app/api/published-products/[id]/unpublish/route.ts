import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server-client"
import { getServerSession } from "@/lib/session/server"
import { PlatformFactory } from "@/lib/platforms/PlatformFactory"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { tenant } = await getServerSession()
  if (!tenant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
  const { id } = params
  
  // Get the published product
  const { data: publishedProduct, error: fetchError } = await supabaseAdmin
    .from("published_products")
    .select(`
      *,
      connection:tenant_connections(*)
    `)
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single()
  
  if (fetchError || !publishedProduct) {
    return NextResponse.json({ error: "Published product not found" }, { status: 404 })
  }
  
  // Check if it's published
  if (publishedProduct.status !== 'published') {
    return NextResponse.json({ error: "Product is not published" }, { status: 400 })
  }
  
  try {
    // Create platform integration
    const integration = PlatformFactory.create(publishedProduct.connection.platform, {
      apiKey: publishedProduct.connection.api_key,
      apiToken: publishedProduct.connection.api_token,
      storeName: publishedProduct.connection.store_name,
      platform: publishedProduct.connection.platform,
      metadata: publishedProduct.connection.platform_metadata
    })
    
    // For now, we'll mark the product as inactive by updating its description
    // In a real implementation, you might have a specific unpublish method
    const updateResult = await integration.updateProduct(
      publishedProduct.external_product_id,
      {
        description: `[INACTIVE] ${publishedProduct.platform_specific_overrides?.description || ''}`,
        metadata: {
          ...publishedProduct.platform_metadata,
          status: 'inactive',
          unpublished_at: new Date().toISOString()
        }
      }
    )
    
    if (!updateResult.success) {
      throw new Error(`Platform unpublish failed: ${updateResult.error}`)
    }
    
    // Update status to unpublished
    const { error: updateError } = await supabaseAdmin
      .from("published_products")
      .update({
        status: 'unpublished',
        sync_status: 'synced',
        updated_at: new Date().toISOString(),
        platform_response: {
          success: true,
          external_id: updateResult.external_id,
          unpublished_at: new Date().toISOString()
        }
      })
      .eq("id", id)
    
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Product unpublished successfully",
      external_id: updateResult.external_id
    })
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unpublish failed' 
    }, { status: 500 })
  }
} 