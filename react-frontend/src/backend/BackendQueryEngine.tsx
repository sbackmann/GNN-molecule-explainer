import { DataArray } from "../types/DataArray";

export interface queryBackendProps {
    route: string;
}

const { BACKEND_SERVICE_NAME } = process.env;
const { BACKEND_SERVICE_PORT } = process.env;

export const BASE_URL = BACKEND_SERVICE_NAME

export const queryBackend = async (route: string): Promise<DataArray> => {
    const requestURL = `${BASE_URL}/${route}`;
    // const formData = new FormData();
    const data = await fetch(requestURL,
        {
            method: 'POST'
        }
    ).then(response => response.json()).then(d => d as DataArray);

    return data;
}


export default queryBackend;


