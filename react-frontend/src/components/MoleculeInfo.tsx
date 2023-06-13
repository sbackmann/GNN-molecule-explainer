import React, { useState, useEffect } from "react";
import { DataArray, DataPoint } from "../types/data";
import { EmbeddingArray } from "../types/data";
import { postEmbeddings } from "../router/resources/data";
import { AxiosResponse } from "axios";
import axiosClient from "../router/apiClient";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Card from "react-bootstrap/Card";
import { Form, ListGroup } from "react-bootstrap";

interface MoleculeProps {
  mutagData?: DataArray;
  embeddingData?: EmbeddingArray;
  selectedId: String;
}

const MoleculeInfo: React.FC<MoleculeProps> = ({
  mutagData,
  embeddingData,
  selectedId,
}) => {
  // State to store the true and predicted labels
  const [trueLabel, setTrueLabel] = useState("");
  const [predictedLabel, setPredictedLabel] = useState("");
  const [numNodes, setNumNodes] = useState(0);
  const [numEdges, setNumEdges] = useState(0);

  // Function to handle displaying the labels for the selected data point
  const displayLabels = () => {
    if (mutagData && embeddingData) {
      // Find the data point with the selected ID
      const selectedDataPoint = mutagData![Number(selectedId)];
      const selectedEmbeddingPoint = embeddingData![Number(selectedId)];
      // Set the true and predicted labels
      setTrueLabel(selectedEmbeddingPoint.true_label);
      setPredictedLabel(selectedEmbeddingPoint.gnn_label);
      setNumNodes(selectedDataPoint.x.length);
      setNumEdges(selectedDataPoint.edge_index[0]?.length || 0);
    } else {
      // Set the true and predicted labels
      setTrueLabel("0");
      setPredictedLabel("0");
      setNumNodes(0);
      setNumEdges(0);
    }
  };

  // Call the displayLabels function when the component mounts or the selected ID changes
  useEffect(() => {
    displayLabels();
  }, [selectedId, mutagData, embeddingData]);

  return (
    <ListGroup>
      <ListGroupItem>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "10px", minWidth: "80px" }}>
            Toxicity: {trueLabel}
          </span>
        </div>
      </ListGroupItem>
      <ListGroupItem>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "10px", minWidth: "80px" }}>
            GNN predicted toxicity: {predictedLabel}
          </span>
        </div>
      </ListGroupItem>
      <ListGroupItem>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "10px", minWidth: "80px" }}>
            Number of atoms: {numNodes}
          </span>
        </div>
      </ListGroupItem>
      <ListGroupItem>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "10px", minWidth: "80px" }}>
            Number of bonds: {numEdges}
          </span>
        </div>
      </ListGroupItem>
    </ListGroup>
  );
};

export default MoleculeInfo;
