from flask_restful import Resource
import json


DATA_FILES = {
    "instance-data": "gam-instance-data",
    "ames": "gam",
    "features": "features",
}
DATA_URL = "https://msrgamut.microsoft.com/data/ames-housing-"


class AmesData(Resource):
    def get(self, source):
        """
        r = requests.get(f'{DATA_URL}{DATA_FILES[source]}.json', verify=False)
        data_json = r.json()
        """

        with open(f"data/ames-housing-{DATA_FILES[source]}.json") as f:
            data_json = json.load(f)

        return data_json
