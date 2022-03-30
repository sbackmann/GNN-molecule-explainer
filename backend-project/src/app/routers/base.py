

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse
import pandas as pd
import os
import datetime
from io import StringIO
from typing import Callable
from sklearn.cluster import KMeans
from fastapi import APIRouter

router = APIRouter()

@router.post("/get-data")
def upload_data(name: str):
    data = pd.read_csv(f"data/dataset_{name}.csv")
    kmeans = KMeans(n_clusters=2, random_state=0).fit(data)
    labels = kmeans.labels_
    data["cluster"] = labels.tolist()
    print(data.head())
    # print(data.to_dict(orient="records"))
    return data.to_dict(orient="records")


@router.post("/files/")
async def create_file(file: bytes = File(...)):
    return {"file_size": len(file)}


@router.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}


@router.get("/", response_class=HTMLResponse)
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

@router.get("/version")
async def version() -> dict:
  return {
    "commit": os.environ['COMMIT_ID'],
    "job": os.environ['JOB_ID'],
    "date": datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")
  }