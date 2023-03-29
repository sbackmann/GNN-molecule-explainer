from flask_restful import Resource
from .mol_dataset import MoleculeDataset
from .utils.gen_utils import data_to_dict

class DatasetResource(Resource):

    def get(self):
        dataset = MoleculeDataset(root="./backend-project/data", name="MUTAG")
        data_serial = {idx: data_to_dict(graph) for idx, graph in enumerate(dataset)}

        return data_serial