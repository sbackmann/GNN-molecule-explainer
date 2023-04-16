import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
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
      
      <DataChoiceComponent onChoiceMade={choiceMade} />
      <p>The selected molecule is toxic:</p>      
      
      {selected ? selected.y : null}
    </div>
  );
}

function Dashboard(){
  return(
    <Container>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Title</Card.Title>
                <Card.Text>Text</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
  )
}
// <ScatterPlot width={1100} height={550} data={exampleData} graphid={dataChoice}/>
export default App;
