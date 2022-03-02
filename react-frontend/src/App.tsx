import React from 'react';
import logo from './logo.svg';
import './App.css';
import ScatterPlot from './components/ScatterPlot/ScatterPlot';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ScatterPlot width={800} height={400} top={10} right={50} bottom={50} left={50} />
      </header>
    </div>
  )
}

export default App;
