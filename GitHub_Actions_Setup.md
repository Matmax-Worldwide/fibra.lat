# Setting Up GitHub Actions for Vercel Deployment

To fix your Vercel deployment through GitHub Actions, follow these steps to set up the required secrets:

## Required Secrets

You need to add the following secrets to your GitHub repository:

1. `VERCEL_TOKEN` - A personal access token from Vercel
2. `VERCEL_ORG_ID` - Your Vercel team/organization ID
3. `VERCEL_PROJECT_ID` - Your Vercel project ID

## Step 1: Create a Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create" to create a new token
3. Name it "GitHub Actions" or something descriptive
4. Copy the generated token (it will only be shown once)

## Step 2: Get Vercel Project Details

Your project details are:
- **Organization ID**: `team_asXXTJcib3U3sEnaF94i2Sm9`
- **Project ID**: `prj_q1W2ma1vn980PDtAL5PwDeRJFt5M`

## Step 3: Add Secrets to GitHub

1. Go to your GitHub repository: https://github.com/Matmax-Worldwide/fibra.lat
2. Navigate to "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret" and add each of the following:

   - Name: `VERCEL_TOKEN`
     Value: [The token you created in Step 1]
   
   - Name: `VERCEL_ORG_ID`
     Value: `team_asXXTJcib3U3sEnaF94i2Sm9`
   
   - Name: `VERCEL_PROJECT_ID`
     Value: `prj_q1W2ma1vn980PDtAL5PwDeRJFt5M`

## Step 4: Test the Workflow

After setting up the secrets:

1. Make a small change to any file in your repository
2. Commit and push the change to trigger the GitHub Actions workflow
3. Go to the "Actions" tab in your GitHub repository to monitor the workflow
4. Check if the deployment succeeds

## Troubleshooting

If the deployment still fails:

1. Check the GitHub Actions logs for any error messages
2. Ensure the Vercel token has the necessary permissions
3. Verify that the workflow file (`.github/workflows/fibra.lat.yml`) is correctly configured
4. Try deploying manually using Vercel CLI to see if there are any project-specific issues

## Manual Deployment (If Needed)

```bash
vercel deploy --prod
``` 