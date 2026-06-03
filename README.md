# Intelligent CRM System for Nigerian SMEs

A web-based Customer Relationship Management system with AI-powered recommendations and data analytics, designed specifically for Small and Medium Enterprises in Nigeria.

## 🎯 Project Overview

This system was developed as a final year project at Southern Delta University, Ozoro, Delta State, Nigeria. It addresses the unique challenges faced by Nigerian SMEs in managing customer relationships in resource-constrained environments.

### Key Features

- ✅ **Customer Management** - Complete CRUD operations with search and filtering
- ✅ **Analytics Dashboard** - Visual charts showing sales trends, top products, customer segments
- ✅ **AI Recommendations** - Dual recommendation engines:
  - Machine Learning (Collaborative Filtering)
  - Groq AI (Advanced insights and predictions)
- ✅ **Interaction Logging** - Track sales, inquiries, complaints, calls, visits, follow-ups
- ✅ **Report Generation** - PDF and Excel exports for business analysis
- ✅ **Process Flow Visualization** - Clear CRM workflow guidance
- ✅ **Authentication** - Supabase Auth with role-based access (Owner/Staff)
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account (free tier)
- Groq API account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd code
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_groq_api_key
   ```

4. **Set up Supabase database**
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Run the schema in `supabase-schema.sql`

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Register a new account or use demo mode

## 🔑 Getting API Keys

### Groq AI (Free)

1. Visit https://console.groq.com
2. Sign up for a free account
3. Go to API Keys section
4. Create new API key
5. Copy the key (starts with `gsk_...`)

**Why Groq?**
- Free tier with generous limits
- Ultra-fast inference speeds
- Powerful models (Llama 3, Mixtral)
- Perfect for business intelligence

### Supabase (Free)

1. Visit https://supabase.com
2. Create free account
3. Create new project
4. Go to Settings > API
5. Copy:
   - Project URL
   - Anon/Public Key

**Why Supabase?**
- Free PostgreSQL database
- Built-in authentication
- Real-time capabilities
- Easy to use

## 📊 Database Schema

The system uses the following tables:

- **profiles** - User profiles with roles
- **customers** - Customer information
- **products** - Product catalog
- **purchases** - Sales transactions
- **interactions** - Customer touchpoints

See `supabase-schema.sql` for complete schema.

## 🎨 Technology Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Backend:** Supabase (PostgreSQL + Auth)
- **AI:** Groq API (Llama 3.3 70B)
- **ML:** Custom collaborative filtering algorithm
- **Reports:** jsPDF + xlsx

## 📦 Building for Production

```bash
pnpm build
```

The build output will be in the `dist/` folder, ready for deployment.

### Deployment Options

1. **Vercel** (Recommended)
   ```bash
   vercel deploy
   ```

2. **Netlify**
   ```bash
   netlify deploy --prod
   ```

3. **Traditional Hosting**
   - Upload `dist/` folder to your web server
   - Configure web server to serve `index.html` for all routes

## 🎯 Project Objectives

As stated in the research document:

1. ✅ Design a web-based intelligent CRM system that is easy to use and suitable for Nigerian SMEs with limited resources
2. ✅ Implement the system so that it can run on basic hardware and support real-world SME operations
3. ✅ Test and evaluate the system for correct functionality, ease of use, accuracy of recommendations, performance speed, and overall effectiveness

## 📱 Features Guide

### Dashboard
- View key metrics (customers, revenue, sales, avg order)
- Sales trend charts
- Customer segmentation
- At-risk customer alerts
- AI business insights
- Download reports

### Customer Management
- Add/view/search customers
- Filter by category (Frequent, Occasional, New)
- View purchase history
- ML-based product recommendations
- AI-powered customer insights
- Risk assessment

### Interaction Logging
- Log all customer touchpoints
- Categorize interactions
- Track conversation history
- Search and filter

### Process Flow
- Visual CRM workflow
- Stage-by-stage guidance
- Best practices
- Common pitfalls to avoid

## 🔒 Security Notes

- All passwords are hashed by Supabase Auth
- Row Level Security (RLS) policies protect data
- API keys stored securely in environment variables
- HTTPS required for production

**Important:** This system is designed for SME prototypes and demos. For production systems handling sensitive PII, consult security professionals.

## 🤝 Contributing

This is a final year project. For educational purposes, feel free to:
- Fork the repository
- Submit issues
- Suggest improvements
- Adapt for your own SME

## 📄 License

Educational Project - Southern Delta University © 2026

## 👨‍💻 Author

Developed as a Final Year Project  
Faculty of Computing  
Southern Delta University, Ozoro  
Delta State, Nigeria

## 📞 Support

For questions or support, refer to:
- `TODO.md` - Development roadmap
- `supabase-schema.sql` - Database structure
- Code comments - Implementation details

## 🙏 Acknowledgments

- Southern Delta University for academic guidance
- Nigerian SMEs in Ozoro for requirements feedback
- Open source community for libraries and tools
- Groq for free AI API access
- Supabase for free backend infrastructure
