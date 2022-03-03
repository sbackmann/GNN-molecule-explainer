import { dataArrayDecoder } from './json-decoder';
import { DataArray } from '../types/DataArray';

enum ResponseType {
    JSON,
    BLOB,
    TEXT,
}

type JSONType = string | number | boolean | null | { [property: string]: JSONType } | JSONType[];

class BackendQueryEngine {
    private static readonly BASE_URL = 'http://127.0.0.1:8080';

    private static async queryBackend(
        route: string,
        parameters: JSONType = {},
        responseType: ResponseType = ResponseType.JSON
    ): Promise<unknown> {
        const requestURL = `${BackendQueryEngine.BASE_URL}/${route}`;

        return fetch(requestURL, {
            body: JSON.stringify(parameters),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then((response) => {
            if (responseType === ResponseType.JSON) return response.json();
            if (responseType === ResponseType.BLOB) return response.blob();
            if (responseType === ResponseType.TEXT) return response.text();

            return null;
        });
    }

    public static async exampleData(
        dimensions: number,
        numDatapoints: number,
        minValue: number,
        maxValue: number
    ): Promise<DataArray> {
        const jsonResponse: unknown = await BackendQueryEngine.queryBackend(`example-data`, {
            dimensions,
            numDatapoints,
            minValue,
            maxValue,
        });
        return dataArrayDecoder.decodeToPromise(jsonResponse);
    }
}

export default BackendQueryEngine;
