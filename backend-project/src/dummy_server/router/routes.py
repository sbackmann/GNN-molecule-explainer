from flask_restful import Api
import dummy_server.resources as res

API = "/api/v1/"  # optional string


def add_routes(app):
    api = Api(app)

    api.add_resource(res.mol_dataset.MoleculeDataset, API + "data/<string:name>")

    return api
