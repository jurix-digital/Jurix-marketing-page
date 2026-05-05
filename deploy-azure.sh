#!/bin/bash

# Azure CLI Deployment Script for Jurix Marketing Page
# This script creates all necessary Azure resources in South India region

set -e

# Configuration
RESOURCE_GROUP="jurix-resources"
APP_SERVICE_PLAN="jurix-plan"
APP_SERVICE_NAME="jurix-marketing-page"
REGION="southindia"
RUNTIME="NODE:22-lts"
SKU="S1"

echo "🔧 Starting Azure deployment for Jurix Marketing Page..."
echo ""

# Check if user is logged in to Azure
echo "📋 Checking Azure login status..."
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure. Please run 'az login' first."
    exit 1
fi

# Get current subscription
echo "✅ Logged in to Azure"
SUBSCRIPTION=$(az account show --query name -o tsv)
echo "   Subscription: $SUBSCRIPTION"
echo ""

# Create Resource Group
echo "📦 Creating resource group '$RESOURCE_GROUP' in $REGION..."
az group create \
  --name $RESOURCE_GROUP \
  --location $REGION \
  --output none
echo "✅ Resource group created"
echo ""

# Create App Service Plan
echo "📋 Creating App Service plan '$APP_SERVICE_PLAN'..."
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --location $REGION \
  --sku $SKU \
  --is-linux \
  --output none
echo "✅ App Service plan created"
echo ""

# Create App Service
echo "🌐 Creating App Service '$APP_SERVICE_NAME'..."
az webapp create \
  --name $APP_SERVICE_NAME \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --runtime $RUNTIME \
  --output none
echo "✅ App Service created"
echo ""

# Set environment variables
echo "⚙️  Configuring environment variables..."
az webapp config appsettings set \
  --name $APP_SERVICE_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    BACKEND_API_URL="https://jurix-nest-southindia.azurewebsites.net" \
    NODE_ENV="production" \
  --output none
echo "✅ Environment variables configured"
echo ""

# Enable GitHub Actions deployment
echo "🔗 Setting up GitHub Actions deployment..."
echo ""
echo "To enable GitHub Actions deployment, you need to:"
echo "1. Get the publish profile:"
echo "   az webapp deployment list-publishing-profiles --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP"
echo ""
echo "2. Add the publish profile as a GitHub secret named 'AZURE_WEBAPP_PUBLISH_PROFILE'"
echo "   Go to: https://github.com/jurix-digital/Jurix-marketing-page/settings/secrets/actions"
echo ""

# Get the default URL
DEFAULT_URL="https://$APP_SERVICE_NAME.azurewebsites.net"
echo ""
echo "✅ Azure deployment complete!"
echo ""
echo "📍 App Service Details:"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   App Service Name: $APP_SERVICE_NAME"
echo "   Region: $REGION"
echo "   Default URL: $DEFAULT_URL"
echo ""
echo "📋 Next Steps:"
echo "   1. Configure custom domains (jurix.law, www.jurix.law) in Azure Portal"
echo "   2. Add GitHub secret for deployment"
echo "   3. Push to main branch to trigger deployment"
echo ""
echo "🔐 To get publish profile for GitHub Actions:"
echo "   az webapp deployment list-publishing-profiles --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP"
