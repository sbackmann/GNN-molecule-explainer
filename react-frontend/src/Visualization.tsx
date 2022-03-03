import React from 'react';
import { DataArray } from './types/DataArray';
import { Margins } from './types/Margins';
import { Group } from '@visx/group';
import { GridColumns, GridRows } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import DataPointComponent from './components/DataPointComponent';

const DEFAULT_MARGINS: Margins = {
    left: 100,
    top: 50,
    bottom: 100,
    right: 20,
};

interface Props {
    data: DataArray;
    width: number;
    height: number;
    margins?: Margins;
}

const Visualization: React.FunctionComponent<Props> = ({ data, width, height, margins = DEFAULT_MARGINS }: Props) => {
    // figure bounds
    const xMax = width - margins.left - margins.right;
    const yMax = height - margins.top - margins.bottom;
    const colors = ['blue', 'pink'];
    // scales
    const xValues = data.map((d) => d.X1);
    console.log(xValues);
    const xScale = scaleLinear<number>()
        .domain([Math.min(...xValues), Math.max(...xValues)])
        .range([0, xMax]);
    console.log(yMax);
    console.log('this data')
    console.log(data)
    const yValues = data.map((d) => d.X2);
    console.log(yValues)
    const yScale = scaleLinear<number>()
        .domain([Math.min(...yValues), Math.max(...yValues)])
        .range([0, yMax]);

    //const dataValues = data.map((d) => d.value);
    //const valueScale = scaleLinear<number>()
    //    .domain([Math.min(...dataValues), Math.max(...dataValues)])
    //    .range([0, 10]);

    return (
        <svg width={width} height={height}>
            <Group left={margins.left} top={margins.top}>
                {/* <GridRows scale={yScale} width={xMax} height={yMax} stroke="#eaf0f6" /> */}
                {/* <GridColumns scale={xScale} width={xMax} height={yMax} stroke="#eaf0f6" /> */}
                {/* <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="white" /> */}
                <AxisBottom top={yMax} scale={xScale} stroke='white' />
                <AxisLeft scale={yScale} stroke='white' />
                <text x="-200" y="-70" transform="rotate(-90)" fontSize={30} fill='white'>
                    x2
                </text>
                <text x="500" y="500" transform="rotate(0)" fontSize={30} fill='white'>
                    x1
                </text>
                {data.map((d, idx) => (
                    <DataPointComponent key={idx} x={xScale(d.X1)} y={yScale(d.X2)} color={colors[d.cluster]} />
                ))}
            </Group>
        </svg>
    );
};

export default Visualization;
