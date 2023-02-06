from flask_restful import Api
import dummy_server.resources as res

API = "/api/"  # optional string


def add_routes(app):
    api = Api(app)

    api.add_resource(res.scatter_data.BlobsResource, API + "blobs")
    api.add_resource(res.scatter_data.CirclesResource, API + "circles")
    api.add_resource(res.scatter_data.MoonsResource, API + "moons")

    return api
