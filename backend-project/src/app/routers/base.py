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
    print(os.getcwd())
    data = pd.read_csv(f"app/data/dataset_{name}.csv")
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

color = ["AAA239", "D4CD6A", "FFF9AA"]
#color = ["3A3276", "5B5393", "847EB1"]

@router.get("/", response_class=HTMLResponse)
async def root():
    html_content = """
        <html>
            <head>
                <title>CI/CD Test</title>
            </head>
            <body style=\"background-color: #%s; padding: 20px;\">
                <h1 style=\"background-color: #%s; padding: 3px; width: 100%%;\" >Test CI/CD</h1>
                <p style=\"background-color: #%s; padding: 3px; width: 100%%;\" >This is the backend for the "Dummy Fullstack" app.</p>
            </body>
        </html>
        """ % (color[0],color[1],color[2])
    return HTMLResponse(content=html_content, status_code=200)

@router.get("/version")
async def version() -> dict:
  return {
    "commit": os.environ['COMMIT_ID'],
    "job": os.environ['JOB_ID'],
    "current_date": datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")
  }
