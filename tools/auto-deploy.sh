#!/bin/bash
# DevFlow Auto Deploy - One-command deployment automation
#
# Usage:
#   devflow-deploy              - Deploy all (Worker + Mini Program)
#   devflow-deploy worker       - Deploy Worker only
#   devflow-deploy upload       - Upload Mini Program only
#   devflow-deploy context      - Generate context only
#
# Environment:
#   PROJECT_ROOT    - Project root directory (required)
#   WORKER_DIR      - Worker directory relative to PROJECT_ROOT (default: worker)
#   SCRIPTS_DIR     - Scripts directory relative to PROJECT_ROOT (default: Scripts)
#   UPLOAD_SCRIPT   - Upload script path relative to PROJECT_ROOT (default: ci/upload.js)
#   LOG_PATH        - Agent execution log path (optional)

set -e

# Validate configuration
if [ -z "$PROJECT_ROOT" ]; then
  echo "Error: PROJECT_ROOT environment variable not set"
  echo "Usage: export PROJECT_ROOT=/path/to/your/project"
  exit 1
fi

WORKER_DIR="${WORKER_DIR:-worker}"
SCRIPTS_DIR="${SCRIPTS_DIR:-Scripts}"
UPLOAD_SCRIPT="${UPLOAD_SCRIPT:-ci/upload.js}"
DEPLOY_ACTION="${1:-all}"

deploy_worker() {
  echo "📦 Deploying Cloudflare Worker..."
  cd "$PROJECT_ROOT/$WORKER_DIR"
  npx wrangler deploy
  echo "✅ Worker deployed"
}

deploy_upload() {
  echo "📱 Uploading Mini Program..."
  cd "$PROJECT_ROOT"
  node "$UPLOAD_SCRIPT"
  echo "✅ Mini Program uploaded"
}

generate_context() {
  echo "📝 Generating project context..."
  cd "$PROJECT_ROOT"
  llm-context "$SCRIPTS_DIR" js -i node_modules -i .git -i .wrangler 2>/dev/null || true
  echo "✅ Context generated"
}

update_log() {
  if [ -n "$LOG_PATH" ]; then
    DATE=$(date +%Y-%m-%d)
    echo -e "\n## DEPLOY $DATE\n- Worker: ✅\n- Mini Program: ✅\n" >> "$LOG_PATH"
    echo "✅ Log updated"
  fi
}

case "$DEPLOY_ACTION" in
  worker)
    deploy_worker
    ;;
  upload)
    deploy_upload
    ;;
  context)
    generate_context
    ;;
  all)
    echo "🚀 DevFlow Auto Deploy"
    echo "===================="
    deploy_worker
    deploy_upload
    generate_context
    update_log
    echo -e "\n✅ All done!"
    ;;
  *)
    echo "Usage: devflow-deploy [worker|upload|context|all]"
    exit 1
    ;;
esac
