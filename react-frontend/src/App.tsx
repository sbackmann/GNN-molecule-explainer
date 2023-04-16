import { useEffect, useState } from "react";
// import {
//   Badge,
//   Button,
//   Card,
//   Navbar,
//   Nav,
//   Table,
//   Container,
//   Row,
//   Col,
//   Form,
//   OverlayTrigger,
//   Tooltip,
// } from "react-bootstrap";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
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
    <>
    <div className="App">
      <header className="App-header"> GNN Explainer </header>      
      
      <DataChoiceComponent onChoiceMade={choiceMade} />
      <p>The selected molecule is toxic:</p>      
      
      {selected ? selected.y : null}
    </div>    
    </>  
  );
}

function Dashboard(){
  return(
    <>
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>Choose a molecule</Card.Title>
        <Card.Text>
          Here will be the graph to show whether the current molecule is toxic.
        </Card.Text>
        <Button variant="primary">Select</Button>
      </Card.Body>
    </Card>
    {/* <p>Hello World</p> */}
    {/* <Container>
      <Row>
        <Col>1 of 1</Col>
      </Row>
    </Container> */}
    {/* <Container fluid>
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
      </Container> */}
      </>
  )
}
// <ScatterPlot width={1100} height={550} data={exampleData} graphid={dataChoice}/>
export default Dashboard;
