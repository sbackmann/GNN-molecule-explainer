import { Margins } from "../types/margins";

export function getChildOrAppend<
    GElement extends d3.BaseType,
    PElement extends d3.BaseType
>(root: d3.Selection<PElement, any, any, any>, tag: string, className: string) {
    const node = root.selectAll(`${tag}.${className}`);

    node
        .data([tag])
        .enter()
        .append<GElement>(tag)
        .attr("class", className);

    return root.select<GElement>(`${tag}.${className}`);
}

export const DEFAULT_MARGINS = {
  top: 20,
  left: 40,
  bottom: 20,
  right: 20
}

export const getMargin = (margin?: Margins) => {
  if (!margin) return DEFAULT_MARGINS
  else return {...DEFAULT_MARGINS, ...margin}
}

export interface ChartStyle {
  width: number
  height: number
  margin?: Margins
}