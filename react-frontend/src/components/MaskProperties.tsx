import React, { useState, useEffect, useRef } from "react";
import { DataArray, DataPoint } from "../types/data";
import { AxiosResponse } from "axios";
import axiosClient from "../router/apiClient";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Card from "react-bootstrap/Card";
import { Form, ListGroup } from "react-bootstrap";
import Slider from "./Slider";

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
  let mol: any[] | object = {};
  if (mutagData) {
    mol = mutagData[Number(selectedId)];
  }

  useEffect(() => {
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
    console.log(properties);
  }, [explanations]);

  return (
    <div>
      <Card.Title>Mask Property</Card.Title>
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
