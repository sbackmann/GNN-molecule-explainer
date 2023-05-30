import React, { useState, useEffect } from "react";
import { DataArray, DataPoint } from "../types/data";
import { AxiosResponse } from "axios";
import axiosClient from "../router/apiClient";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Card from "react-bootstrap/Card";
import { ListGroup } from "react-bootstrap";

interface PropertiesProps {
  explanations: number[];
  mutagData?: DataArray;
  selectedId: String;
  checkboxState: any;
}

const ComputeProperties: React.FC<PropertiesProps> = ({
  explanations,
  mutagData,
  selectedId,
  checkboxState,
}) => {
  const [properties, setProperties] = useState<{ [key: string]: number }>({});
  //let Properties = {};
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
          .post("/properties", res)
          .then((response: AxiosResponse) => {
            // Handle the response from the server
            //console.log(response.data);
            setProperties(response.data);
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
      The explanation corresponds to a mask on the edges (bonds). This mask has
      some properties like the number of positive values (size), the entropy of
      the value distribution, and the sparsity of the mask.
      <ListGroup>
        <ListGroupItem>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "10px", minWidth: "80px" }}>Size:</span>
            <p>{properties["mask_size"]}</p>
          </div>
        </ListGroupItem>
        <ListGroupItem>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "10px", minWidth: "80px" }}>
              Entropy:
            </span>
            <p>{properties["mask_entropy"]}</p>
          </div>
        </ListGroupItem>
        <ListGroupItem>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "10px", minWidth: "80px" }}>
              Sparsity:
            </span>
            <p>{properties["mask_sparsity"]}</p>
          </div>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
};

export default ComputeProperties;
