#!/bin/bash

echo "=== ECS Service Status ==="
echo "Checking backend service..."
aws ecs describe-services --cluster staging-cluster --services staging-backend-service --region us-west-1 --profile AdministratorAccess-841283904924 --query 'services[0].{Name:serviceName,Status:status,Running:runningCount,Desired:desiredCount,TaskDefinition:taskDefinition}' --output table

echo ""
echo "Checking frontend service..."
aws ecs describe-services --cluster staging-cluster --services staging-frontend-service --region us-west-1 --profile AdministratorAccess-841283904924 --query 'services[0].{Name:serviceName,Status:status,Running:runningCount,Desired:desiredCount,TaskDefinition:taskDefinition}' --output table

echo ""
echo "=== Recent Tasks ==="
aws ecs list-tasks --cluster staging-cluster --region us-west-1 --profile AdministratorAccess-841283904924 --query 'taskArns[0:3]' --output table

echo ""
echo "=== ALB Target Health ==="
echo "Frontend targets:"
aws elbv2 describe-target-health --target-group-arn "arn:aws:elasticloadbalancing:us-west-1:841283904924:targetgroup/staging-frontend-tg/b95e102a16dfbc1d" --region us-west-1 --profile AdministratorAccess-841283904924 --query 'TargetHealthDescriptions[*].{Target:Target.Id,Health:TargetHealth.State}' --output table

echo ""
echo "Backend targets:"
aws elbv2 describe-target-health --target-group-arn "arn:aws:elasticloadbalancing:us-west-1:841283904924:targetgroup/staging-backend-tg/1944c11f1c1ed7e5" --region us-west-1 --profile AdministratorAccess-841283904924 --query 'TargetHealthDescriptions[*].{Target:Target.Id,Health:TargetHealth.State}' --output table 