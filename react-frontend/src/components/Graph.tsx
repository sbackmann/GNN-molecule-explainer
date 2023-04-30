import React, { useState, useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Network, Node, Edge } from "vis-network";
import { postPoints } from "../router/resources/data";
import { DataArray, DataPoint } from "../types/data";

interface GraphProps {
  nodes: Node[];
  edges: Edge[];
  edgeWeights: number[];
}

const Graph: React.FC<GraphProps> = ({ nodes, edges, edgeWeights }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network>();
  /*
  const edgeWeights_ = [0.5, 0.2, 0.7, 0.1];
  const [Data, setData] = useState<DataArray>();
  useEffect(() => {
    postPoints().then((Data) => {
      setData(Data);
    });
  }, []);

  if (Data) {
    const idx = 0;
    const calc_idx = Data![idx].idx;
    const edge_index_from = Data![idx].edge_index[0]
    const edge_index_to = Data![idx].edge_index[1]
    const nodes_list = Data![idx].x

    for (let i = 0; i < nodes_list.length; i++) {
      const node: Node = {id: i+1, label: String(nodes_list[i])};
      nodes.push(node)
    }
    for (let i = 0; i < edge_index_from.length; i++) {
      const edge: Edge = {from: edge_index_from[i], to: edge_index_to[i]};
      edges.push(edge)
    }
  } else {
    nodes = [
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
    ];
   
    edges = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
    ];
    edgeWeights = [0.7, 0.4, 0.2, 0.9];
  }*/
  useEffect(() => {
    if (containerRef.current) {
      // create nodes dataset
      const nodesDataSet = new DataSet<Node>(nodes);

      // create edges dataset
      const edgesDataSet = new DataSet<Edge>(edges);

      // create options object
      const options = {
        edges: {
          arrows: {
            to: {
              enabled: false,
              scaleFactor: 0.5,
            },
          },
          font: {
            size: 16,
          },
          width: 2,
          color: {
            color: "gray",
            highlight: "red",
          },
          labelHighlightBold: true,
        },
        nodes: {
          font: {
            size: 20,
            color: "black",
            bold: "true",
          },
          shape: "circle",
          color: {
            background: "#FFFFFF",
            border: "#000000",
            highlight: {
              background: "#FF0000",
              border: "#000000",
            },
          },
          borderWidth: 3,
          size: 30,
        },
        interaction: {
          dragNodes: false,
          dragView: false,
          zoomView: false,
        },
      };

      // create network object
      const network = new Network(
        containerRef.current,
        { nodes: nodesDataSet, edges: edgesDataSet },
        options
      );

      // save network object to ref
      networkRef.current = network;
    }
  }, [nodes, edges, edgeWeights]);

  return <div ref={containerRef} style={{ width: "100%", height: "400px" }} />;
};

export default Graph;
