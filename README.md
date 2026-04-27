# SunnyNow Development Tools

Essential development and deployment tools for the SunnyNow project.

## Features

- **Cloudflare Pages Deployment** - One-command deployment to Cloudflare Pages
- **Cloudflare Workers Deployment** - Deploy API proxy workers
- **CI/CD Integration** - Ready for GitHub Actions integration

## Installation

```bash
npm install -g sunnynow-dev-tools
```

## Usage

### Environment Setup

```bash
export PROJECT_ROOT=/path/to/sunnynow/project
```

### Deployment Commands

```bash
# Deploy frontend to Cloudflare Pages
sunnynow-deploy pages

# Deploy backend worker to Cloudflare Workers  
sunnynow-deploy workers

# Deploy both (default)
sunnynow-deploy
```

## Project Structure

```
sunnynow-dev-tools/
├── tools/
│   └── deploy.sh          # Deployment script
├── package.json
└── README.md
```

## Integration with GitHub Actions

This tool is designed to work seamlessly with your existing CI/CD pipeline in `.github/workflows/ci-cd.yml`.

## License

MIT

## Repository

https://github.com/mech-xu/agent_dev_skills
