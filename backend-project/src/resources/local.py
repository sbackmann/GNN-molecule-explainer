from flask_restful import Resource
import json


class LocalResource(Resource):
    """Simple template for a local resource."""
    def get(selfe):
        with open(f"<complete path to local file (filename included)>") as f:
            # process the file, e.g. convert it to json format
            data = json.load(f)

        return data
