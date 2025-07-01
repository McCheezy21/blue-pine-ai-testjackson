#!/bin/bash

# Fix ALB-ECS Networking Issue
echo "🔧 Fixing ALB-ECS networking issue..."

# Get ALB Security Group ID
ALB_SG=$(aws elbv2 describe-load-balancers --names staging-alb --region us-west-1 --profile AdministratorAccess-841283904924 --query 'LoadBalancers[0].SecurityGroups[0]' --output text 2>/dev/null)
echo "ALB Security Group: $ALB_SG"

# Get ECS Security Group ID from service
ECS_SG=$(aws ecs describe-services --cluster staging-cluster --services staging-frontend-service --region us-west-1 --profile AdministratorAccess-841283904924 --query 'services[0].networkConfiguration.awsvpcConfiguration.securityGroups[0]' --output text 2>/dev/null)
echo "ECS Security Group: $ECS_SG"

if [ "$ALB_SG" != "None" ] && [ "$ECS_SG" != "None" ]; then
    echo "✅ Found security groups, updating rules..."
    
    # Add outbound rule to ALB security group
    aws ec2 authorize-security-group-egress \
        --group-id $ALB_SG \
        --protocol tcp \
        --port 80 \
        --source-group $ECS_SG \
        --region us-west-1 \
        --profile AdministratorAccess-841283904924 2>/dev/null
    
    # Add inbound rule to ECS security group
    aws ec2 authorize-security-group-ingress \
        --group-id $ECS_SG \
        --protocol tcp \
        --port 80 \
        --source-group $ALB_SG \
        --region us-west-1 \
        --profile AdministratorAccess-841283904924 2>/dev/null
    
    echo "✅ Security group rules updated!"
else
    echo "❌ Could not find security groups"
fi

echo "🔄 Forcing new deployment..."
aws ecs update-service --cluster staging-cluster --service staging-frontend-service --force-new-deployment --region us-west-1 --profile AdministratorAccess-841283904924

echo "⏳ Waiting for deployment..."
sleep 60

echo "🧪 Testing frontend..."
curl -I -k https://staging-alb-1323560265.us-west-1.elb.amazonaws.com

echo "✅ Networking fix complete!" 