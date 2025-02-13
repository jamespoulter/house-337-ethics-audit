# House 337 Ethics Audit Application

A comprehensive ethics audit application built for House 337 using Next.js, React, and TypeScript. This application helps organizations conduct, manage, and track ethical assessments and compliance.

## 🚀 Features

- **Authentication & Authorization**: Secure user authentication powered by Clerk
- **Database Integration**: Robust data management with Supabase
- **Modern UI Components**: Built with ShadCN UI and Radix UI primitives
- **Responsive Design**: Fully responsive interface using TailwindCSS
- **PDF Generation**: Report generation capabilities using React PDF
- **Real-time Updates**: Live data synchronization
- **Dark Mode Support**: Built-in theme switching capabilities

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: ShadCN UI / Radix UI
- **Authentication**: Clerk
- **Database**: Supabase
- **State Management**: React Hooks
- **Form Handling**: React Hook Form + Zod
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/house-337-ethics-audit.git
cd house-337-ethics-audit
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add the following variables:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
/project-root
├── app/                # Next.js App Router
│   ├── api/           # API routes
│   ├── audits/        # Audit-related pages
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Homepage
├── components/        # Reusable UI components
├── lib/              # Utility functions and services
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── styles/           # Global styles
├── public/           # Static assets
└── config/           # Configuration files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript compiler check

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved by House 337.

## 👥 Support

For support, please contact the development team or raise an issue in the repository. 