import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import path from 'path'

const supabaseUrl = 'https://tynmojfuxuiqzjsxwkro.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bm1vamZ1eHVpcXpqc3h3a3JvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTI4MDk0NywiZXhwIjoyMDU0ODU2OTQ3fQ.jB9Wm68aSY6K2zEd6jiRPUbnBjSNFfrCsH8tTtHcQIM'

const supabase = createClient(supabaseUrl, supabaseKey)

const uploadFile = async (filePath, bucket, targetPath) => {
  try {
    const fileBuffer = readFileSync(filePath)
    const fileName = path.basename(filePath)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(targetPath || fileName, fileBuffer, {
        contentType: getContentType(fileName),
        upsert: true
      })

    if (error) {
      console.error(`Error uploading ${fileName}:`, error.message)
      return false
    }

    console.log(`Successfully uploaded ${fileName} to ${bucket}/${targetPath || fileName}`)
    return true
  } catch (error) {
    console.error(`Error reading/uploading ${filePath}:`, error.message)
    return false
  }
}

const getContentType = (fileName) => {
  const ext = path.extname(fileName).toLowerCase()
  switch (ext) {
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.svg':
      return 'image/svg+xml'
    case '.ico':
      return 'image/x-icon'
    default:
      return 'application/octet-stream'
  }
}

const createBuckets = async () => {
  try {
    await supabase.storage.createBucket('branding', { public: true })
    console.log('Created branding bucket')
    await supabase.storage.createBucket('framework', { public: true })
    console.log('Created framework bucket')
  } catch (error) {
    console.log('Buckets might already exist:', error.message)
  }
}

const main = async () => {
  // Create buckets
  await createBuckets()

  // Upload branding assets
  console.log('\nUploading branding assets...')
  await uploadFile('public/House_Word_logo.png', 'branding', 'house-337-logo.png')
  await uploadFile('public/ov_trustmark-white.svg', 'branding', 'trustmark-white.svg')
  await uploadFile('public/favicon.ico', 'branding', 'favicon.ico')
  await uploadFile('public/House_Word_logo.png', 'branding', 'icon.svg')
  await uploadFile('public/House_Word_logo.png', 'branding', 'apple-touch-icon.png')

  // Upload social icons
  console.log('\nUploading social icons...')
  await uploadFile('public/instagram.svg', 'branding', 'social/instagram.svg')
  await uploadFile('public/linkedin.svg', 'branding', 'social/linkedin.svg')
  await uploadFile('public/youtube.svg', 'branding', 'social/youtube.svg')

  // Upload framework assets
  console.log('\nUploading framework assets...')
  await uploadFile('public/ethical-ai-framework.png', 'framework', 'ethical-ai-framework.png')
}

main().catch(console.error) 