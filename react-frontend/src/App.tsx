import React, { useEffect, useState } from 'react';
import './App.css';
import { DataArray } from './types/dataArray';
import queryBackend from './router/BackendQueryEngine';
import Visualization from './components/Visualization';
import DataChoiceComponent from './components/DataChoiceComponent';
import ScatterPlot from './components/ScatterPlot/ScatterPlot';

function App() {

  const [exampleData, setExampleData] = useState<DataArray>();
  const [dataChoice, setDataChoice] = useState<string>();

  useEffect(() => {
    queryBackend(`get-data?name=` + dataChoice).then((exampleData) => {
      setExampleData(exampleData);
    });
  }, [dataChoice]);

  function choiceMade(choice: string) {
    setDataChoice(choice);
  }

  console.log(exampleData)
  console.log(dataChoice)

  return (
    <div className="App">
      <header className="App-header"> K-Means clustering
      </header>
      <DataChoiceComponent onChoiceMade={choiceMade} />
      <ScatterPlot width={1100} height={550} data={exampleData} />
    </div>
  )
}

export default App;
