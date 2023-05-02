import os
import pandas as pd
import pickle

from flask_restful import Resource


class EmbeddingResource(Resource):
    """dataset resource."""
    data_root = os.path.join(".", "data")

    def get(self):
        path_name = os.path.join(self.data_root, f"embeddings.csv")
        data = pd.read_csv(path_name)
        # Convert to dictionary
        return data.to_dict(orient="records")

class PredictionsResource(Resource):
    data_root = os.path.join(".", "data")

    def get(self):
        path_name = os.path.join(self.data_root, f"pred.pkl")
        with open(path_name, "rb") as f:
            pred = pickle.load()