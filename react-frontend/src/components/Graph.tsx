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

const Graph: React.FC<GraphProps> = ({ explanations, mutagData, selectedId }) => {
  const [explanations_updated, setUpdatedExplantations] = useState<number[]>();
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network>();
  useEffect(() => {
    if (explanations)
      setUpdatedExplantations(explanations.slice());
    }, [explanations]);

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let edge_index_from: number[] = [];
  let edge_index_to: number[] = [];

  if (mutagData) {
    const idx = Number(selectedId);
    const calc_idx = mutagData![idx].idx;
    edge_index_from = mutagData![idx].edge_index[0];
    edge_index_to = mutagData![idx].edge_index[1];
    const nodes_list = mutagData![idx].x;

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
    for (let i = 0; i < explanations_updated!.length; i++) {
      if (edge_index_from[i] <= edge_index_to[i]) {
        const edge: Edge = {
          id: i,
          from: edge_index_from[i],
          to: edge_index_to[i],
          label: explanations_updated![i].toFixed(2).toString(), // Add label based on edge weight
          color: {
            color: "black",
            highlight: "red",
            //opacity: Number(explanations![i]) * 10,
          }, // Add color based on edge weight
          width: Number(explanations_updated![i]) * 10,
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

      network.on('click', (params) => {
        if (params.edges.length > 0) {
          const selectedEdgeId: Id = params.edges[0];
          const newLabel = prompt('Enter new label for edge: ');
          const edge_id = edgesDataSet.get(selectedEdgeId)?.id;
          const edge_from = edgesDataSet.get(selectedEdgeId)?.from;
          const edge_to = edgesDataSet.get(selectedEdgeId)?.to;
          let back_edge = -1;
          for (let i = 0; i < explanations_updated!.length; i++) {
            if (edge_index_from[i] == edge_to && edge_index_to[i] == edge_from)
              back_edge = i;
          }
          const explanations_temp = explanations_updated?.slice()
          explanations_temp![Number(edge_id)] = Number(newLabel);
          explanations_temp![back_edge] = Number(newLabel)
          setUpdatedExplantations(explanations_temp);
          if (newLabel !== null) {
            edgesDataSet.update({
              id: selectedEdgeId,
              label: newLabel,
            });
          }
        }
      });
    }
  }, [explanations, mutagData, explanations_updated]);

  return <div ref={containerRef} style={{ width: "100%", height: "400px" }} />;
};

export default Graph;
