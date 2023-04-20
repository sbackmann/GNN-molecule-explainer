import { useEffect, createRef } from "react";
import * as d3 from "d3";
import { DataArray, EmbeddingArray } from "../types/data";
import { ChartStyle, getChildOrAppend, getMargin } from "./utils";
import "./ScatterPlot.css";

interface ScatterPlotProp extends ChartStyle {
  data?: EmbeddingArray;
  mol_data?: DataArray;
}

const ScatterPlot = (props: ScatterPlotProp) => {
  const ref = createRef<SVGSVGElement>();
  const { data, mol_data, ...style } = props;
  useEffect(() => {
    const root = ref.current;
    if (data && mol_data && root) {
      renderScatterPlot(root, data, mol_data, style);
    }
  }, [props]);

  return (
    <div className="scatterPlot">
      <svg width={props.width} height={props.height} ref={ref} />
    </div>
  );
};

/**
 * Render the scatterplot
 * @param root the root SVG element
 * @param data the data for visualization
 * @param props the parameters of the scatterplot
 */
function renderScatterPlot(
  root: SVGElement | SVGGElement,
  data: EmbeddingArray,
  mol_data: DataArray,
  props: ChartStyle
) {
  const margin = getMargin(props.margin);
  const height = props.height - margin.top - margin.bottom;
  const width = props.width - margin.left - margin.right;

  const visRoot = d3.select(root);
  const base = getChildOrAppend<SVGGElement, SVGElement>(
    visRoot,
    "g",
    "base"
  ).attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xValues = data.map((d) => d.pca_x);
  const x = d3
    .scaleLinear()
    .domain([d3.min(xValues) || 0, d3.max(xValues) || 1])
    .range([0, width]);
  const yValues = data.map((d) => d.pca_y);
  const y = d3
    .scaleLinear()
    .domain([d3.min(yValues) || 0, d3.max(yValues) || 1])
    .range([height, 0]);
  const colors = d3.scaleOrdinal(["1", "2"], ["red", "green"]);

  // Add a tooltip div to the HTML body for displaying information
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("padding", "5px");

  base
    .selectAll("circle.dot")
    .data(data)
    .join<SVGCircleElement>(
      (enter) => enter.append("circle").attr("class", "dot"),
      (update) => update,
      (exit) => exit.remove()
    )
    .attr("cx", (d) => x(d.pca_x))
    .attr("cy", (d) => y(d.pca_y))
    .attr("r", 5)
    .style("fill", (d) => colors(d.true_label) || "#fff")
    .on("mouseover", handleMouseOver);

  // Define mouseover event handler
  function handleMouseOver(event: MouseEvent, d: any) {
    // Display information about the data point
    const tooltip = d3
      .select("#tooltip")
      .style("display", "block")
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 10 + "px");

    const d_mol = mol_data.find((mol) => mol.idx[0] === d.idx);

    if (d_mol) {
      tooltip.html(
        `Molecule ID: ${d.idx}
        <br/>Toxicity: ${d.true_label}
        <br/>Predicted toxicity: ${d.gnn_label}
        <br/>Number of nodes: ${d_mol.x.length}
        <br/>Number of edges: ${d_mol.edge_index[0]?.length || 0}`
      );
    } else {
      tooltip.html(
        `Molecule ID: ${d.idx}
              <br/>Toxicity: ${d.true_label}
              <br/>Predicted toxicity: ${d.gnn_label}`
      );
    }
  }

  getChildOrAppend<SVGGElement, SVGGElement>(base, "g", "y-axis-base").call(
    d3.axisLeft(y).ticks(4)
  );

  getChildOrAppend<SVGGElement, SVGGElement>(base, "g", "x-axis-base")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));
}

export default ScatterPlot;
