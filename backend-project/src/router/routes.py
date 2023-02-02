from flask_restful import Api
import src.resources as res

API = "/api/"  # optional string


def add_routes(app):
    api = Api(app)

    api.add_resource(res.ames.local, API + "<access point url>")

    return api
