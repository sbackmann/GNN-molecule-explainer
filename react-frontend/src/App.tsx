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
import { DataArray, DataPoint, EmbeddingArray, EmbeddingPoint } from "./types/data";
import DataChoiceComponent from "./components/DataChoice";
import ScatterPlot from "./components/ScatterPlot";
import { postPoints, postEmbeddings } from "./router/resources/data";
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function App() {
  const [exampleData, setExampleData] = useState<DataArray>();
  const [dataChoice, setDataChoice] = useState<string>();
  const [selected, setSelected] = useState<DataPoint>();
  const [embeddingData, setEmbeddingData] = useState<EmbeddingArray>();
  const initialDataChoice = "1";

  useEffect(() => {
    initialDataChoice &&
    postPoints(initialDataChoice).then((exampleData) => {
      setExampleData(exampleData);
    });
  }, [initialDataChoice]);

  useEffect(() => {
    postEmbeddings().then((embeddingData) => {
      setEmbeddingData(embeddingData);
    });
  }, []);

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
      <ScatterPlot width={1100} height={550} data={embeddingData} />
    </div>    
    </>  
  );
}

function Dashboard(){
  const [embeddingData, setEmbeddingData] = useState<EmbeddingArray>();

  useEffect(() => {
    postEmbeddings().then((embeddingData) => {
      setEmbeddingData(embeddingData);
    });
  }, []);

  return(
    <>
    {/* <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>Choose a molecule</Card.Title>
        <Card.Text>
          Here will be the graph to show whether the current molecule is toxic.
        </Card.Text>
        <Button variant="primary">Select</Button>
      </Card.Body>
    </Card> */}
    {/* <p>Hello World</p> */}
    {/* <Container>
      <Row>
        <Col>1 of 1</Col>
      </Row>
    </Container> */}
    <Container fluid>
        <Row>
          <Col md="5">
            <Card className="card-category">
              <Card.Body>
              <Card.Title>Choose a molecule</Card.Title>
        <Card.Text>
          Here will be the graph to show whether the current molecule is toxic.
        </Card.Text>
        <ScatterPlot width={500} height={250} data={embeddingData} />
        <Popup trigger={<Button variant="primary"> Select</Button>} position="right center">
          <div>Popup content here !!</div>
        </Popup>
              </Card.Body>
              <Card.Footer>
                
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
              <Card.Title>Customize your need</Card.Title>
        <Card.Text>
          Here will be several option for user to select their need.
        </Card.Text>
        <Button variant="primary">Select</Button>
              </Card.Body>
              <Card.Footer>
                
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
              <Card.Title>Mask Property</Card.Title>
        <Card.Text>
          Size; Entropy; Max value.
        </Card.Text>
        
              </Card.Body>
              <Card.Footer>
                
              </Card.Footer>
            </Card>
          </Col>
          
          
        </Row>
        <Row>
        <Col md="2">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Rank of Explainer</Card.Title>
                <p className="card-category">Rank</p>
              </Card.Header>
              <Card.Body>
                
              </Card.Body>
              <Card.Footer>
                
              </Card.Footer>
            </Card>
          </Col>
          <Col md="6">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Graph Explaination</Card.Title>
                <p className="card-category">Graph</p>
              </Card.Header>
              <Card.Body>
                
              </Card.Body>
              <Card.Footer>
                
              </Card.Footer>
            </Card>
          </Col>
          <Col md="2">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Explainer performance</Card.Title>
                <p className="card-category">Figure</p>
              </Card.Header>
              <Card.Body>
                
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </Container>
      </>
  )
}
// <ScatterPlot width={1100} height={550} data={embeddingData} graphid={dataChoice}/>
export default Dashboard;
