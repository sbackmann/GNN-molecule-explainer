import argparse
import os

from flask import Flask, request, jsonify
from flask_cors import CORS

from dummy_server.router.routes import add_routes
from dummy_server.resources.evaluate import compute_scores

def create_app():
    app = Flask(__name__)  # static_url_path, static_folder, template_folder...
    CORS(app, resources={r"/*": {"origins": "*"}})
    add_routes(app)

    @app.route('/version')
    def version():
        return f"Job ID: {os.environ['JOB_ID']}\nCommit ID: {os.environ['COMMIT_ID']}"

    @app.route('/overview')
    def overview():
        return f"This is the main application page showing the overview."
    
    @app.route('/api/v1/evaluate', methods=['POST'])
    def evaluate():
        edge_mask = request.json['edge_mask'] 
        data = request.json['data']
        focus = request.json['focus']
        mask_nature = request.json['mask_nature']
        scores, mask_properties = compute_scores(data, edge_mask, focus, mask_nature)
        print(jsonify(scores))
        return jsonify(scores)

    return app


def start_server():
    parser = argparse.ArgumentParser()

    # API flag
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="The host to run the server",
    )
    parser.add_argument(
        "--port",
        default=8000,
        help="The port to run the server",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Run Flask in debug mode",
    )

    args = parser.parse_args()

    server_app = create_app()

    server_app.run(debug=args.debug, host=args.host, port=args.port)




if __name__ == "__main__":
    start_server()
