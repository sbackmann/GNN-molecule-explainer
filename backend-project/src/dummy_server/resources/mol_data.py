import os
from flask_restful import Resource
import torch

class DatasetResource(Resource):
    data_root = os.path.join(".", "data", "mutag", "processed")

    def get(self):
        path_name = os.path.join(self.data_root, "data.pt")
        data = torch.load(path_name)
        data_serial = {k: v.numpy().tolist() for k, v in data[1].items()}
        return data_serial
