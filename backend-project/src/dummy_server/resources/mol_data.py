from flask_restful import Resource
from .mol_dataset import MoleculeDataset
from .utils.gen_utils import data_to_dict

class DatasetResource(Resource):

    def get(self, name):
        dataset = MoleculeDataset(root="./backend-project/data", name=name)
        data_serial = [data_to_dict(graph) for graph in dataset]

        return data_serial