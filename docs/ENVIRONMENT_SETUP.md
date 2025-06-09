# Environment Configuration Setup

## Required Environment Variables

Create a `.env` file in your `api/` directory with the following variables:

### Database Configuration (AWS RDS PostgreSQL)
```
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-secure-password
```

### AWS Cognito Configuration
```
COGNITO_REGION=us-west-1
COGNITO_USER_POOL_ID=us-west-1_ZRp04bdAf
COGNITO_CLIENT_ID=3cqsdhk7qmhvdvt4n9lpvni40q
```

### AWS SES Email Configuration (for invitation emails)
```
AWS_REGION=us-west-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
SES_FROM_EMAIL=noreply@bluepineai.com
TEST_EMAIL=your-test-email@example.com
```

### Application Configuration
```
PORT=3001
FRONTEND_URL=http://localhost:8084
```

### Development Settings
```
NODE_ENV=development
```

## AWS SES Setup Instructions

1. **Verify Your Domain in AWS SES**
   - Go to AWS SES Console
   - Add and verify your sending domain (e.g., bluepineai.com)
   - Complete DNS verification

2. **Create IAM User for SES**
   - Create IAM user with `AmazonSESFullAccess` policy
   - Generate access keys
   - Add keys to environment variables

3. **Request Production Access**
   - AWS SES starts in sandbox mode
   - Request production access to send to any email
   - Until approved, you can only send to verified emails

## Testing Email Configuration

Test your email setup with:
```bash
curl http://localhost:3001/api/admin/test-email
```

## Alternative Email Services

If you don't want to use AWS SES, you can implement SMTP with services like:
- SendGrid
- Mailgun
- Gmail SMTP
- Outlook SMTP

Update the `email-service.js` file to use your preferred service.

## Troubleshooting

### Common Issues:

1. **"Credentials Error"**
   - Check AWS access keys are correct
   - Ensure IAM user has SES permissions

2. **"Email address not verified"**
   - Verify sender email in AWS SES console
   - Or request production access

3. **"Invalid token" errors**
   - Check Cognito configuration
   - Ensure user pool ID and client ID are correct

4. **Database connection issues**
   - Verify RDS endpoint and credentials
   - Check security groups allow connection from your IP 