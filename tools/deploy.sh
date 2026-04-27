#!/bin/bash
# SunnyNow Deployment Script - Cloudflare Pages & Workers deployment
#
# Usage:
#   sunnynow-deploy pages    - Deploy to Cloudflare Pages
#   sunnynow-deploy workers  - Deploy Cloudflare Worker
#   sunnynow-deploy all      - Deploy both Pages and Workers (default)
#
# Environment:
#   PROJECT_ROOT    - Project root directory (required)

set -e

# Validate configuration
if [ -z "$PROJECT_ROOT" ]; then
  echo "Error: PROJECT_ROOT environment variable not set"
  echo "Usage: export PROJECT_ROOT=/path/to/your/project"
  exit 1
fi

DEPLOY_ACTION="${1:-all}"

deploy_pages() {
  echo "📦 Deploying to Cloudflare Pages..."
  cd "$PROJECT_ROOT/frontend"
  npm run build
  npx wrangler pages deploy dist --project-name=sunnynow
  echo "✅ Cloudflare Pages deployed"
}

deploy_workers() {
  echo "⚙️  Deploying Cloudflare Worker..."
  cd "$PROJECT_ROOT"
  npx wrangler deploy
  echo "✅ Cloudflare Worker deployed"
}

case "$DEPLOY_ACTION" in
  pages)
    deploy_pages
    ;;
  workers)
    deploy_workers
    ;;
  all)
    echo "🚀 SunnyNow Deployment"
    echo "===================="
    deploy_pages
    deploy_workers
    echo -e "\n✅ All done!"
    ;;
  *)
    echo "Usage: sunnynow-deploy [pages|workers|all]"
    exit 1
    ;;
esac