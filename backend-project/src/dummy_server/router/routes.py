from flask_restful import Api
from ..resources import mol_data, embedding_data

API = "/api/v1/"  # optional string


def add_routes(app):
    api = Api(app)

    api.add_resource(mol_data.DatasetResource, API + "data/mutag")
    api.add_resource(embedding_data.EmbeddingResource, API + "data/embeddings")
    api.add_resource(mol_data.ExplainerResource, API + "data/<string:name>")
    
    return api
