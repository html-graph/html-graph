import {
  EdgesFollowNodeLayer,
  EdgesOnTopLayer,
  Layer,
  LayersMode,
  NodesOnTopLayer,
} from "@/layers";

export const layers: {
  [key in LayersMode]: (host: HTMLElement) => Layer;
} = {
  "edges-on-top": (host) => new EdgesOnTopLayer(host),
  "edges-follow-node": (host) => new EdgesFollowNodeLayer(host),
  "nodes-on-top": (host) => new NodesOnTopLayer(host),
};
