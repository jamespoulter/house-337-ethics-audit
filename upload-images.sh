#!/bin/bash

# Create buckets if they don't exist
supabase storage create branding
supabase storage create framework

# Upload branding assets
echo "Uploading branding assets..."
supabase storage upload --experimental branding "public/House_Word_logo.png" "house-337-logo.png"
supabase storage upload --experimental branding "public/ov_trustmark-white.svg" "trustmark-white.svg"
supabase storage upload --experimental branding "public/favicon.ico" "favicon.ico"
supabase storage upload --experimental branding "public/House_Word_logo.png" "icon.svg"
supabase storage upload --experimental branding "public/House_Word_logo.png" "apple-touch-icon.png"

# Create social directory and upload social icons
echo "Uploading social icons..."
supabase storage upload --experimental branding "public/instagram.svg" "social/instagram.svg"
supabase storage upload --experimental branding "public/linkedin.svg" "social/linkedin.svg"
supabase storage upload --experimental branding "public/youtube.svg" "social/youtube.svg"

# Upload framework assets
echo "Uploading framework assets..."
supabase storage upload --experimental framework "public/ethical-ai-framework.png" "ethical-ai-framework.png"

echo "Upload complete!" 