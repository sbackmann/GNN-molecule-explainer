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

  useEffect(() => {
    dataChoice &&
      postPoints(dataChoice).then((exampleData) => {
        setExampleData(exampleData);
        setSelected(exampleData![parseInt(dataChoice, 10)]);
      });
  }, [dataChoice]);

  function choiceMade(choice: string) {
    setDataChoice(choice);
  }

  return (
    <div className="App">
      <header className="App-header"> Molecule visualisation </header>
      <DataChoiceComponent onChoiceMade={choiceMade} />
      
    </div>
  );
}
// {this.props.selected ? selected!.edge_attr}
// <ScatterPlot width={1100} height={550} data={exampleData} graphid={dataChoice}/>
export default App;
