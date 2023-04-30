import { useState, useEffect } from "react";
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
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataArray, DataPoint } from "./types/data";

import DataChoiceComponent from "./components/DataChoice";
// import ScatterPlot from "./components/ScatterPlot";
import {
  postPoints,
  postEmbeddings,
  postExplanations,
} from "./router/resources/data";
import { Form, ListGroup } from "react-bootstrap";
import Slider from "./components/Slider";

import React from "react";
import "reactjs-popup/dist/index.css";
import ModalPopup from "./components/ModalPopup";
import "./components/ModalPopup.css";
import Graph from "./components/Graph";
import { Network, Node, Edge } from "vis-network";

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
  const [sizeValue, setSizeValue] = useState(50);
  const [entropyValue, setEntropyValue] = useState(50);
  const [maxValue, setMaxValue] = useState(50);
  const [explanations, setExplanations] = useState<number[]>();
  const [level, setLevel] = useState("10");

  const [selectedId, setSelectedId] = useState("0");

  const handleSelectedIdChange = (newSelectedId: any) => {
    setSelectedId(newSelectedId);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLevel(e.target.value);
  };

  type Explainer =
    | "ig"
    | "gnnexplainer"
    | "sa"
    | "basic_gnnexplainer"
    | "gradcam"
    | "occlusion"
    | "pgmexplainer";
  type Focus = "phenomenon" | "model";
  type MaskNature = "hard" | "soft";
  type MaskTransformation = "topk" | "threshold" | "sparsity";
  type CheckboxState = {
    explainer: Explainer;
    focus: Focus;
    mask_nature: MaskNature;
    mask_transformation: MaskTransformation;
  };

  const initialCheckboxState: CheckboxState = {
    explainer: "ig",
    focus: "phenomenon",
    mask_nature: "hard",
    mask_transformation: "topk",
  };

  const [checkboxState, setCheckboxState] =
    useState<CheckboxState>(initialCheckboxState);
  // const [selectedFocus, setSelectedFocus] = useState<Focus>("phenomenon");

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checkboxName: keyof CheckboxState
  ) => {
    const value = event.target.value;
    setCheckboxState({
      ...checkboxState,
      [checkboxName]: value,
    });
  };

  useEffect(() => {
    postExplanations(
      String(checkboxState.explainer),
      String(checkboxState.focus),
      selectedId,
      String(checkboxState.mask_nature),
      String(checkboxState.mask_transformation),
      level
    ).then((explanations) => {
      setExplanations(explanations);
    });
  }, [checkboxState, level, selectedId]);
  const [Data, setData] = useState<DataArray>();
  useEffect(() => {
    postPoints().then((Data) => {
      setData(Data);
    });
  }, []);
  const nodes = [];
  const edges = [];

  if (Data) {
    const idx = Number(selectedId);
    console.log(selectedId);
    const calc_idx = Data![idx].idx;
    const edge_index_from = Data![idx].edge_index[0];
    const edge_index_to = Data![idx].edge_index[1];
    const nodes_list = Data![idx].x;

    const node_label_idx = nodes_list.map((row) =>
      row.indexOf(Math.max(...row))
    );
    const atom_names = ["C", "N", "O", "F", "I", "Cl", "Br"];
    const color_map = [
      "gray",
      "darkgreen",
      "orange",
      "blue",
      "purple",
      "yellow",
      "darkred",
    ];

    for (let i = 0; i < nodes_list.length; i++) {
      const label = String(atom_names[node_label_idx[i]]);
      const node: Node = {
        id: i,
        label: label,
        color: color_map[node_label_idx[i]],
      };
      nodes.push(node);
    }
    for (let i = 0; i < explanations!.length; i++) {
      console.log(String(i));
      const edge: Edge = {
        from: edge_index_from[i],
        to: edge_index_to[i],
        label: explanations![i].toFixed(2).toString(), // Add label based on edge weight
        color: {
          color: "black",
          highlight: "red",
          opacity: Number(explanations![i]) * 10,
        }, // Add color based on edge weight
      };
      edges.push(edge);
    }
  } else {
    const nodes = [
      { id: 1, label: "Node 1" },
      { id: 2, label: "Node 2" },
      { id: 3, label: "Node 3" },
    ];

    const edges = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
    ];
    const edgeWeights = [0.7, 0.4, 0.2, 0.9];
  }

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
                  onSelectedIdChange={handleSelectedIdChange}
                  data={Data}
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
              </Card.Body>
              <Card.Footer className="d-flex">
                <Form.Group className="mr-3">
                  <Form.Label
                    style={{ marginRight: "10px", minWidth: "150px" }}
                  >
                    Focus
                  </Form.Label>
                  <div>
                    <Form.Check
                      type="checkbox"
                      value="phenomenon"
                      label="Phenomenon"
                      checked={checkboxState.focus === "phenomenon"}
                      onChange={(event) => handleCheckboxChange(event, "focus")}
                    />
                    <Form.Check
                      type="checkbox"
                      value="model"
                      label="Model"
                      checked={checkboxState.focus === "model"}
                      onChange={(event) => handleCheckboxChange(event, "focus")}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mr-8">
                  <Form.Label
                    style={{ marginRight: "10px", minWidth: "150px" }}
                  >
                    Mask Nature
                  </Form.Label>
                  &nbsp;
                  <div>
                    <Form.Check
                      type="checkbox"
                      value="hard"
                      label="Hard"
                      checked={checkboxState.mask_nature === "hard"}
                      onChange={(event) =>
                        handleCheckboxChange(event, "mask_nature")
                      }
                    />
                    <Form.Check
                      type="checkbox"
                      value="soft"
                      label="Soft"
                      checked={checkboxState.mask_nature === "soft"}
                      onChange={(event) =>
                        handleCheckboxChange(event, "mask_nature")
                      }
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mr-8">
                  <Form.Label
                    style={{ marginRight: "10px", minWidth: "150px" }}
                  >
                    Mask Transformation
                  </Form.Label>
                  <div className="d-flex">
                    <div style={{ marginRight: "10px", minWidth: "100px" }}>
                      <Form.Check
                        type="checkbox"
                        value="topk"
                        label="Top k"
                        checked={checkboxState.mask_transformation === "topk"}
                        onChange={(event) =>
                          handleCheckboxChange(event, "mask_transformation")
                        }
                      />
                    </div>
                    <div>
                      <Form.Control
                        placeholder="10"
                        type="text"
                        value={level}
                        onChange={handleLevelChange}
                        className="ml-2"
                      />
                    </div>
                  </div>
                  <div className="d-flex">
                    <div style={{ marginRight: "10px", minWidth: "100px" }}>
                      <Form.Check
                        type="checkbox"
                        value="threshold"
                        label="Threshold"
                        checked={
                          checkboxState.mask_transformation === "threshold"
                        }
                        onChange={(event) =>
                          handleCheckboxChange(event, "mask_transformation")
                        }
                      />
                    </div>
                    <div className="d-flex align-items-center ml-3">
                      <Form.Check
                        type="checkbox"
                        value="sparsity"
                        label="Sparsity"
                        checked={
                          checkboxState.mask_transformation === "sparsity"
                        }
                        onChange={(event) =>
                          handleCheckboxChange(event, "mask_transformation")
                        }
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
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ marginRight: "10px", minWidth: "80px" }}>
                        Size:
                      </span>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={sizeValue}
                        onChange={handleSizeChange}
                      />
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ marginRight: "10px", minWidth: "80px" }}>
                        Entropy:
                      </span>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={entropyValue}
                        onChange={handleEntropyChange}
                      />
                    </div>
                  </ListGroupItem>
                  <ListGroupItem>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ marginRight: "10px", minWidth: "80px" }}>
                        Max Value:
                      </span>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={maxValue}
                        onChange={handleMaxChange}
                      />
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </Card.Body>
              <Card.Footer></Card.Footer>
            </Card>
          </Col>
        </Row>
        <p></p>
        <Row>
          <Col md="3" mh-100>
            <Card>
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
                        value="ig"
                        label="Integrated Grad"
                        checked={checkboxState.explainer === "ig"}
                        onChange={(event) =>
                          handleCheckboxChange(event, "explainer")
                        }
                      />
                    </li>
                    <li>
                      <Form.Check
                        type="checkbox"
                        value="gnnexplainer"
                        label="GNNExplainer"
                        checked={checkboxState.explainer === "gnnexplainer"}
                        onChange={(event) =>
                          handleCheckboxChange(event, "explainer")
                        }
                      />
                    </li>
                    <li>
                      <Form.Check
                        type="checkbox"
                        value="sa"
                        label="Saliency"
                        checked={checkboxState.explainer === "sa"}
                        onChange={(event) =>
                          handleCheckboxChange(event, "explainer")
                        }
                      />
                    </li>
                  </ol>
                </div>
              </Card.Body>
            </Card>
            <p></p>
            <Card>
              <Card.Header>
                <Card.Title as="h4">Explainer performance</Card.Title>
                <p className="card-category">Figure</p>
              </Card.Header>
              <Card.Body></Card.Body>
            </Card>
          </Col>
          <Col md="6">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Graph Explanation</Card.Title>
                <p className="card-category">Graph</p>
              </Card.Header>
              <Card.Body>
                <Graph
                  nodes={nodes}
                  edges={edges}
                  edgeWeights={explanations!}
                />
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
                <p>Molecule id: {selectedId}</p>
                <p>!</p>
                <p>!</p>
                <p>!</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default Dashboard;
