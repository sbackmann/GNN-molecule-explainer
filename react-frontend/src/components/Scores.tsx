import React, { useState } from "react";
import { DataArray, DataPoint } from "../types/data";
import { AxiosResponse } from 'axios';
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
  const [scores, setScores] = useState([]);
  let mol: any[] | object = {};
  if (mutagData) {
    mol = mutagData[Number(selectedId)];
  }

  const handleSubmit = async () => {
    const res = {
      edge_mask: explanations,
      data: mol,
      focus: checkboxState.focus,
      mask_nature: checkboxState.mask_nature,
    }; // replace with your const object
    //const response = await fetch("http://127.0.0.1:8000/evaluate", {
    //  method: "POST",
    //  headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify(res),
    //});
    //const scores = await response.json();
    let myScore : any = [];
    axiosClient.post('/evaluate', res)
    .then((response: AxiosResponse) => {
      // Handle the response from the server
      myScore = response.data
      console.log(response.data.result);
      // ...
    })
    .catch((error: Error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
    setScores(myScore);
  };

  return (
    <div>
      <button onClick={handleSubmit}>Compute Scores</button>
      {scores.map((score, i) => (
        <div key={i}>{score}</div>
      ))}
    </div>
  );
};

export default ComputeScores;
