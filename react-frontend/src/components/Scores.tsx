import React, { useState, useEffect, useRef } from "react";
import { DataArray, DataPoint } from "../types/data";
import { AxiosResponse } from "axios";
import axiosClient from "../router/apiClient";

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
    console.log(scores);
  }, [explanations]);

  return (
    <div>
      {Object.keys(scores).map((key) => {
        return (
          <div key={key}>
            <p>
              {key}: {scores[key]}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ComputeScores;
