import React, { useEffect, useState } from 'react';
import './App.css';
import { DataArray } from './types/DataArray';
import queryBackend from './backend/BackendQueryEngine';
import Visualization from './Visualization';
import ScatterPlot from "./components/ScatterPlot/ScatterPlot";

function App() {
  const [exampleData, setExampleData] = useState<DataArray>();

  useEffect(() => {
    queryBackend(`upload-data?name=circles`).then((exampleData) => {
      setExampleData(exampleData);
    });
  }, []);
  console.log('we are in the app script')
  console.log(exampleData);
  return (
    <div className="App">
      <header className="App-header"> K-Means clustering
      </header>
      <div>{exampleData && <Visualization width={1100} height={550} data={exampleData} />}</div>
    </div>
  )
}

export default App;
