import { useState, useEffect } from "react";
import {
  Nav,
  NavDropdown,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataArray } from "./types/data";

import { postPoints, postExplanations } from "./router/resources/data";
import { Form, ListGroup } from "react-bootstrap";

import React from "react";
import "reactjs-popup/dist/index.css";
import ModalPopup from "./components/ModalPopup";
import "./components/ModalPopup.css";
import Graph from "./components/Graph";
import ComputeScores from "./components/Scores";
import ComputeProperties from "./components/MaskProperties";
import MoleculeInfo from "./components/MoleculeInfo";
import { EmbeddingArray } from "./types/data";
import { postEmbeddings } from "./router/resources/data";

function App() {
  const [mutagData, setMutagData] = useState<DataArray>();
  useEffect(() => {
    postPoints().then((mutagData) => {
      setMutagData(mutagData);
    });
  }, []);

  const [embeddingData, setEmbeddingData] = useState<EmbeddingArray>();
  useEffect(() => {
    postEmbeddings().then((embeddingData) => {
      setEmbeddingData(embeddingData);
    });
  }, []);

  const [explanations, setExplanations] = useState<number[]>();
  const [explanationsUpdated, setUpdatedExplanations] = useState<number[]>();
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
    | "basicgnnexplainer"
    | "gradcam"
    | "occlusion"
    | "pgmexplainer"
    | "subgraphx";
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

  const handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    selectName: keyof CheckboxState
  ) => {
    const value = event.target.value;
    setCheckboxState({
      ...checkboxState,
      [selectName]: value,
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

  useEffect(() => {
    if (explanations) setUpdatedExplanations(explanations.slice());
  }, [explanations]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-stats">
              <Card.Body style={{paddingTop:"5px", paddingBottom:"5px"}}>
                <Card.Text>
                  This interface is meant to help you naviguate through the
                  current explainability methods for graph neural networs. Select
                  a molecule from the MUTAG dataset and try out different
                  explanations. Found out the atoms and bonds that explain that
                  the molecule is toxic or non-toxic. Compare existing
                  explainability methods. Understand why the GNN model makes
                  wrong predictions.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row lg="3">
          <Col lg="4" sm="6">
            <Card className="card-stats">
            <Card.Header>
                <Card.Title as="h5">Choose a molecule</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  Here will be the graph to show whether the current molecule is
                  toxic.
                </Card.Text>
                <ModalPopup
                  modalTitle="Embedded Molecules"
                  onSelectedIdChange={handleSelectedIdChange}
                  data={mutagData}
                />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Selected molecule ID: {selectedId}
              </Card.Body>
            </Card>
            <Card className="card-stats" style={{ paddingBottom: 0, marginBottom: 0 }}>
              <Card.Header>
                <Card.Title as="h5">Customize explanations</Card.Title>
              </Card.Header>
              <Card.Body style={{ paddingBottom: 0, marginBottom: 0 }}>
                <Card.Text>
                  Select your requirements for the generated explanations.
                  <p style={{ fontSize: "0.75rem", color: "grey" }}>
                    To learn more about the criteria, hover your mouse over the words.
                  </p>
                </Card.Text>

                <div className="row">
                  <div className="col-md-3">
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ marginRight: "0px", minWidth: "110px" }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Focus of explanation"
                      >
                        Focus
                      </Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          value="phenomenon"
                          label="Phenomenon"
                          checked={checkboxState.focus === "phenomenon"}
                          onChange={(event) => handleCheckboxChange(event, "focus")}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Explain the real-world problem, reveal findings in the data, i.e. explain the true labeling of the nodes."
                        />

                        <Form.Check
                          type="radio"
                          value="model"
                          label="Model"
                          checked={checkboxState.focus === "model"}
                          onChange={(event) => handleCheckboxChange(event, "focus")}
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          title="Explain how the model works - explain the logic behind the model, i.e. the predicted labels."
                        />
                      </div>
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ marginRight: "0px", minWidth: "100px" }}
                      >
                        Mask Nature
                      </Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          value="hard"
                          label="Hard"
                          checked={checkboxState.mask_nature === "hard"}
                          onChange={(event) =>
                            handleCheckboxChange(event, "mask_nature")
                          }
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          title="Positive values in the explanatory mask are set to 1; we do not distinguish edges that have a positive contribution."
                        />
                        <Form.Check
                          type="radio"
                          value="soft"
                          label="Soft"
                          checked={checkboxState.mask_nature === "soft"}
                          onChange={(event) =>
                            handleCheckboxChange(event, "mask_nature")
                          }
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          title="The explanation is a weighted subgraph; edges have a contribution defined as a weight between 0 and 1."
                        />
                      </div>
                    </Form.Group>
                  </div>

                  <div className="col-md-5">
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ marginRight: "10px", minWidth: "150px" }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Select edges that contribute the most to the final molecule label, i.e. with the highest weights in the edge mask."
                      >
                        Mask Transformation
                      </Form.Label>
                      <div className="d-flex">
                        <div style={{ marginRight: "10px", minWidth: "100px" }}>
                          <Form.Check
                            type="radio"
                            value="topk"
                            label="Top k"
                            checked={checkboxState.mask_transformation === "topk"}
                            onChange={(event) =>
                              handleCheckboxChange(event, "mask_transformation")
                            }
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Select the top k edges in the mask."
                          />
                        </div>
                        <div>
                          <Form.Control
                            placeholder="10"
                            type="text"
                            value={level}
                            onChange={handleLevelChange}
                            className="ml-2 custom-textbox"
                          />
                        </div>
                      </div>
                      <div className="d-flex">
                        <div style={{ marginRight: "10px", minWidth: "100px" }}>
                          <Form.Check
                            type="radio"
                            value="threshold"
                            label="Threshold"
                            checked={
                              checkboxState.mask_transformation === "threshold"
                            }
                            onChange={(event) =>
                              handleCheckboxChange(event, "mask_transformation")
                            }
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Select the edges which weight is above the threshold."
                          />
                        </div>
                        <div className="d-flex align-items-center ml-3">
                          <Form.Check
                            type="radio"
                            value="sparsity"
                            label="Sparsity"
                            checked={
                              checkboxState.mask_transformation === "sparsity"
                            }
                            onChange={(event) =>
                              handleCheckboxChange(event, "mask_transformation")
                            }
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Select the (100-X)% edges with highest weights."
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Choose Explainer</Card.Title>
              </Card.Header>
              <Card.Body style={{marginRight:0, marginBottom:0, paddingRight:5, paddingBottom:5}}>
                <div className="row">
                  <div className="col-md-4">
                    <Form.Check
                      type="radio"
                      value="ig"
                      label="Integrated Grad"
                      checked={checkboxState.explainer === "ig"}
                      onChange={(event) =>
                        handleCheckboxChange(event, "explainer")
                      }
                    />
                    <Form.Check
                      type="radio"
                      value="gnnexplainer"
                      label="GNNExplainer"
                      checked={checkboxState.explainer === "gnnexplainer"}
                      onChange={(event) =>
                        handleCheckboxChange(event, "explainer")
                      }
                    />
                    <Form.Check
                      type="radio"
                      value="sa"
                      label="Saliency"
                      checked={checkboxState.explainer === "sa"}
                      onChange={(event) =>
                        handleCheckboxChange(event, "explainer")
                      }
                    />
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(event) => handleSelectChange(event, "explainer")}
                      className="custom-select"
                    >
                      <option>Choose option</option>
                      <option value="ig">Integrated Gradient</option>
                      <option value="gnnexplainer">GNNExplainer</option>
                      <option value="sa">Saliency</option>
                      <option value="basicgnnexplainer">
                        Basic GNNExplainer
                      </option>
                      <option value="gradcam">Grad-CAM</option>
                      <option value="occlusion">Occlusion</option>
                      <option value="pgmexplainer">PGM-Explainer</option>
                    </Form.Select>
                  </div>
                  <div className="col-md-8">
                    {checkboxState.explainer === "ig" && (
                      <>
                        <p>
                          Integrated Gradient (IG) avoids the saturation problem of
                          the gradient-based method Saliency by accumulating gradients
                          over the path from a baseline input (zero-vector) and the
                          input at hand.
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "grey" }}>
                          Sundararajan, Mukund, Ankur Taly, and Qiqi Yan. "Axiomatic
                          attribution for deep networks." International conference on
                          machine learning. PMLR, 2017.
                        </p>
                      </>
                    )}
                    {checkboxState.explainer === "gnnexplainer" && (
                      <>
                        <p>
                          GNNExplainer computes the importance of graph entities
                          (node/edge/node feature) using the mutual information.
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "grey" }}>
                          Ying, Zhitao, et al. "Gnnexplainer: Generating explanations
                          for graph neural networks." Advances in neural information
                          processing systems 32 (2019).
                        </p>
                      </>
                    )}
                    {checkboxState.explainer === "sa" && (
                      <>
                        <p>
                          Saliency (SA) measures node importance as the weight on
                          every node after computing the gradient of the output with
                          respect to node features.
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "grey" }}>
                          Baldassarre, Federico, and Hossein Azizpour. "Explainability
                          techniques for graph convolutional networks." arXiv preprint
                          arXiv:1905.13686 (2019).
                        </p>{" "}
                      </>
                    )}
                    {checkboxState.explainer === "basicgnnexplainer" && (
                      <>
                        <p>
                          Basic GNNExplainer is a simple version of GNNExplainer that
                          only considers edge importance.
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "grey" }}>
                          Ying, Zhitao, et al. "Gnnexplainer: Generating explanations
                          for graph neural networks." Advances in neural information
                          processing systems 32 (2019).
                        </p>
                      </>
                    )}
                    {checkboxState.explainer === "gradcam" && (
                      <>
                        <p>
                          Grad-CAM is a generalization of class activation maps (CAM).
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "grey" }}>
                          Selvaraju, Ramprasaath R., et al. "Grad-cam: Visual
                          explanations from deep networks via gradient-based
                          localization." Proceedings of the IEEE international
                          conference on computer vision. 2017.
                        </p>
                      </>
                    )}
                    {checkboxState.explainer === "occlusion" && (
                      <>
                        <p>
                          Occlusion attributes the importance of an edge as the
                          difference of the model initial prediction on the graph
                          after removing this edge.
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "grey" }}>
                          Faber, Lukas, Amin K. Moghaddam, and Roger Wattenhofer.
                          "When comparing to ground truth is wrong: On evaluating gnn
                          explanation methods." Proceedings of the 27th ACM SIGKDD
                          Conference on Knowledge Discovery & Data Mining. 2021.
                        </p>{" "}
                      </>
                    )}
                    {checkboxState.explainer === "pgmexplainer" && (
                      <>
                        <p>
                          PGM-Explainer perturbs the input and uses probabilistic
                          graphical models to find the dependencies between the nodes
                          and the output.
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "grey" }}>
                          Vu, Minh, and My T. Thai. "Pgm-explainer: Probabilistic
                          graphical model explanations for graph neural networks."
                          Advances in neural information processing systems 33 (2020):
                          12225-12235.
                        </p>{" "}
                      </>
                    )}
                    {checkboxState.explainer === "subgraphx" && (
                      <>
                        <p>
                          SubgraphX explores possible explanatory sub-graphs with
                          Monte Carlo Tree Search and assigns them a score using the
                          Shapley value.
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "grey" }}>
                          Yuan, Hao, et al. "On explainability of graph neural
                          networks via subgraph explorations." International
                          Conference on Machine Learning. PMLR, 2021.
                        </p>{" "}
                        </>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="5" md="5">
            <Card>
              <Card.Header>
                <Card.Title as="h5">Graph Explanation</Card.Title>
              </Card.Header>
              <Card.Body>
              <p className="card-category">
                  The explanation is a mask on the bonds of the molecules. The
                  importance of each edge is indicated as a scalar between 0 and
                  1.
                </p>
                <p style={{ fontSize: "0.75rem", color: "grey" }}>
                  Click on an edge to change its weight and modify the
                  explanations. The scores and properties are automatically
                  updated.
                </p>
                <Graph
                  explanations={explanations!}
                  explanationsUpdated={explanationsUpdated!}
                  mutagData={mutagData}
                  selectedId={selectedId}
                  setUpdatedExplanations={setUpdatedExplanations}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Header>
                <Card.Title as="h5">Molecule description</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  <MoleculeInfo
                    mutagData={mutagData}
                    embeddingData={embeddingData}
                    selectedId={selectedId}
                  />
                </Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Explainer performance</Card.Title>
              </Card.Header>
              <Card.Body>
                <Tabs
                  defaultActiveKey="current"
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="current" title="Scores">
                    <ComputeScores
                      explanations={explanationsUpdated!}
                      mutagData={mutagData}
                      selectedId={selectedId}
                      checkboxState={checkboxState}
                    />
                  </Tab>
                  <Tab eventKey="overall" title="Properties">
                    <ComputeProperties
                      explanations={explanationsUpdated!}
                      mutagData={mutagData}
                      selectedId={selectedId}
                      checkboxState={checkboxState}
                    />
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default App;
