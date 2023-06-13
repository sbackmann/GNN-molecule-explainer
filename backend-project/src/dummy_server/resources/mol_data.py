from flask_restful import Resource
from .mol_dataset import MoleculeDataset
from .utils.gen_utils import data_to_dict
from .process_mask import read_mask, transform
import os
import json

class DatasetResource(Resource):
    data_root = os.path.join(".", "data")

    def get(self):
        dataset = MoleculeDataset(root=self.data_root, name="MUTAG")
        data_serial = [data_to_dict(graph) for graph in dataset]
        return data_serial
    
class ExplainerResource(Resource):
    data_root = os.path.join(".", "data", "masks")

    def get(self, name):
        explainer, focus, idx, mask_nature, mask_transformation, level = name.split('_')
        data = read_mask(idx=idx, explainer=explainer, focus=focus)
        data_transformed = transform(mask=data, mask_nature=mask_nature, mask_transformation=mask_transformation, level=float(level))
        data_transformed_serialized = data_transformed.tolist()
        return data_transformed_serialized