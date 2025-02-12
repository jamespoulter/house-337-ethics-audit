const SUPABASE_URL = 'https://tynmojfuxuiqzjsxwkro.supabase.co'
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public`

export const images = {
  logo: {
    src: `${STORAGE_URL}/branding/house-337-logo.png`,
    alt: "House 337",
    width: 120,
    height: 36,
  },
  aiMagicLogo: {
    src: `${STORAGE_URL}/branding/ai-magic-logo.jpg`,
    alt: "AI Magic",
    width: 300,
    height: 90,
  },
  framework: {
    src: `${STORAGE_URL}/framework/ethical-ai-framework.png`,
    alt: "AI Ethics Framework",
    width: 800,
    height: 600,
  },
  trustmark: {
    src: `${STORAGE_URL}/branding/trustmark-white.svg`,
    alt: "Linux Foundation Open Trustmark",
    width: 300,
    height: 80,
  },
  favicon: {
    src: `${STORAGE_URL}/branding/favicon.ico`,
    alt: "Favicon",
  },
  icon: {
    src: `${STORAGE_URL}/branding/icon.svg`,
    alt: "Icon",
  },
  appleTouchIcon: {
    src: `${STORAGE_URL}/branding/apple-touch-icon.png`,
    alt: "Apple Touch Icon",
  },
  social: {
    instagram: {
      src: `${STORAGE_URL}/branding/social/instagram.svg`,
      alt: "Instagram",
      width: 24,
      height: 24,
    },
    linkedin: {
      src: `${STORAGE_URL}/branding/social/linkedin.svg`,
      alt: "LinkedIn",
      width: 24,
      height: 24,
    },
    youtube: {
      src: `${STORAGE_URL}/branding/social/youtube.svg`,
      alt: "YouTube",
      width: 24,
      height: 24,
    },
  },
} as const 