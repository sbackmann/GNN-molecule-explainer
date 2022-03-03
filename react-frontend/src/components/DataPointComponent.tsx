import React from 'react';
import { Circle } from '@visx/shape';
//import styled from 'styled-components';

// const StyledCircle = styled(Circle)`
//     stroke: gray;
//     fill: pink;
// `;

interface Props {
    x: number;
    y: number;
    color: string;
}

const DataPointComponent: React.FunctionComponent<Props> = ({ x, y, color }: Props) => {
    return <Circle cx={x} cy={y} r={1} fill={color} />;
};

export default DataPointComponent;
