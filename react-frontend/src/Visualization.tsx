import React from 'react';
import { DataArray } from './types/DataArray';
import { Margins } from './types/Margins';
import { Group } from '@visx/group';
import { GridColumns, GridRows } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import DataPointComponent from './components/DataPointComponent';

const DEFAULT_MARGINS: Margins = {
    left: 10,
    top: 10,
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
    const colors = ['blue', 'white'];
    // scales
    const xValues = data.map((d) => d.x1);
    const xScale = scaleLinear<number>()
        .domain([Math.min(...xValues), Math.max(...xValues)])
        .range([0, xMax]);

    const yValues = data.map((d) => d.x2);
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
                <GridRows scale={yScale} width={xMax} height={yMax} stroke="#e0e0e0" />
                <GridColumns scale={xScale} width={xMax} height={yMax} stroke="#e0e0e0" />
                <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />
                <AxisBottom top={yMax} scale={xScale} />
                <AxisLeft scale={yScale} />
                <text x="-140" y="-30" transform="rotate(-90)" fontSize={10}>
                    yAxis
                </text>
                <text x="200" y="350" transform="rotate(0)" fontSize={10}>
                    xAxis
                </text>
                {data.map((d, idx) => (
                    <DataPointComponent key={idx} x={xScale(d.x1)} y={yScale(d.x2)} color={colors[d.cluster]} />
                ))}
            </Group>
        </svg>
    );
};

export default Visualization;
