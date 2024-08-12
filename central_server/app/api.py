from fastapi import FastAPI, Request
import numpy as np
from numpy import array
import tensorflow as tf
from tensorflow import keras
from keras.preprocessing.text import one_hot
from keras_preprocessing.sequence import pad_sequences
import json
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()


app = FastAPI()
security = HTTPBearer()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    title: str
    base: str


def get_token(auth: HTTPAuthorizationCredentials = Depends(security)):
    token = auth.credentials
    if token != "YOUR_TOKEN":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token

@app.get('/')
def index():
    return {'message': 'This is the homepage of the API '}



@app.get('/getPath/{sentence}&{discovery}')

def read_paths_json(file_path):
    with open(file_path) as file:
        data = json.load(file)
    return data


@app.get('/node')
def get_paths():
    try:
        with open('paths.json', 'r') as f:
            data = json.load(f)
        return data
    except Exception as e:
        return {'error': str(e)}
    

#ENDPOINT TO REGISTER NODES INTO THE CENTRAL SERVER STRUCTURE

#@app.post("/node")
#def create_nodes(nodes: List[Node], request: Request):
#    client_address = request.client.host

#    print(f"Address: {client_address}")

#    for node in nodes:
#        print(f"Title: {node.title}, Base: {node.base}")
#    return {"received_data": nodes}