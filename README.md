# Canvas whiteboard

https://canvaswhiteboard.msiek.com/

https://github.com/MateuszSiek/canvas-whiteboard/assets/16710005/963b3c9c-72b0-4a01-9955-a81dc82ec1e9

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technical Details](#technical-details)
4. [Developement](#developement)
5. [Limitations](#limitations)
6. [License](#license)

## Introduction

The purpose of this project is to explore canvas rendering using multi-layered canvases. The implementation consists of the following layers:

- **Main Canvas Layer**: Used for rendering shapes.
- **UI Layer**: Used for rendering user interface elements like selection boxes or resize anchors.
- **User Interaction Layer**: Used for interacting with the application(not visible to the user)

The idea behind using multiple layers is to achieve better performance and to separate contexts.
By using individual layers, we can:

- Render only the necessary layers to reduce the bundle size, such as in scenarios where object rendering is needed without interactions.
- Selectively re-render specific layers, improving performance by updating only what is needed.

This project is primarily an exploration and aims to inspire others interested in canvas rendering.

Users can experience the application in two modes:

1. **Canvas view**: All layers overlapped as they would appear in practice.
2. **Debug view**: All layers displayed side by side for better understanding of the concept.

https://github.com/MateuszSiek/canvas-whiteboard/assets/16710005/8f1ab0d2-bcbc-488c-813d-e7f15f77246b

## Features

- **Shape Support**:

  - Currently supports rectangles.
  - Ability to add new rectangles via a button click.

- **Interactions**:

  - Select, resize, and move individual rectangles.
  - Multi-object selection by holding the Shift key and clicking multiple objects.
  - Resize or move multiple selected objects simultaneously.

- **Debug View**:

  - Renders the application with separate canvases to showcase the implementation details.
  - Helps understand how different canvases interact and re-render.

- **Performance**:
  - Optimized to handle a large number of shapes efficiently.

## Technical Details

### Technologies and Libraries

- **Framework**: React with Vite
- **Language**: TypeScript
- **Rendering**: HTML5 Canvas API

### Structure

### Custom Canvas Objects

The app leverages a [custom canvas abstraction](https://github.com/MateuszSiek/canvas-whiteboard/blob/main/src/whiteboard/canvas/Canvas.ts) for better control over canvas interactions and rendering. This abstraction supports features like custom event emission and proper initialization, considering the device pixel ratio.

Derived canvases extend this base class to create specialized canvases, such as the [selection canvas](https://github.com/MateuszSiek/canvas-whiteboard/blob/main/src/whiteboard/canvas/SelectionCanvas.ts), which implements features like color mapping for object selection and custom events.

### Layered Canvas Approach

The layered approach uses the following canvases:

- **Main Canvas Layer**: Renders the primary shapes.
- **UI Layer**: Renders UI elements such as selection boxes and resize anchors.
- **User Interaction Layer**: An invisible layer used for handling interactions like object selection.

![CleanShot 2024-06-05 at 11 17 43@2x](https://github.com/MateuszSiek/canvas-whiteboard/assets/16710005/ef21920f-c284-4a88-b507-31f45123e917)

### Object Rendering

Shapes are rendered using customizable renderers defined for each shape. Each shape has [renderDefault and renderSelect](https://github.com/MateuszSiek/canvas-whiteboard/blob/main/src/whiteboard/types/render.ts#L8-L12) methods.
`renderDefault` controlls the rendering of objects visible to the user, `renderSelect` method controlls the way we render selection bounding boxes(shapes). This way we can decouple rendering from selection.
This could be usefull for example in a scenario when the shapes is very small(1x1 px), which would be very hard to select with a click. We can render a selection box that is a bit larger.

### Object Selection

The selection is implemented using cusom [SelectionCanvas](https://github.com/MateuszSiek/canvas-whiteboard/blob/main/src/whiteboard/canvas/SelectionCanvas.ts) which renders objects on the **User Interaction Layer** with each shape having an unique that is maped to an ID. When the user clicks on an object, the pixel color under the mouse cursor is read and can be easilly mapped to an object ID using a pre-stored mapping. This allows for efficient and precise object selection without affecting the main canvas rendering.

To manage and control the selection, resizing, and movement of objects, the custom [useSelectionCanvas](https://github.com/MateuszSiek/canvas-whiteboard/blob/main/src/whiteboard/hooks/useSelectionCanvas.tsx) hook is utilized:

- **useSelectionCanvas**: Initializes the `SelectionCanvas` and adds event listeners for selection, resizing, and dragging. It manages the state for selected objects, draggable UI objects, selected anchors, and dragging status. The hook handles object selection by mapping clicked pixels to object IDs, updates the selection state, and facilitates object manipulation, including resizing and moving.

### Performance Optimization

By utilizing multiple layers, the application can selectively re-render only the necessary layers, such as updating the UI layer without altering the main canvas. This reduces unnecessary re-renders and improves overall performance.

## Developement

To set up and run on your local machine, follow these steps:

### Requirements

Before you begin, ensure you have the following installed:

- **Node.js** (tested on v21.6.1, but it might work on other versions as well)
- **npm** (tested on v10.2.4, but it might work on other versions as well)

### Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/MateuszSiek/canvas-whiteboard.git
   cd canvas-whiteboard
   ```

2. **Install the dependencies:**

   ```sh
   npm install
   ```

3. **Run the development server:**

```sh
npm run dev
```

4. **Open the application:**

Open your web browser and navigate to http://localhost:5173.

## Limitations

- **Dynamic Canvas Resizing**:

  - The canvas does not dynamically resize when the browser window is resized. Users need to reload the page for the canvas to update to the new size.

- **Selection**:

  - There is no "drag to select" functionality. Users need to click on each shape individually to select multiple shapes.

- **Negative Dimensions**:

  - Shapes can be resized "backwards," leading to negative width and height. Although the objects render correctly, they are not properly selectable afterward.

- **Objects resizing**:
  - Only corner resizing is supported. Users can't resize shapes solely in width or height; resizing always involves moving a corner and alters both dimensions.

## License

MIT License © [Mateusz Siek](http://msiek.com)
