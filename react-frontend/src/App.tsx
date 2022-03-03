import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ScatterPlot from './components/ScatterPlot/ScatterPlot';
import { DataArray } from './types/DataArray';
import queryBackend from './backend/BackendQueryEngine';
import Visualization from './Visualization';

function App() {
  const [exampleData, setExampleData] = useState<DataArray>();

  useEffect(() => {
    queryBackend(`upload-data?name=moons`, `moons`).then((exampleData) => {
      setExampleData(exampleData);
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header"> Clustering
        {exampleData && <Visualization width={1000} height={500} data={exampleData} />}
      </header>
    </div>
  )
}

export default App;
