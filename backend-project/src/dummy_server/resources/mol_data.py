from flask_restful import Resource
from .mol_dataset import MoleculeDataset
from .utils.gen_utils import data_to_dict
import os

class DatasetResource(Resource):
    data_root = os.path.join(".", "data")

    def get(self, name):
        dataset = MoleculeDataset(root=self.data_root, name=name)
        data_serial = [data_to_dict(graph) for graph in dataset]
        return data_serial