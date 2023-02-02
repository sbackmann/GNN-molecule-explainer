import requests
from flask_restful import Resource


class RemoteResource(Resource):
    """Simple template for a remote (web) resource."""

    def get(self):
        # Send a GET request for the specified resource
        r = requests.get(f"<url of resource>")

        # optionally convert the resource to the preferred format e.g. json
        data = r.json()

        return data
