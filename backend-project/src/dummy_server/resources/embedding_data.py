import os
import pandas as pd

from flask_restful import Resource
from sklearn.cluster import KMeans


class EmbeddingResource(Resource):
    """dataset resource."""
    data_root = os.path.join(".", "data")

    def get(self):
        path_name = os.path.join(self.data_root, f"embeddings.csv")
        data = pd.read_csv(path_name)
        # Convert to dictionary
        return data.to_dict(orient="records")
