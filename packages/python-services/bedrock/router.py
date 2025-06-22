"""
AWS Bedrock Integration Router
Handles AI model interactions, embeddings, and advanced processing
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import boto3
import json
from datetime import datetime

router = APIRouter()

# Pydantic models for request/response
class BedrockChatRequest(BaseModel):
    message: str
    model_id: str = "anthropic.claude-3-sonnet-20240229-v1:0"
    max_tokens: int = 1000
    temperature: float = 0.7
    tenant_id: str
    user_id: str

class BedrockChatResponse(BaseModel):
    response: str
    tokens_used: int
    model_id: str
    processing_time_ms: int

class EmbeddingRequest(BaseModel):
    text: str
    model_id: str = "amazon.titan-embed-text-v1"

class EmbeddingResponse(BaseModel):
    embedding: List[float]
    dimensions: int

@router.post("/chat", response_model=BedrockChatResponse)
async def bedrock_chat(request: BedrockChatRequest):
    """
    Advanced Bedrock chat with token tracking and logging
    """
    try:
        # Initialize Bedrock client
        bedrock = boto3.client('bedrock-runtime', region_name='us-west-1')
        
        start_time = datetime.now()
        
        # Prepare the request
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": request.max_tokens,
            "temperature": request.temperature,
            "messages": [
                {
                    "role": "user",
                    "content": request.message
                }
            ]
        }
        
        # Make the request to Bedrock
        response = bedrock.invoke_model(
            modelId=request.model_id,
            body=json.dumps(body)
        )
        
        # Parse response
        response_body = json.loads(response['body'].read())
        
        # Calculate processing time
        processing_time = (datetime.now() - start_time).microseconds // 1000
        
        # Extract response text and token usage
        content = response_body.get('content', [{}])[0].get('text', '')
        tokens_used = response_body.get('usage', {}).get('output_tokens', 0)
        
        # TODO: Log to database
        # await log_bedrock_usage(request.tenant_id, request.user_id, tokens_used, processing_time)
        
        return BedrockChatResponse(
            response=content,
            tokens_used=tokens_used,
            model_id=request.model_id,
            processing_time_ms=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bedrock API error: {str(e)}")

@router.post("/embeddings", response_model=EmbeddingResponse)
async def create_embeddings(request: EmbeddingRequest):
    """
    Generate text embeddings using Bedrock
    """
    try:
        bedrock = boto3.client('bedrock-runtime', region_name='us-west-1')
        
        body = {
            "inputText": request.text
        }
        
        response = bedrock.invoke_model(
            modelId=request.model_id,
            body=json.dumps(body)
        )
        
        response_body = json.loads(response['body'].read())
        embedding = response_body.get('embedding', [])
        
        return EmbeddingResponse(
            embedding=embedding,
            dimensions=len(embedding)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embeddings error: {str(e)}")

@router.get("/models")
async def list_available_models():
    """
    List available Bedrock models
    """
    return {
        "chat_models": [
            "anthropic.claude-3-sonnet-20240229-v1:0",
            "anthropic.claude-3-haiku-20240307-v1:0",
            "anthropic.claude-instant-v1"
        ],
        "embedding_models": [
            "amazon.titan-embed-text-v1",
            "cohere.embed-english-v3"
        ]
    } 