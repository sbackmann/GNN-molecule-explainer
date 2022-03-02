//import ScatterPlot from '../components/ScatterPlot/ScatterPlot';
import { json } from "stream/consumers";
import { JsonDecoder } from "ts.data.json";
import { DataArray } from "../types/DataArray";
import { dataArrayDecoder } from "./json-decoder";

enum ResponseType {
    JSON,
    BLOB,
    TEXT,
}

type JSONType = string | number | boolean | null | { [property: string]: JSONType } | JSONType[];

// class BackendQueryEngine {
//     private static readonly BASE_URL = 'http://127.0.0.1:8080';

//     private static scatterplot = ScatterPlot;

//     private static async queryBackend(
//         route: string,
//         parameters: JSONType = {},
//         responseType: ResponseType = ResponseType.JSON
//     ): Promise<unknown> {
//         const requestURL = `${BackendQueryEngine.BASE_URL}/${route}`;

//         return fetch(requestURL, {
//             body: JSON.stringify(parameters),
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             method: 'POST',
//         }).then((response) => {
//             if (responseType === ResponseType.JSON) return response.json();
//             if (responseType === ResponseType.BLOB) return response.blob();
//             if (responseType === ResponseType.TEXT) return response.text();

//             return null;
//         }).then(data => this.scatterplot());
//     }
// }


// Make the `request` function generic
// to specify the return data type:
// function request<TResponse>(
//     url: string,
//     // `RequestInit` is a type for configuring 
//     // a `fetch` request. By default, an empty object.
//     config: RequestInit = {}

//     // This function is async, it will return a Promise:
// ): Promise<TResponse> {

//     // Inside, we call the `fetch` function with 
//     // a URL and config given:
//     return fetch(url, config)
//         // When got a response call a `json` method on it
//         .then((response) => response.json())
//         // and return the result data.
//         //.then((data) => data as TResponse);
//         .then((data) => data as TResponse);

//     // We also can use some post-response
//     // data-transformations in the last `then` clause.
// }


export interface queryBackendProps {
    route: string;
}

export const BASE_URL = 'http://127.0.0.1:8080';

const queryBackend = async (route: string): Promise<unknown> => {
    const requestURL = `${BASE_URL}/${route}`;
    const { data } = await fetch(requestURL).then((response) => response.json())

    return data
}

export const getData = async (route: string): Promise<DataArray> => {
    console.log('hi there');
    const jsonResponse = await queryBackend(route);
    console.log(jsonResponse);
    console.log('hi');
    // const jsonResponse = {
    //     "X1": {
    //         "0": 3,
    //         "1": 2,
    //         "2": 1
    //     },
    //     "X2": {
    //         "0": -0.7985781715081679,
    //         "1": 0.9344454645471068,
    //         "2": 0.397302084259078
    //     }
    // }

    return dataArrayDecoder.decodeToPromise(jsonResponse);
}




export default queryBackend;
