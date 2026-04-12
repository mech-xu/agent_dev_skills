#!/bin/bash
# DevFlow Shell Aliases
# Add to ~/.zshrc or ~/.bashrc

# DevFlow commands
alias df-deploy='devflow-deploy'
alias df-context='llm-context . js -i node_modules -i .git'
alias df-log='devflow-log-merge'
alias df-ctx='repowise create'

# Environment variables (customize for your project)
# export OBSIDIAN_VAULT=/path/to/your/obsidian/vault
# export PROJECT_ROOT=/path/to/your/project
# export LOG_PREFIX=YourProject
# export LOG_PATH=/path/to/agent/log.md
