# FIBRA/REIT Investment Calculator

A comprehensive investment calculator for analyzing real estate opportunities in REITs (US) and FIBRAs (Peru).

## Features

- **Standard Calculator**: Analyze income-producing properties for REITs/FIBRAs
- **Development Calculator**: Evaluate hotel acquisition and renovation projects for REITs/FIRBIs
- **Cross-Border Investment Guide**: Compare tax implications between US REITs and Peru FIBRAs
- **Property Search**: Find properties available for investment (placeholder functionality)
- **Investor Access**: Secure login for investors (placeholder functionality)

## Technologies

- React
- TypeScript
- Nx Monorepo
- Vercel Deployment
- GitHub Actions CI/CD

## Development

This project uses Nx for managing the monorepo structure. To get started:

```bash
# Install dependencies
npm install

# Serve the application locally
npx nx serve calculator

# Build the application
npx nx build calculator --prod

# Run tests
npx nx test calculator
```

## CI/CD Setup

This project is configured with GitHub Actions for CI/CD and automatic deployment to Vercel.

### GitHub Secrets Required

To enable automated deployment, add the following secrets to your GitHub repository:

- `VERCEL_TOKEN`: Your Vercel personal access token
- `VERCEL_ORG_ID`: `team_asXXTJcib3U3sEnaF94i2Sm9`
- `VERCEL_PROJECT_ID`: `prj_q1W2ma1vn980PDtAL5PwDeRJFt5M`

### How to get a Vercel token:

1. Go to https://vercel.com/account/tokens
2. Create a new token with a descriptive name (e.g., "GitHub Actions")
3. Copy the token and add it as a secret in your GitHub repository settings

## Deployment

The application is automatically deployed to Vercel when changes are pushed to the main branch.

Current deployment: [https://investment-calculator-lilac-xi.vercel.app](https://investment-calculator-lilac-xi.vercel.app)

## License

© 2025 Alberto Saco Puntriano. All rights reserved.
