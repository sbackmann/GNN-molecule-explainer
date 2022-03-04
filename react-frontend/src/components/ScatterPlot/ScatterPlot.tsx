import React, {useEffect, useState} from 'react'
import './ScatterPlot.scss'
import * as d3 from 'd3'
import {Types} from './types'
import queryBackend from '../../backend/BackendQueryEngine'
import {DataArray} from "../../types/DataArray";

export interface ScatterPlotProps {
    width: number
    height: number
    top?: number
    right?: number
    bottom?: number
    left?: number
    fill?: string
}

const ScatterPlot = (props: ScatterPlotProps) => {
    const [data, setData] = useState<DataArray>();

    useEffect(() => {
        const asyncGetData = async () => {
            const data = await queryBackend(`upload-data?name=moons`)
            setData(data);
        }

        asyncGetData();
    }, []);

    return <>{data && <InnerScatterPlot data={data} {...props}/>}</>;
}

const InnerScatterPlot = (props: ScatterPlotProps & { data: DataArray }) => {
    // const width = props.width - props.left - props.right;
    // const height = props.height - props.top - props.bottom;
    //
    // const svg = d3
    //     .select('.basicScatterChart')
    //     .append('svg')
    //     .attr('width', width + props.left + props.right)
    //     .attr('height', height + props.top + props.bottom)
    //     .append('g')
    //     .attr('transform', `translate(${props.left},${props.top})`)
    //
    // console.log('Hi, all good');
    //
    const x = d3.scaleLinear().domain([0, 1]).range([0, props.width]);
    // console.log('print x');
    // console.log(x);
    // svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
    //

    const colors = ["blue", "red"];
    const y = d3.scaleLinear().domain([0, 4.5]).range([props.height, 0])
    // svg.append('g').call(d3.axisLeft(y))
    // svg
    //     .append('g')
    //     .selectAll('dot')
    //     .data(props.data)
    //     .enter()
    //     .append('circle')
    //     .attr('cx', (d) => {
    //         return x(((d as unknown) as Types.Data).X1)
    //     })
    //     .attr('cy', (d) => {
    //         return y(((d as unknown) as Types.Data).X2)
    //     })
    //     .attr('r', 0.8)
    //     //.style('fill', function (d) { return colors[d.cluster]; })
    //     .style('fill', 'grey')

    const circleElements = props.data.map((row, idx) => {
        return <circle key={idx} cx={x(row.X1)} cy={y(row.X2)} r={5} fill={colors[row.cluster]}></circle>;
    })

    return <div className=".basicScatterChart">
        <svg width={props.width} height={props.height}>
            <g>
                {circleElements}
            </g>
        </svg>
    </div>
}


export default ScatterPlot;
