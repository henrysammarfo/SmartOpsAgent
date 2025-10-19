#!/bin/bash

echo "🔧 SmartOpsAgent Environment Setup"
echo "=================================="
echo ""

# Create frontend .env.local
echo "📝 Creating frontend .env.local..."
cp .env.example .env.local

# Create backend .env
echo "📝 Creating backend .env..."
cp backend/.env.example backend/.env

echo ""
echo "✅ Environment files created!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local and add your Supabase credentials"
echo "2. Edit backend/.env and add your API keys"
echo "3. Run 'npm install' in root directory"
echo "4. Run 'cd backend && npm install'"
echo "5. Run database migrations in Supabase"
echo "6. Start backend: 'cd backend && npm run dev'"
echo "7. Start frontend: 'npm run dev'"
echo ""
