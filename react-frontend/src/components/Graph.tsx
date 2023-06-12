import React, { useState, useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Network, Node, Edge } from "vis-network";
import Button from "react-bootstrap/Button";
import { DataArray } from "../types/data";
import { Id } from "vis-network/declarations/network/gephiParser";
import "./Graph.css";

interface GraphProps {
  explanations: number[];
  explanationsUpdated: number[];
  mutagData?: DataArray;
  selectedId: String;
  setUpdatedExplanations: (d: any) => void;
}

const Graph: React.FC<GraphProps> = ({
  explanations,
  explanationsUpdated,
  mutagData,
  selectedId,
  setUpdatedExplanations,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network>();
  const [history, setHistory] = useState<number[][]>([]);
  const [redoHistory, setRedoHistory] = useState<number[][]>([]);
  const edgesDataSet = new DataSet<Edge>([]);

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
  }

  useEffect(() => {
    if (containerRef.current) {
      const nodesDataSet = new DataSet<Node>(nodes);
      const edgesDataSet = new DataSet<Edge>(edges);

      // create options object
      const options = {
        layout: {
          randomSeed: 42,
          width: "100%", // Set the desired width of the graph
          height: "600px", // Set the desired height of the graph
        },
        edges: {
          arrows: {
            to: {
              enabled: false,
              scaleFactor: 0.5,
            },
          },
          font: {
            size: 26,
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
            if (edge_index_from[i] === edgeTo && edge_index_to[i] === edgeFrom) {
              backEdge = i;
              //break;
            }
          }

          const updatedExplanations = explanationsUpdated?.slice();
          updatedExplanations![Number(edgeId)] = Number(newLabel);
          updatedExplanations![backEdge] = Number(newLabel);
          setHistory((prevHistory) => [...prevHistory, explanationsUpdated]);
          setRedoHistory([]);
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

      return () => {
        // Cleanup function to remove the click event listener
        network.off("click");
      };
    }
    
  }, [mutagData, explanationsUpdated]);
  
  const handleUndo = () => {
    if (history.length > 0) {
      const previousWeights = history[history.length - 1];
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      setRedoHistory((prevRedoHistory) => [...prevRedoHistory, explanationsUpdated]);
      setUpdatedExplanations(previousWeights);
      // Update the graph with the previous weights
      edgesDataSet.forEach((edge) => {
        const edgeId = edge.id as Id;
        const weight = previousWeights[Number(edgeId)];
        edgesDataSet.update({
          id: edgeId,
          label: weight.toFixed(2).toString(),
          width: weight * 10,
        });
      });
    }
  };

  const handleRedo = () => {
    if (redoHistory.length > 0) {
      const nextWeights = redoHistory[redoHistory.length - 1];
      setRedoHistory((prevRedoHistory) => prevRedoHistory.slice(0, -1));
      setHistory((prevHistory) => [...prevHistory, explanationsUpdated]);
      setUpdatedExplanations(nextWeights);
      // Update the graph with the next weights
      edgesDataSet.forEach((edge) => {
        const edgeId = edge.id as Id;
        const weight = nextWeights[Number(edgeId)];
        edgesDataSet.update({
          id: edgeId,
          label: weight.toFixed(2).toString(),
          width: weight * 10,
        });
      });
    }
  };

  const handleReset = () => {
    setHistory([]);
    setRedoHistory([]);
    setUpdatedExplanations(explanations);
    // Reset the graph to the initial state
    edgesDataSet.forEach((edge) => {
      const edgeId = edge.id as Id;
      const weight = explanationsUpdated[Number(edgeId)];
      edgesDataSet.update({
        id: edgeId,
        label: weight.toFixed(2).toString(),
        width: weight * 10,
      });
    });
  };

  return (
    <div>
      <Button variant="primary" onClick={handleUndo}>&#8630;</Button>&nbsp;
      <Button variant="primary" onClick={handleRedo}>&#8631;</Button>&nbsp;
      <Button variant="primary" onClick={handleReset}>Reset</Button>
      <div className="graph-container" ref={containerRef} />
    </div>
  );
};

export default Graph;
