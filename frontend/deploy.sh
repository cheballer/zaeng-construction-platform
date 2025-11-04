#!/bin/bash

echo "🚀 Za-Eng Construction Platform - Vercel Deployment"
echo "=================================================="
echo ""

# Check if logged in
if ! vercel whoami &>/dev/null; then
    echo "❌ Not logged in to Vercel"
    echo "📝 Please run: vercel login"
    exit 1
fi

echo "✅ Logged in to Vercel"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")"

echo "📦 Starting deployment..."
echo ""

# Deploy
vercel --yes

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📝 Next steps:"
echo "   1. Set environment variable: vercel env add VITE_API_URL"
echo "   2. Deploy to production: vercel --prod"
echo ""

