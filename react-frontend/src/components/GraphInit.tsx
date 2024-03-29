import React, { useState, useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Network, Node, Edge } from "vis-network";
import { postPoints } from "../router/resources/data";
import { DataArray, DataPoint } from "../types/data";
import { Id } from "vis-network/declarations/network/gephiParser";

interface GraphInitProps {
  mutagData?: DataArray;
  selectedId: String;
}

const GraphInit: React.FC<GraphInitProps> = ({ mutagData, selectedId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network>();

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (mutagData) {
    const idx = Number(selectedId);
    const nodes_list = mutagData![idx].x;
    const edge_index_from = mutagData![idx].edge_index[0];
    const edge_index_to = mutagData![idx].edge_index[1];
    const node_label_idx = nodes_list.map((row) =>
      row.indexOf(Math.max(...row))
    );
    const atom_names = ["C", "N", "O", "F", "I", "Cl", "Br"];
    const color_map = [
      "gray",
      "darkgreen",
      "orange",
      "blue",
      "purple",
      "yellow",
      "darkred",
    ];

    for (let i = 0; i < nodes_list.length; i++) {
      const label = String(atom_names[node_label_idx[i]]);
      const node: Node = {
        id: i,
        label: label,
        color: color_map[node_label_idx[i]],
      };
      nodes.push(node);
    }

    for (let i = 0; i < edge_index_from.length; i++) {
      if (edge_index_from[i] <= edge_index_to[i]) {
        const edge: Edge = {
          id: i,
          from: edge_index_from[i],
          to: edge_index_to[i],
          color: {
            color: "black",
            highlight: "red",
          }, // Add color based on edge weight
        };
        edges.push(edge);
      }
    }
  } else {
    const nodes = [
      { id: 1, label: "Node 1" },
      { id: 2, label: "Node 2" },
      { id: 3, label: "Node 3" },
    ];

    const edges = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
    ];
    const edgeWeights = [0.7, 0.4, 0.2, 0.9];
  }

  useEffect(() => {
    if (containerRef.current) {
      const nodesDataSet = new DataSet<Node>(nodes);
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

      const network = new Network(
        containerRef.current,
        { nodes: nodesDataSet, edges: edgesDataSet },
        options
      );
      networkRef.current = network;
    }
  }, [mutagData]);

  return <div ref={containerRef} style={{ width: "100%", height: "400px" }} />;
};

export default GraphInit;
