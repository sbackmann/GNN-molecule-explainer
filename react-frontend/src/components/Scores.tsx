import React, { useState, useEffect, useRef } from "react";
import { DataArray, DataPoint } from "../types/data";
import { AxiosResponse } from "axios";
import axiosClient from "../router/apiClient";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Card from "react-bootstrap/Card";
import { Form, ListGroup } from "react-bootstrap";

interface ScoresProps {
  explanations: number[];
  mutagData?: DataArray;
  selectedId: String;
  checkboxState: any;
}

const ComputeScores: React.FC<ScoresProps> = ({
  explanations,
  mutagData,
  selectedId,
  checkboxState,
}) => {
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  //let scores = {};
  let mol: DataPoint = {
    x: [],
    edge_index: [],
    y: [],
    idx: [],
    edge_attr: [],
    adj_padded: [],
    x_padded: [],
  };
  if (mutagData) {
    mol = mutagData[Number(selectedId)];
  }

  useEffect(() => {
    if (Object.values(mol.edge_index).length > 0) {
      if (mol.edge_index[0].length === explanations.length) {
        const res = {
          edge_mask: explanations,
          data: mol,
          focus: checkboxState.focus,
          mask_nature: checkboxState.mask_nature,
        };
        axiosClient
          .post("/evaluate", res)
          .then((response: AxiosResponse) => {
            // Handle the response from the server
            //console.log(response.data);
            setScores(response.data);
            // ...
          })
          .catch((error: Error) => {
            // Handle any errors that occurred during the request
            console.error(error);
          });
      }
    }
  }, [explanations, mol]);

  return (
    <div>
      <ListGroup>
        <ListGroupItem>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "10px", minWidth: "80px" }}>
              Characterization:
            </span>
            <p>{scores["charact_prob"]}</p>
          </div>
        </ListGroupItem>
        <ListGroupItem>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "10px", minWidth: "80px" }}>
              Necessary explanation:
            </span>
            <p>{scores["fidelity_prob+"]}</p>
          </div>
        </ListGroupItem>
        <ListGroupItem>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "10px", minWidth: "80px" }}>
              Sufficient explanation:
            </span>
            <p>{1 - scores["fidelity_prob-"]}</p>
          </div>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
};

export default ComputeScores;
