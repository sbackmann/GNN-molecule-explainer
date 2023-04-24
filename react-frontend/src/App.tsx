import { useState } from "react";
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
import PlaceholderButton from "react-bootstrap/esm/PlaceholderButton";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataArray, DataPoint } from "./types/data";

import DataChoiceComponent from "./components/DataChoice";
// import ScatterPlot from "./components/ScatterPlot";
import { postPoints, postEmbeddings } from "./router/resources/data";
import { Form, ListGroup } from "react-bootstrap";
import Slider from './components/Slider';

import React from "react";
import "reactjs-popup/dist/index.css";
import ModalPopup from "./components/ModalPopup";
import "./components/ModalPopup.css";
/*
function App() {
  const [exampleData, setExampleData] = useState<DataArray>();
  const [dataChoice, setDataChoice] = useState<string>();
  const [selected, setSelected] = useState<DataPoint>();
  const [embeddingData, setEmbeddingData] = useState<EmbeddingArray>();
  const initialDataChoice = "1";

  const [modalIsOpen, setModalIsOpen] = useState(true);
  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    initialDataChoice &&
      postPoints().then((exampleData) => {
        setExampleData(exampleData);
      });
  }, [initialDataChoice]);

  useEffect(() => {
    postEmbeddings().then((embeddingData) => {
      setEmbeddingData(embeddingData);
    });
  }, []);

  useEffect(() => {
    dataChoice && setSelected(exampleData![parseInt(dataChoice, 10)]);
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
        <ScatterPlot
          width={1100}
          height={550}
          data={embeddingData}
          mol_data={exampleData}
          closeModal={closeModal}
        />
      </div>
    </>
  );
}*/

function Dashboard() {
  /*
  const [embeddingData, setEmbeddingData] = useState<EmbeddingArray>();
  const [Data, setData] = useState<DataArray>();

  useEffect(() => {
    postEmbeddings().then((embeddingData) => {
      setEmbeddingData(embeddingData);
    });
  }, []);

  useEffect(() => {
    postPoints().then((Data) => {
      setData(Data);
    });
  }, []);
  */
  
  const [sizeValue, setSizeValue] = useState(50);
  const [entropyValue, setEntropyValue] = useState(50);
  const [maxValue, setMaxValue] = useState(50);

  const handleSizeChange = (newValue: number) => {
    setSizeValue(newValue);
  };

  const handleEntropyChange = (newValue: number) => {
    setSizeValue(newValue);
  };

  const handleMaxChange = (newValue: number) => {
    setSizeValue(newValue);
  };

  return (
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
    <Container fluid>
        <Row lg="3">
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Card.Title>Choose a molecule</Card.Title>
                <Card.Text>
                  Here will be the graph to show whether the current molecule is
                  toxic.
                </Card.Text>
                <ModalPopup
                  triggerButton={<Button variant="primary">Select</Button>}
                  modalTitle="Embedded Molecules"
                />
              </Card.Body>
              
            </Card>
          </Col>
          <Col lg="6" sm="6">
            <Card className="card-stats" h-100>
              <Card.Body>
              <Card.Title>Customize your need</Card.Title>
        <Card.Text>
          Here will be several option for user to select their need.  
         
        </Card.Text>
        {/* <Form>
        <Form.Check
          type="checkbox"
          label="Check me out"
        />
        </Form> */}
              </Card.Body>
              <Card.Footer className="d-flex">
    <Form.Group className="mr-3">
      <Form.Label style={{ marginRight: "10px", minWidth: "150px" }}>Focus</Form.Label>
      <div>
        <Form.Check
          type="checkbox"
          label="Phenomenon"
          defaultChecked={true}
          name="group1"
        />
        <Form.Check
          type="checkbox"
          label="Model"
          name="group1"
        />
      </div>
    </Form.Group>
    <Form.Group className="mr-8">
      <Form.Label style={{ marginRight: "10px", minWidth: "150px" }}>Mask Nature</Form.Label>&nbsp;
      <div>
        <Form.Check
          type="checkbox"
          label="Hard"
          defaultChecked={true}
          name="group2"
        />
        <Form.Check
          type="checkbox"
          label="Soft"
          name="group2"
        />
      </div>
    </Form.Group>
    <Form.Group className="mr-8">
      <Form.Label style={{ marginRight: "10px", minWidth: "150px" }}>Mask Transformation</Form.Label>
      <div className="d-flex">
        <div style={{ marginRight: "10px", minWidth: "100px" }}><Form.Check
            type="checkbox"
            label="Top k"
            defaultChecked={true}
            name="group3"
          />
          </div>
          <div><Form.Control placeholder="Enter text here" className="ml-2" /></div>
          </div>
          <div className="d-flex">
        <div style={{ marginRight: "10px", minWidth: "100px" }}>
          <Form.Check
            type="checkbox"
            label="Threshold"
            name="group3"
          />
        </div>
        <div className="d-flex align-items-center ml-3">
          <Form.Check
            type="checkbox"
            label="Sparsity"
            name="group3"           
          />
          
        </div>
      </div>
    </Form.Group>
  </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats" h-100>
              <Card.Body>
              <Card.Title>Mask Property</Card.Title>
        
        <ListGroup>
          <ListGroupItem>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: "10px", minWidth: "80px" }}>Size:</span>
                <Slider min={0} max={100} step={1} value={sizeValue} onChange={handleSizeChange} />
            </div></ListGroupItem>
          <ListGroupItem>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: "10px", minWidth: "80px" }}>Entropy:</span>
                <Slider min={0} max={100} step={1} value={entropyValue} onChange={handleEntropyChange} />
            </div></ListGroupItem>
          <ListGroupItem>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: "10px", minWidth: "80px" }}>Max Value:</span>
                <Slider min={0} max={100} step={1} value={maxValue} onChange={handleMaxChange} />
            </div></ListGroupItem>
        </ListGroup>
        
              </Card.Body>
              <Card.Footer></Card.Footer>
            </Card>
          </Col>
        </Row>
        <p></p>
        <Row>
        <Col md="3" mh-100>
            <Card >
              <Card.Header>
                <Card.Title as="h4">Rank of Explainer</Card.Title>
                <p className="card-category">Rank</p>
              </Card.Header>
              <Card.Body>
                <div>
                  <ol>
                    <li>
                      <Form.Check
                      type="checkbox"
                      label="Integrated Grad"
                      defaultChecked={true}
                      />
                    </li>
                    <li>
                      <Form.Check
                      type="checkbox"
                      label="GNNExplainer"
                      defaultChecked={false}
                      />
                    </li>
                    <li>
                      <Form.Check
                      type="checkbox"
                      label="Saliency"
                      defaultChecked={false}
                      />
                    </li>
                  </ol>
                </div>  
              </Card.Body>
            </Card>
            <p>            
            </p>
            <Card>
              <Card.Header>
                <Card.Title as="h4">Explainer performance</Card.Title>
                <p className="card-category">Figure</p>
              </Card.Header>
              <Card.Body>
                
              </Card.Body>
            </Card>
          </Col>          
          <Col md="6">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Graph Explaination</Card.Title>
                <p className="card-category">Graph</p>
              </Card.Header>
              <Card.Body>
                <p>!</p>
                <p>!</p>
                <p>!</p>
                <p>!</p>
              </Card.Body>
              </Card>
              
          </Col>
          <Col md="3">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Explainer performance</Card.Title>
                <p className="card-category">Figure</p>
              </Card.Header>
              <Card.Body>
              <p>!</p>
                <p>!</p>
                <p>!</p>
                <p>!</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* <Row>
        <Col md="3">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Explainer performance</Card.Title>
                <p className="card-category">Figure</p>
              </Card.Header>
              <Card.Body></Card.Body>
            </Card>
          </Col>
        </Row> */}
        </Container>
      </>
  )
}
export default Dashboard;
