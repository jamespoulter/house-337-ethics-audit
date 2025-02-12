import { config } from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') })

import { storage } from '@/lib/supabase'
import fs from 'fs'

const PUBLIC_DIR = path.join(process.cwd(), 'public')

// Map of local files to their Supabase storage paths
const assetMap = {
  'House_Word_logo.png': 'branding/house-337-logo.png',
  'favicon.ico': 'branding/favicon.ico',
  'icon.svg': 'branding/icon.svg',
  'apple-touch-icon.png': 'branding/apple-touch-icon.png',
  'ov_trustmark-white.svg': 'branding/trustmark-white.svg',
  'ethical-ai-framework.png': 'framework/ethical-ai-framework.png',
  'instagram.svg': 'social/instagram.svg',
  'linkedin.svg': 'social/linkedin.svg',
  'youtube.svg': 'social/youtube.svg',
}

async function uploadAssets() {
  // Verify environment variables are loaded
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase environment variables. Please check your .env.local file.')
    process.exit(1)
  }

  for (const [localPath, storagePath] of Object.entries(assetMap)) {
    const filePath = path.join(PUBLIC_DIR, localPath)
    
    try {
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File not found: ${localPath}`)
        continue
      }

      const fileBuffer = fs.readFileSync(filePath)
      const file = new File([fileBuffer], path.basename(localPath), {
        type: getMimeType(localPath),
      })
      
      console.log(`📤 Uploading ${localPath} to ${storagePath}...`)
      await storage.uploadImage(file, storagePath)
      console.log(`✅ Uploaded ${localPath}`)
    } catch (error) {
      console.error(`❌ Failed to upload ${localPath}:`, error)
    }
  }
}

function getMimeType(filename: string) {
  const ext = path.extname(filename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

// Run the upload
console.log('🚀 Starting asset upload to Supabase...')
uploadAssets()
  .then(() => console.log('✨ Upload complete!'))
  .catch((error) => {
    console.error('❌ Upload failed:', error)
    process.exit(1)
  }) 