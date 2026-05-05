# Azure App Service Deployment Setup

## Prerequisites
- Azure account with active subscription
- GitHub repository for this project

## Step 1: Create Azure App Service

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "App Service" and create a new resource
3. Configure:
   - **Resource Group**: Create or select existing (e.g., `jurix-resources`)
   - **Name**: `jurix-marketing-page` (or your preferred name)
   - **Runtime stack**: Node.js 20 LTS
   - **Region**: South India
   - **Pricing tier**: Standard (S1) for production (supports custom domains and SSL)
   - **Operating System**: Linux
4. Click "Review + create" then "Create"
5. Wait for deployment to complete (2-3 minutes)

## Step 2: Get Publish Profile

1. After deployment, go to your App Service resource
2. Navigate to **Deployment Center** (left sidebar)
3. Click **Get publish profile** to download the file
4. Open the downloaded XML file and copy the entire `<publishProfile>` section content

## Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

   **AZURE_WEBAPP_PUBLISH_PROFILE**
   - Paste the publish profile content from Step 2

5. (Optional) Update the workflow file if your App Service name differs from `jurix-marketing-page`

## Step 4: Update Workflow Configuration

Edit `.github/workflows/azure-deploy.yml` if needed:

```yaml
env:
  AZURE_WEBAPP_NAME: 'your-app-service-name'  # Change if different
  AZURE_WEBAPP_PACKAGE_PATH: '.' 
  NODE_VERSION: '20.x'
```

## Step 5: Deploy

1. Commit and push your changes to the `main` branch
2. The GitHub Actions workflow will automatically trigger
3. Monitor deployment in GitHub **Actions** tab
4. Once complete, your app will be live at `https://your-app-name.azurewebsites.net`

## Step 6: Configure Custom Domain

If you have a custom domain (e.g., `jurix.law` and `www.jurix.law`):

1. In Azure Portal, go to your App Service
2. Navigate to **Custom domains** (left sidebar)
3. Add both domains:
   - `jurix.law`
   - `www.jurix.law`
4. Configure DNS records:
   - For `jurix.law`: Add A record pointing to your App Service IP
   - For `www.jurix.law`: Add CNAME record pointing to your App Service default domain
5. Enable HTTPS with a managed certificate for both domains
6. Wait for SSL certificate provisioning (may take 5-10 minutes)

## Step 7: Configure Environment Variables

Add required environment variables in Azure App Service:

1. Go to your App Service → **Environment variables** (left sidebar)
2. Click **+ Add** for each variable:
   - `BACKEND_API_URL`: `https://jurix-nest-southindia.azurewebsites.net`
   - `NODE_ENV`: `production`
3. Click **Apply** then **Confirm**

## Step 8: Enable GitHub Actions Deployment

1. Go to your App Service → **Deployment Center** (left sidebar)
2. Select **GitHub** as the source
3. Choose your organization, repository, and branch (main)
4. Click **Save** - this will automatically configure the workflow

Alternatively, use the manual workflow:
1. Copy the publish profile from Step 2
2. Add it as a GitHub secret: `AZURE_WEBAPP_PUBLISH_PROFILE`
3. Push to main branch to trigger deployment

## Troubleshooting

**Build fails:**
- Check GitHub Actions logs for errors
- Ensure Node.js version matches (20.x)

**App not loading:**
- Check Azure App Service logs in **Log Stream**
- Verify environment variables are set correctly

**API routes not working:**
- Ensure `BACKEND_API_URL` is configured
- Check backend API is accessible from Azure
