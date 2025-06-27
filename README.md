# Fullstack Next.js with Drizzle & ts-rest

A modern fullstack Next.js application built with TypeScript, featuring type-safe APIs with ts-rest and database management with Drizzle ORM. This project demonstrates best practices for building scalable, type-safe web applications.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **API**: Type-safe APIs with [ts-rest](https://ts-rest.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Authentication**: Custom auth implementation
- **Package Manager**: [pnpm](https://pnpm.io/)

## ✨ Features

- 🔐 **Authentication System** - Login and registration with form validation
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS and Radix UI
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 🌙 **Dark Mode** - Theme switching with next-themes
- 📊 **API Documentation** - Auto-generated OpenAPI/Swagger docs
- 🔒 **Type Safety** - End-to-end type safety from database to frontend
- 🚄 **Performance** - Optimized with Turbopack for fast development

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   └── docs/              # API documentation
├── components/            # Reusable UI components
│   └── ui/               # Base UI components (shadcn/ui style)
├── db/                   # Database schema
├── drizzle/              # Database connection
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── server/               # Server-side logic
└── shared/               # Shared types and contracts
    ├── contract.ts       # ts-rest API contracts
    └── types/            # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fullstack-nextjs
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your database URL and other required environment variables.

4. **Set up the database**
   ```bash
   # Generate and run migrations
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📚 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🔧 Database Management

This project uses Drizzle ORM for database management:

- **Schema**: Defined in `src/db/schema.ts`
- **Migrations**: Generated in `migrations/` directory
- **Configuration**: `drizzle.config.ts`

### Common Database Commands

```bash
# Generate migrations after schema changes
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Open Drizzle Studio (database browser)
npx drizzle-kit studio
```

## 🌐 API Documentation

The API is built with ts-rest for end-to-end type safety. Documentation is auto-generated and available at:

```
http://localhost:3000/api/docs
```

## 🎨 UI Components

This project uses a component system inspired by shadcn/ui:

- **Base Components**: Built with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Theme**: Support for light/dark mode
- **Responsive**: Mobile-first responsive design

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Drizzle ORM](https://orm.drizzle.team/) for the excellent TypeScript ORM
- [ts-rest](https://ts-rest.com/) for type-safe API development
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives