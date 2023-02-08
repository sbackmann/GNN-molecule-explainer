import os
from flask_restful import Resource
import pandas as pd
from sklearn.cluster import KMeans


class DatasetResource(Resource):
    """Abstract template for a dataset resource."""
    name: str  # abstract attribute
    data_root = os.path.join(".", "data")

    def get(self):
        path_name = os.path.join(self.data_root, f"dataset_{self.name}.csv")
        data = pd.read_csv(path_name)
        
        # process the data, e.g. find the clusters
        kmeans = KMeans(n_clusters=2, n_init=10, random_state=0).fit(data)
        labels = kmeans.labels_
        
        # Add cluster to data
        data["cluster"] = labels.tolist()

        # Convert to dictionary
        return data.to_dict(orient="records")


class BlobsResource(DatasetResource):
    name = "blobs"


class CirclesResource(DatasetResource):
    name = "circles"


class MoonsResource(DatasetResource):
    name = "moons"


