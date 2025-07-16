import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server-client"
import { getServerSession } from "@/lib/session/server"
import { PlatformFactory } from "@/lib/platforms/PlatformFactory"

export async function PUT(
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
      master_product:master_products(*),
      connection:tenant_connections(*)
    `)
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single()
  
  if (fetchError || !publishedProduct) {
    return NextResponse.json({ error: "Published product not found" }, { status: 404 })
  }
  
  // Update status to syncing
  const { error: updateError } = await supabaseAdmin
    .from("published_products")
    .update({
      sync_status: 'syncing',
      status: 'publishing',
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
  
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
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
    
    // Prepare product data for platform
    const productData = {
      name: publishedProduct.platform_specific_overrides?.name || publishedProduct.master_product.product_name,
      description: publishedProduct.platform_specific_overrides?.description || publishedProduct.master_product.master_description,
      metadata: {
        ...publishedProduct.master_product.attributes,
        ...publishedProduct.platform_metadata,
        base_price: publishedProduct.master_product.base_price,
        image_url: publishedProduct.master_product.master_image_url
      }
    }
    
    // Sync with platform
    const updateResult = await integration.updateProduct(
      publishedProduct.external_product_id,
      productData
    )
    
    if (!updateResult.success) {
      throw new Error(`Platform sync failed: ${updateResult.error}`)
    }
    
    // Update with success
    const { error: successError } = await supabaseAdmin
      .from("published_products")
      .update({
        sync_status: 'synced',
        status: 'published',
        published_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        platform_response: {
          success: true,
          external_id: updateResult.external_id,
          synced_at: new Date().toISOString()
        }
      })
      .eq("id", id)
    
    if (successError) {
      return NextResponse.json({ error: successError.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Product synced successfully",
      external_id: updateResult.external_id
    })
    
  } catch (error) {
    // Update with error
    const { error: errorUpdateError } = await supabaseAdmin
      .from("published_products")
      .update({
        sync_status: 'failed',
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Sync failed',
        retry_count: publishedProduct.retry_count + 1,
        next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
        updated_at: new Date().toISOString(),
        platform_response: {
          success: false,
          error: error instanceof Error ? error.message : 'Sync failed',
          failed_at: new Date().toISOString()
        }
      })
      .eq("id", id)
    
    if (errorUpdateError) {
      return NextResponse.json({ error: errorUpdateError.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Sync failed' 
    }, { status: 500 })
  }
} 