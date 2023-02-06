from flask_restful import Resource
import json


class LocalResource(Resource):
    """Simple template for a local resource."""
    def get(self):
        with open(f"../../../local/hello.json") as f:
            # process the file, e.g. convert it to json format
            data = json.load(f)

        return data
