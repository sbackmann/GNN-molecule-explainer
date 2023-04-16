import { useEffect, useState } from "react";
import "./App.css";
import { DataArray, DataPoint } from "./types/data";
import DataChoiceComponent from "./components/DataChoice";
// import ScatterPlot from "./components/ScatterPlot";
import { postPoints } from "./router/resources/data";

function App() {
  const [exampleData, setExampleData] = useState<DataArray>();
  const [dataChoice, setDataChoice] = useState<string>();
  const [selected, setSelected] = useState<DataPoint>();
  const initialDataChoice = "1";

  useEffect(() => {
    initialDataChoice &&
    postPoints(initialDataChoice).then((exampleData) => {
      setExampleData(exampleData);
    });
  }, [initialDataChoice]);

  useEffect(() => {
    dataChoice && 
    setSelected(exampleData![parseInt(dataChoice, 10)]);
  }, [dataChoice]);

  function choiceMade(choice: string) {
    setDataChoice(choice);
  }

  return (
    <div className="App">
      <header className="App-header"> GNN Explainer </header>
      <div className="home-container1">
        <button className="home-button button">Load Dataset</button>
        <span className="home-text">
          <span>GNN Explainer</span>
          <br></br>
        </span>
      </div>
      <DataChoiceComponent onChoiceMade={choiceMade} />
      <p>The selected molecule is toxic:</p>
      {selected ? selected.y : null}
    </div>
  );
}
// <ScatterPlot width={1100} height={550} data={exampleData} graphid={dataChoice}/>
export default App;
