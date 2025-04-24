// import { GraphStore } from "@/graph-store";
// import { CoreHtmlView } from "@/html-view";
// import { ViewportStore } from "@/viewport-store";
// import { Canvas } from "./canvas";
// import { AddNodeRequest } from "./add-node-request";
// import { CanvasDefaults } from "./create-defaults";
// import { CenterFn, standardCenterFn } from "@/center-fn";
// import { HtmlGraphError } from "@/error";
// import { UpdateNodeRequest } from "./update-node-request";
// import { MarkPortRequest } from "./mark-port-request";
// import { BezierEdgeShape } from "@/edges";
// import { createElement } from "@/mocks";

// const createCanvas = (params?: {
//   options?: CanvasDefaults;
//   element?: HTMLElement;
// }): Canvas => {
//   const graphStore = new GraphStore();
//   const viewportStore = new ViewportStore();
//   const element = params?.element ?? document.createElement("div");
//   const htmlView = new CoreHtmlView(graphStore, viewportStore, element);

//   const canvas = new Canvas(
//     element,
//     graphStore,
//     viewportStore,
//     htmlView,
//     params?.options ?? {},
//   );

//   return canvas;
// };

// const createNode = (portId: unknown): AddNodeRequest => {
//   return {
//     element: document.createElement("div"),
//     x: 0,
//     y: 0,
//     ports: [
//       {
//         id: portId,
//         element: document.createElement("div"),
//       },
//     ],
//   };
// };

// const createNodeRequest1 = (): AddNodeRequest => {
//   return {
//     id: "node-1",
//     element: createElement(),
//     x: 0,
//     y: 0,
//     centerFn: standardCenterFn,
//     priority: 0,
//   };
// };

// describe("Canvas", () => {
//   it("should create node", () => {
//     const element = document.createElement("div");
//     const canvas = createCanvas({ element });

//     canvas.addNode({
//       element: createElement(),
//       x: 0,
//       y: 0,
//     });

//     const container = element.children[0].children[0];
//     expect(container.children.length).toBe(1);
//   });

//   it("should add node on controller with specified coordinates", () => {
//     const element = document.createElement("div");
//     const canvas = createCanvas({ element });

//     canvas.addNode(createNodeRequest1());
//     canvas.updateNode("node-1", { x: 100, y: 100 });

//     const container = element.children[0].children[0];
//     const nodeWrapper = container.children[0] as HTMLElement;
//     expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
//   });

//   it("should add node on controller with specified id", () => {
//     const canvas = createCanvas();

//     const nodeElement = document.createElement("div");

//     canvas.addNode({
//       id: "node-1",
//       element: nodeElement,
//       x: 0,
//       y: 0,
//     });

//     const node = canvas.graph.getNode("node-1")!;

//     expect(node.element).toBe(nodeElement);
//   });

//   it("should add node on controller with default center fn when none specified", () => {
//     const centerFn: CenterFn = () => ({ x: 0, y: 0 });

//     const canvas = createCanvas({
//       options: { nodes: { centerFn } },
//     });

//     canvas.addNode({
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//     });

//     const node = canvas.graph.getNode("node-1")!;

//     expect(node.centerFn).toBe(centerFn);
//   });

//   it("should add node on controller with specified center fn", () => {
//     const centerFn: CenterFn = () => ({ x: 0, y: 0 });

//     const canvas = createCanvas();

//     canvas.addNode({
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//       centerFn,
//     });

//     const node = canvas.graph.getNode("node-1")!;

//     expect(node.centerFn).toBe(centerFn);
//   });

//   it("should add node on controller with default priority when none specified", () => {
//     const canvas = createCanvas({
//       options: { nodes: { priority: 10 } },
//     });

//     canvas.addNode({
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//     });

//     const node = canvas.graph.getNode("node-1")!;

//     expect(node.priority).toBe(10);
//   });

//   it("should add node on controller with specified priority", () => {
//     const canvas = createCanvas({});

//     canvas.addNode({
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//       priority: 10,
//     });

//     const node = canvas.graph.getNode("node-1")!;

//     expect(node.priority).toBe(10);
//   });

//   it("should throw error when trying to add node with existing id", () => {
//     const canvas = createCanvas({});

//     const addNodeRequest: AddNodeRequest = {
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//     };

//     canvas.addNode(addNodeRequest);

//     expect(() => {
//       canvas.addNode(addNodeRequest);
//     }).toThrow(HtmlGraphError);
//   });

//   it("should update node without parameters", () => {
//     const canvas = createCanvas({});

//     const addNodeRequest: AddNodeRequest = {
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//     };

//     canvas.addNode(addNodeRequest);

//     const spy = jest.spyOn(controller, "updateNode");

//     canvas.updateNode("node-1");

//     expect(spy).toHaveBeenCalledWith("node-1", {});
//   });

//   it("should update node with spcified parameters", () => {
//     const canvas = createCanvas({});

//     const addNodeRequest: AddNodeRequest = {
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//     };

//     canvas.addNode(addNodeRequest);

//     const spy = jest.spyOn(controller, "updateNode");

//     const updateNodeRequest: UpdateNodeRequest = {
//       x: 10,
//       y: 20,
//       centerFn: () => ({ x: 0, y: 0 }),
//       priority: 10,
//     };

//     canvas.updateNode("node-1", updateNodeRequest);

//     expect(spy).toHaveBeenCalledWith("node-1", updateNodeRequest);
//   });

//   it("should throw error when trying to update nonexisting node", () => {
//     const canvas = createCanvas({});

//     expect(() => {
//       canvas.updateNode("node-1");
//     }).toThrow(HtmlGraphError);
//   });

//   it("should remove node", () => {
//     const canvas = createCanvas({});

//     const addNodeRequest: AddNodeRequest = {
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//     };

//     canvas.addNode(addNodeRequest);

//     const spy = jest.spyOn(controller, "removeNode");

//     canvas.removeNode("node-1");

//     expect(spy).toHaveBeenCalledWith("node-1");
//   });

//   it("should throw error when trying to remove nonexisting node", () => {
//     const canvas = createCanvas({});

//     expect(() => {
//       canvas.removeNode("node-1");
//     }).toThrow(HtmlGraphError);
//   });

//   it("should mark specified port on controller", () => {
//     const canvas = createCanvas({});

//     const portElement = document.createElement("div");

//     const addNodeRequest: AddNodeRequest = {
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//     };

//     const markPortRequest: MarkPortRequest = {
//       nodeId: "node-1",
//       element: portElement,
//     };

//     canvas.addNode(addNodeRequest);

//     const spy = jest.spyOn(controller, "markPort");

//     canvas.markPort(markPortRequest);

//     expect(spy).toHaveBeenCalledWith(
//       expect.objectContaining({ nodeId: "node-1", element: portElement }),
//     );
//   });

//   it("should mark specified port with default direction when none specified", () => {
//     const canvas = createCanvas({
//       ports: { direction: Math.PI },
//     });

//     const portElement = document.createElement("div");

//     const addNodeRequest: AddNodeRequest = {
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//     };

//     const markPortRequest: MarkPortRequest = {
//       nodeId: "node-1",
//       element: portElement,
//     };

//     canvas.addNode(addNodeRequest);

//     const spy = jest.spyOn(controller, "markPort");

//     canvas.markPort(markPortRequest);

//     expect(spy).toHaveBeenCalledWith(
//       expect.objectContaining({ direction: Math.PI }),
//     );
//   });

//   it("should throw error when trying to add port with existing id", () => {
//     const canvas = createCanvas({});

//     const portElement = document.createElement("div");

//     const addNodeRequest: AddNodeRequest = {
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//     };

//     const markPortRequest: MarkPortRequest = {
//       id: "port-1",
//       nodeId: "node-1",
//       element: portElement,
//     };

//     canvas.addNode(addNodeRequest);
//     canvas.markPort(markPortRequest);

//     expect(() => {
//       canvas.markPort(markPortRequest);
//     }).toThrow(HtmlGraphError);
//   });

//   it("should throw error when trying to add port to nonexisting node", () => {
//     const canvas = createCanvas({});

//     const portElement = document.createElement("div");

//     const markPortRequest: MarkPortRequest = {
//       nodeId: "node-1",
//       element: portElement,
//     };

//     expect(() => {
//       canvas.markPort(markPortRequest);
//     }).toThrow(HtmlGraphError);
//   });

//   it("should mark specified ports when adding node", () => {
//     const canvas = createCanvas({});

//     const portElement = document.createElement("div");

//     const addNodeRequest: AddNodeRequest = {
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//       ports: [
//         {
//           id: "port-1",
//           element: portElement,
//           direction: Math.PI,
//         },
//       ],
//     };

//     const spy = jest.spyOn(canvas, "markPort");

//     canvas.addNode(addNodeRequest);

//     expect(spy).toHaveBeenCalledWith({
//       id: "port-1",
//       element: portElement,
//       nodeId: "node-1",
//       direction: Math.PI,
//     });
//   });

//   it("should update port without parameters", () => {
//     const canvas = createCanvas({});

//     const addNodeRequest: AddNodeRequest = {
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//       ports: [
//         {
//           id: "port-1",
//           element: document.createElement("div"),
//         },
//       ],
//     };

//     canvas.addNode(addNodeRequest);

//     const spy = jest.spyOn(controller, "updatePort");

//     canvas.updatePort("port-1");
//     expect(spy).toHaveBeenCalledWith("port-1", {});
//   });

//   it("should update port with specified parameters", () => {
//     const canvas = createCanvas({});

//     const addNodeRequest: AddNodeRequest = {
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//       ports: [
//         {
//           id: "port-1",
//           element: document.createElement("div"),
//         },
//       ],
//     };

//     canvas.addNode(addNodeRequest);

//     const spy = jest.spyOn(controller, "updatePort");

//     canvas.updatePort("port-1", { direction: Math.PI });

//     expect(spy).toHaveBeenCalledWith("port-1", { direction: Math.PI });
//   });

//   it("should throw error when trying to update nonexisting port", () => {
//     const canvas = createCanvas({});

//     expect(() => {
//       canvas.updatePort("port-1");
//     }).toThrow(HtmlGraphError);
//   });

//   it("should unmark port on controller", () => {
//     const canvas = createCanvas({});

//     const addNodeRequest: AddNodeRequest = {
//       id: "node-1",
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//       ports: [
//         {
//           id: "port-1",
//           element: document.createElement("div"),
//         },
//       ],
//     };

//     canvas.addNode(addNodeRequest);

//     const spy = jest.spyOn(controller, "unmarkPort");

//     canvas.unmarkPort("port-1");

//     expect(spy).toHaveBeenCalledWith("port-1");
//   });

//   it("should throw error when trying to unmark nonexisting port", () => {
//     const canvas = createCanvas({});

//     expect(() => {
//       canvas.unmarkPort("port-1");
//     }).toThrow(HtmlGraphError);
//   });

//   it("should add edge on controller", () => {
//     const canvas = createCanvas({});

//     canvas.addNode(createNode("port-1"));
//     canvas.addNode(createNode("port-2"));

//     const spy = jest.spyOn(controller, "addEdge");

//     canvas.addEdge({ from: "port-1", to: "port-2" });

//     expect(spy).toHaveBeenCalledWith(
//       expect.objectContaining({ from: "port-1", to: "port-2" }),
//     );
//   });

//   it("should add edge on controller with default shape when none specified", () => {
//     const shape = new BezierEdgeShape();

//     const canvas = createCanvas({
//       edges: {
//         shape: () => shape,
//       },
//     });

//     canvas.addNode(createNode("port-1"));
//     canvas.addNode(createNode("port-2"));

//     const spy = jest.spyOn(controller, "addEdge");

//     canvas.addEdge({ from: "port-1", to: "port-2" });

//     expect(spy).toHaveBeenCalledWith(expect.objectContaining({ shape }));
//   });

//   it("should add edge on controller with specified shape", () => {
//     const shape = new BezierEdgeShape();

//     const canvas = createCanvas({});

//     canvas.addNode(createNode("port-1"));
//     canvas.addNode(createNode("port-2"));

//     const spy = jest.spyOn(controller, "addEdge");

//     canvas.addEdge({ from: "port-1", to: "port-2", shape });

//     expect(spy).toHaveBeenCalledWith(expect.objectContaining({ shape }));
//   });

//   it("should add edge on controller with default priority when none specified", () => {
//     const canvas = createCanvas({
//       edges: {
//         priority: 10,
//       },
//     });

//     canvas.addNode(createNode("port-1"));
//     canvas.addNode(createNode("port-2"));

//     const spy = jest.spyOn(controller, "addEdge");

//     canvas.addEdge({ from: "port-1", to: "port-2" });

//     expect(spy).toHaveBeenCalledWith(expect.objectContaining({ priority: 10 }));
//   });

//   it("should add edge on controller with specified priority", () => {
//     const canvas = createCanvas({});

//     canvas.addNode(createNode("port-1"));
//     canvas.addNode(createNode("port-2"));

//     const spy = jest.spyOn(controller, "addEdge");

//     canvas.addEdge({ from: "port-1", to: "port-2", priority: 10 });

//     expect(spy).toHaveBeenCalledWith(expect.objectContaining({ priority: 10 }));
//   });

//   it("should throw error when trying to add edge with existing id", () => {
//     const canvas = createCanvas({});

//     canvas.addNode(createNode("port-1"));
//     canvas.addNode(createNode("port-2"));
//     canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });

//     expect(() => {
//       canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });
//     }).toThrow(HtmlGraphError);
//   });

//   it("should throw error when trying to add edge to nonexisting source", () => {
//     const canvas = createCanvas({});

//     canvas.addNode(createNode("port-2"));

//     expect(() => {
//       canvas.addEdge({ from: "port-1", to: "port-2" });
//     }).toThrow(HtmlGraphError);
//   });

//   it("should throw error when trying to add edge to nonexisting target", () => {
//     const canvas = createCanvas({});

//     canvas.addNode(createNode("port-1"));

//     expect(() => {
//       canvas.addEdge({ from: "port-1", to: "port-2" });
//     }).toThrow(HtmlGraphError);
//   });

//   it("should update edge without parameters", () => {
//     const canvas = createCanvas({});

//     canvas.addNode(createNode("port-1"));
//     canvas.addNode(createNode("port-2"));
//     canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });

//     const spy = jest.spyOn(controller, "updateEdge");

//     canvas.updateEdge("edge-1");

//     expect(spy).toHaveBeenCalledWith("edge-1", {});
//   });

//   it("should update edge with specified parameters", () => {
//     const canvas = createCanvas({});

//     canvas.addNode(createNode("port-1"));
//     canvas.addNode(createNode("port-2"));
//     canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });

//     const spy = jest.spyOn(controller, "updateEdge");

//     const shape = new BezierEdgeShape();

//     canvas.updateEdge("edge-1", {
//       from: "port-2",
//       to: "port-1",
//       shape,
//       priority: 10,
//     });

//     expect(spy).toHaveBeenCalledWith("edge-1", {
//       from: "port-2",
//       to: "port-1",
//       shape,
//       priority: 10,
//     });
//   });

//   it("should throw error when trying to update nonexisting edge", () => {
//     const canvas = createCanvas({});

//     expect(() => {
//       canvas.updateEdge("edge-1");
//     }).toThrow(HtmlGraphError);
//   });

//   it("should remove edge on controller", () => {
//     const canvas = createCanvas({});

//     canvas.addNode(createNode("port-1"));
//     canvas.addNode(createNode("port-2"));
//     canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });

//     const spy = jest.spyOn(controller, "removeEdge");

//     canvas.removeEdge("edge-1");

//     expect(spy).toHaveBeenCalledWith("edge-1");
//   });

//   it("should throw error when trying to remove nonexisting edge", () => {
//     const canvas = createCanvas({});

//     expect(() => {
//       canvas.removeEdge("edge-1");
//     }).toThrow(HtmlGraphError);
//   });

//   it("should patch viewport matrix on controller", () => {
//     const canvas = createCanvas({});

//     const spy = jest.spyOn(controller, "patchViewportMatrix");

//     canvas.patchViewportMatrix({ scale: 2 });

//     expect(spy).toHaveBeenCalledWith({ scale: 2 });
//   });

//   it("should patch content matrix on controller", () => {
//     const canvas = createCanvas({});

//     const spy = jest.spyOn(controller, "patchContentMatrix");

//     canvas.patchContentMatrix({ scale: 2 });

//     expect(spy).toHaveBeenCalledWith({ scale: 2 });
//   });

//   it("should clear controller", () => {
//     const canvas = createCanvas({});

//     const spy = jest.spyOn(controller, "clear");

//     canvas.clear();

//     expect(spy).toHaveBeenCalled();
//   });

//   it("should destroy controller", () => {
//     const canvas = createCanvas({});

//     const spy = jest.spyOn(controller, "destroy");

//     canvas.destroy();

//     expect(spy).toHaveBeenCalled();
//   });

//   it("should emit event before destroy", () => {
//     const canvas = createCanvas({});

//     const onBeforeDestroy = jest.fn();

//     canvas.onBeforeDestroy.subscribe(onBeforeDestroy);

//     canvas.destroy();

//     expect(onBeforeDestroy).toHaveBeenCalled();
//   });
// });
