from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse
import uvicorn
import pandas as pd
import os
import csv
import codecs
from io import StringIO

app = FastAPI(
    title="Test Python Backend",
    description="""This is a template for a Python backend.
                   It provides acess via REST API.""",
    version="0.1.0",
)


@app.post("/upload-data")
def upload_data(file: UploadFile = File(...)):
    ##data = pd.read_csv(file.file)
    ##if cluster_algo

    return pd.read_csv(file.file).to_dict()


@app.get("/", response_class=HTMLResponse)
async def root():
    html_content = """
        <html>
            <head>
                <title>Week 2</title>
            </head>
            <body>
                <h1>Test Python Backend</h1>
                Visit the <a href="/docs">API doc</a> (<a href="/redoc">alternative</a>) for usage information.
            </body>
        </html>
        """
    return HTMLResponse(content=html_content, status_code=200)
