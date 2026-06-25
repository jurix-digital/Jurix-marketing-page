# Azure Contact Form Setup

This document explains how to set up Azure Table Storage for the Jurix contact form.

## Prerequisites

1. Azure subscription
2. Azure Storage Account created
3. Table Storage created within the storage account

## Setup Steps

### 1. Create Azure Storage Account

```bash
# Using Azure CLI
az storage account create \
  --name <your-storage-account-name> \
  --resource-group jurix-resources \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2
```

### 2. Create Table Storage

```bash
# Using Azure CLI
az storage table create \
  --account-name <your-storage-account-name> \
  --name contacts \
  --account-key <your-account-key>
```

### 3. Get Account Key

```bash
# Using Azure CLI
az storage account keys list \
  --account-name <your-storage-account-name> \
  --resource-group jurix-resources \
  --query "[0].value" \
  -o tsv
```

### 4. Configure Environment Variables

Add the following to your `.env.local` file:

```env
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account_name
AZURE_STORAGE_ACCOUNT_KEY=your_storage_account_key
AZURE_CONTACT_TABLE_NAME=contacts
# Optional: store Lawyer "Book a demo" requests in a separate table.
# If unset, demo requests are written to AZURE_CONTACT_TABLE_NAME and
# distinguished by the `formType` field.
# AZURE_DEMO_TABLE_NAME=contacts

# reCAPTCHA (server-side verification for both forms)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Email notifications (Brevo transactional API)
# Both the Contact and "Book a demo" forms send a branded email on submit.
BREVO_API_KEY=your_brevo_api_key
# Optional overrides (defaults shown):
# CONTACT_NOTIFY_TO=hello@jurix.law          # recipient of form notifications
# EMAIL_FROM=hello@jurix.law                 # verified Brevo sender address
# EMAIL_FROM_NAME=Jurix Website              # sender display name
# EMAIL_LOGO_URL=https://www.jurix.law/img/logo.png  # logo shown in the email
```

## Email Notifications

Both forms send a branded HTML email (Jurix logo + styled template) on every
submission:

- **Contact form** (`POST /api/contact`) → emails `CONTACT_NOTIFY_TO` (default `hello@jurix.law`)
- **Book a demo** (`POST /api/demo`) → emails `CONTACT_NOTIFY_TO` (default `hello@jurix.law`)

The submitter's email is set as the `Reply-To`, so replying from the inbox goes
straight back to them. Email and Azure Table storage are independent: if one
fails the other still runs, so a misconfiguration won't silently drop a lead.
Delivery uses Brevo's transactional API — make sure `EMAIL_FROM` is a verified
sender/domain in your Brevo account.

## Contact Form Data Structure

Each contact submission is stored as an entity in Azure Table Storage with the following properties:

- `partitionKey`: YYYY-MM (for monthly partitioning)
- `rowKey`: Unique identifier (timestamp + random string)
- `formType`: `contact` (distinguishes contact submissions from demo requests)
- `name`: Contact's full name
- `email`: Contact's email address
- `phone`: Contact's phone number
- `category`: Contact category (Consumer Support, Lawyer Onboarding, etc.)
- `subject`: Message subject
- `message`: Message content
- `submittedAt`: ISO timestamp of submission
- `status`: Status (default: 'new')

## Lawyer "Book a demo" Data Structure

The Lawyers page (`/Lawyers#demo`) demo form is reCAPTCHA-protected and writes to
the same table by default (or `AZURE_DEMO_TABLE_NAME` if set), tagged so the two
record types are easy to separate:

- `partitionKey`: YYYY-MM
- `rowKey`: Unique identifier (timestamp + random string)
- `formType`: `lawyer-demo` (distinguishes demo requests from contact submissions)
- `name`: Lawyer's full name
- `barCouncilNo`: Bar Council registration number
- `email`: Lawyer's email address
- `mobile`: Lawyer's mobile number
- `city`: Selected city
- `areaOfPractice`: Selected area of practice
- `preferredDateTime`: Preferred date & time for the demo
- `submittedAt`: ISO timestamp of submission
- `status`: Status (default: 'new')

To list only one type, filter on `formType` (e.g. `formType eq 'lawyer-demo'`).

## API Endpoints

- The contact form submits to: `POST /api/contact`
- The lawyer demo form submits to: `POST /api/demo`

## Viewing Contact Submissions

You can view contact submissions using:

1. **Azure Portal**: Navigate to Storage Account → Table Storage → contacts table
2. **Azure Storage Explorer**: Desktop application for browsing Azure Storage
3. **Azure CLI**: 
   ```bash
   az storage entity query \
     --account-name <your-storage-account-name> \
     --table-name contacts \
     --account-key <your-account-key>
   ```

## Security Notes

- Never commit `.env.local` to version control
- Use Azure Key Vault for production environments
- Restrict access to the storage account using network rules
- Enable HTTPS-only access to the storage account
