from flask_restful import Api
import src.resources as res

API = "/api/"


def add_routes(app):
    api = Api(app)

    api.add_resource(res.ames.AmesData, API + "/<string:source>")

    return api
