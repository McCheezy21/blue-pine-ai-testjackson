#!/bin/bash

echo "=== Blue Pine AI Deployment Status ==="
echo "Date: $(date)"
echo ""

echo "1. Testing Application Endpoint:"
curl -I https://staging.chaseblueai.com 2>/dev/null | head -1 || echo "❌ Application not responding"
echo ""

echo "2. Testing ALB Direct:"
curl -I http://staging-alb-1323560265.us-west-1.elb.amazonaws.com 2>/dev/null | head -1 || echo "❌ ALB not responding"
echo ""

echo "3. Checking ECS Tasks:"
TASKS=$(aws ecs list-tasks --cluster staging-cluster --region us-west-1 --profile AdministratorAccess-841283904924 --output text --query 'taskArns[*]' 2>/dev/null)
if [ -z "$TASKS" ]; then
    echo "❌ No ECS tasks found"
else
    echo "✅ Found ECS tasks"
    for task in $TASKS; do
        echo "   Task: $(basename $task)"
        STATUS=$(aws ecs describe-tasks --cluster staging-cluster --tasks $task --region us-west-1 --profile AdministratorAccess-841283904924 --query 'tasks[0].lastStatus' --output text 2>/dev/null)
        echo "   Status: $STATUS"
    done
fi
echo ""

echo "4. Next Steps:"
echo "   - If tasks are STOPPED, check CloudWatch logs"
echo "   - If no tasks, check service configuration"
echo "   - Platform mismatch errors require image rebuild" 