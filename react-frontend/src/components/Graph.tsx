import React, { useState, useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Network, Node, Edge } from "vis-network";
import { postPoints } from "../router/resources/data";
import { DataArray, DataPoint } from "../types/data";
import { Id } from "vis-network/declarations/network/gephiParser";

interface GraphProps {
  //nodes: Node[];
  //edges: Edge[];
  explanations: number[];
  mutagData?: DataArray;
  selectedId: String;
}

const Graph: React.FC<GraphProps> = ({
  explanations,
  mutagData,
  selectedId,
}) => {
  const [explanationsUpdated, setUpdatedExplanations] = useState<number[]>();
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network>();
  useEffect(() => {
    if (explanations) setUpdatedExplanations(explanations.slice());
  }, [explanations]);

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let edge_index_from: number[] = [];
  let edge_index_to: number[] = [];

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

    for (let i = 0; i < explanationsUpdated!.length; i++) {
      if (edge_index_from[i] <= edge_index_to[i]) {
        const edge: Edge = {
          id: i,
          from: edge_index_from[i],
          to: edge_index_to[i],
          label: explanationsUpdated![i].toFixed(2).toString(), // Add label based on edge weight
          color: {
            color: "black",
            highlight: "red",
            //opacity: Number(explanations![i]) * 10,
          }, // Add color based on edge weight
          width: Number(explanationsUpdated![i]) * 10,
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

  function getEdges(
    mutagData: DataArray,
    selectedId: String,
    explanationsUpdated: number[]
  ) {
    const idx = Number(selectedId);
    const edges: Edge[] = [];
    const edge_index_from = mutagData
      ? mutagData[idx].edge_index[0]
      : [1, 1, 2, 3];
    const edge_index_to = mutagData
      ? mutagData[idx].edge_index[1]
      : [2, 3, 4, 4];

    for (let i = 0; i < edge_index_from.length; i++) {
      if (edge_index_from[i] <= edge_index_to[i]) {
        const edge: Edge = {
          id: i,
          from: edge_index_from[i],
          to: edge_index_to[i],
          label: explanationsUpdated![i].toFixed(2).toString(), // Add label based on edge weight
          color: {
            color: "black",
            highlight: "red",
            //opacity: Number(explanations![i]) * 10,
          }, // Add color based on edge weight
          width: Number(explanationsUpdated![i]) * 10,
        };
        edges.push(edge);
      }
    }
    return edges;
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

      network.on("click", (params) => {
        if (params.edges.length > 0) {
          const selectedEdgeId: Id = params.edges[0];
          const newLabel = prompt("Enter new label for edge: ");
          const edgeId = edgesDataSet.get(selectedEdgeId)?.id;
          const edgeFrom = edgesDataSet.get(selectedEdgeId)?.from;
          const edgeTo = edgesDataSet.get(selectedEdgeId)?.to;

          let backEdge = -1;
          for (let i = 0; i < explanationsUpdated!.length; i++) {
            if (edge_index_from[i] == edgeTo && edge_index_to[i] == edgeFrom) {
              backEdge = i;
              //break;
            }
          }

          const updatedExplanations = explanationsUpdated?.slice();
          updatedExplanations![Number(edgeId)] = Number(newLabel);
          updatedExplanations![backEdge] = Number(newLabel);
          setUpdatedExplanations(updatedExplanations);
          if (newLabel !== null) {
            edgesDataSet.update({
              id: selectedEdgeId,
              label: newLabel,
              width: updatedExplanations![Number(edgeId)] * 10,
            });
          }
        }
      });
    }
  }, [explanations, mutagData, explanationsUpdated]);

  return <div ref={containerRef} style={{ width: "100%", height: "400px" }} />;
};

export default Graph;
