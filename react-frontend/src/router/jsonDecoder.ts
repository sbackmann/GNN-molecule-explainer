import { JsonDecoder } from 'ts.data.json';
import { DataPoint } from '../types/data';

/* **********
 * number[] *
 ********** */
const dataPointDecoder = JsonDecoder.object<DataPoint>(
    {
        X1: JsonDecoder.number,
        X2: JsonDecoder.number,
        cluster: JsonDecoder.string
    },
    'DataPoint'
);

/* ***********
 * DataArray *
 *********** */
export const dataArrayDecoder = JsonDecoder.array<DataPoint>(dataPointDecoder, 'DataArray');
