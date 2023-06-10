import { useEffect, createRef, useState } from "react";
import * as d3 from "d3";
import { DataArray, EmbeddingArray } from "../types/data";
import { ChartStyle, getChildOrAppend, getMargin } from "./utils";
import "./ScatterPlot.css";

interface ScatterPlotProp extends ChartStyle {
  data?: EmbeddingArray;
  mol_data?: DataArray;
  closeModal: () => void; // State updater function for selected data
  onSelectedIdChange: (d: any) => void;
}

const ScatterPlot = (props: ScatterPlotProp) => {
  const ref = createRef<SVGSVGElement>();
  const { data, mol_data, closeModal, onSelectedIdChange, ...style } = props;

  useEffect(() => {
    const root = ref.current;
    if (data && mol_data && root) {
      renderScatterPlot(
        root,
        data,
        mol_data,
        style,
        closeModal,
        onSelectedIdChange
      );
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
  props: ChartStyle,
  closeModal: () => void,
  onSelectedIdChange: (d: any) => void
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
  const colors = d3.scaleOrdinal(["1", "2"], ["red", "blue"]);

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

  const handleDotClick = (event: TouchEvent, d: any) => {
    // Hide tooltip
    const tooltip = d3.select("#tooltip");
    tooltip.style("display", "none");
    onSelectedIdChange(d.idx);
    // Close modal
    closeModal();
  };

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
    .on("mouseover", handleMouseOver)
    .on("mouseout", (event, d) => {
      // Hide tooltip
      const tooltip = d3.select("#tooltip");
      tooltip.style("display", "none");
    })
    .on("click", (event: TouchEvent, d: any) => {
      handleDotClick(event, d);
    });

  // Define mouseover event handler
  function handleMouseOver(event: MouseEvent, d: any) {
    // Display information about the data point
    const tooltip = d3
      .select("#tooltip")
      .style("display", "block")
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 10 + "px")
      .attr("class", "tooltip-text");

    const d_mol = mol_data.find((mol) => mol.idx[0] === d.idx);

    if (d_mol) {
      tooltip.html(
        `Molecule ID: ${d.idx}
        <br/>Toxicity: ${d.true_label}
        <br/>Predicted toxicity: ${d.gnn_label}
        <br/>Number of atoms: ${d_mol.x.length}
        <br/>Number of bonds: ${d_mol.edge_index[0]?.length || 0}`
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
    d3
      .axisLeft(y)
      .ticks(4)
      .tickFormat(() => "")
  );

  getChildOrAppend<SVGGElement, SVGGElement>(base, "g", "x-axis-base")
    .attr("transform", `translate(0, ${height})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(5)
        .tickFormat(() => "")
    );

  const legendData = [
    { label: "Toxic", color: "red" },
    { label: "Non-toxic", color: "blue" },
  ];

  const legend = getChildOrAppend<SVGGElement, SVGElement>(
    visRoot,
    "g",
    "legend"
  ).attr(
    "transform",
    `translate(${width - margin.right - 100}, ${margin.top + 10})`
  );

  legend
    .selectAll("rect")
    .data(legendData)
    .join<SVGRectElement>(
      (enter) => enter.append("rect"),
      (update) => update,
      (exit) => exit.remove()
    )
    .attr("x", 0)
    .attr("y", (d, i) => i * 25)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", (d) => d.color);

  legend
    .selectAll("text")
    .data(legendData)
    .join<SVGTextElement>(
      (enter) => enter.append("text"),
      (update) => update,
      (exit) => exit.remove()
    )
    .attr("x", 25)
    .attr("y", (d, i) => i * 25 + 15)
    .text((d) => d.label)
    .style("font-size", "14px")
    .attr("alignment-baseline", "middle");
}

export default ScatterPlot;
