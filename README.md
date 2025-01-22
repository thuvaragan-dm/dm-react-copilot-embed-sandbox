# React Copilot Embed Sandbox Integration Guide

This guide provides instructions on how to integrate the `react-copilot-embed-sandbox` component into various frameworks and vanilla JavaScript projects. The styles applied in the example are excluded to focus on the core integration steps.

---

## Table of Contents

1. [Vanilla JavaScript](#vanilla-javascript)
2. [React](#react)
3. [Vue](#vue)
4. [Angular](#angular)
5. [Svelte](#svelte)

---

## Vanilla JavaScript

### Steps:

1. Include the required scripts for React and ReactDOM.
2. Include the UMD build of `react-copilot-embed-sandbox`.
3. Create a container element for the Copilot component.
4. Render the Copilot component using `React.createElement`.

### Example:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Copilot Example</title>
  </head>
  <body>
    <div id="root"></div>

    <!-- Include React and ReactDOM -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

    <!-- Include your UMD build -->
    <script src="https://cdn.jsdelivr.net/npm/react-copilot-embed-sandbox@latest/dist/index.umd.js"></script>

    <!-- Your App Script -->
    <script>
      // Access global variables
      const { Copilot } = window["react-copilot-embed-sandbox"];

      // Define your App component
      function App() {
        return React.createElement(
          "div",
          null,
          React.createElement(Copilot, {
            apiKey: "YOUR_API_KEY", // Replace with your API key
            copilot: "apex",
          })
        );
      }

      // Render the App component
      ReactDOM.render(
        React.createElement(App),
        document.getElementById("root")
      );
    </script>
  </body>
</html>
```

---

## React

### Steps:

1. Install the `react-copilot-embed-sandbox` package.
2. Import and use the `Copilot` component in your React application.

### Example:

```bash
npm install react-copilot-embed-sandbox
```

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { Copilot } from "react-copilot-embed-sandbox";

function App() {
  return (
    <div>
      <Copilot
        apiKey="YOUR_API_KEY" // Replace with your API key
        copilot="apex"
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```

---

## Vue

### Steps:

1. Install the `react-copilot-embed-sandbox` package.
2. Use a wrapper component to integrate the React component into Vue.

### Example:

```bash
npm install react-copilot-embed-sandbox
```

```vue
<template>
  <div id="app">
    <div ref="copilotContainer"></div>
  </div>
</template>

<script>
import { Copilot } from "react-copilot-embed-sandbox";
import React from "react";
import ReactDOM from "react-dom";

export default {
  mounted() {
    ReactDOM.render(
      React.createElement(Copilot, {
        apiKey: "YOUR_API_KEY", // Replace with your API key
        copilot: "apex",
      }),
      this.$refs.copilotContainer
    );
  },
  beforeDestroy() {
    ReactDOM.unmountComponentAtNode(this.$refs.copilotContainer);
  },
};
</script>
```

---

## Angular

### Steps:

1. Install the `react-copilot-embed-sandbox` package.
2. Use Angular's `ngAfterViewInit` lifecycle hook to render the React component.

### Example:

```bash
npm install react-copilot-embed-sandbox
```

```typescript
import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Copilot } from "react-copilot-embed-sandbox";
import * as React from "react";
import * as ReactDOM from "react-dom";

@Component({
  selector: "app-root",
  template: `<div #copilotContainer></div>`,
})
export class AppComponent implements AfterViewInit {
  @ViewChild("copilotContainer", { static: false })
  copilotContainer!: ElementRef;

  ngAfterViewInit() {
    ReactDOM.render(
      React.createElement(Copilot, {
        apiKey: "YOUR_API_KEY", // Replace with your API key
        copilot: "apex",
      }),
      this.copilotContainer.nativeElement
    );
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.copilotContainer.nativeElement);
  }
}
```

---

## Svelte

### Steps:

1. Install the `react-copilot-embed-sandbox` package.
2. Use Svelte's `onMount` lifecycle function to render the React component.

### Example:

```bash
npm install react-copilot-embed-sandbox
```

```svelte
<script>
  import { onMount } from "svelte";
  import { Copilot } from "react-copilot-embed-sandbox";
  import * as React from "react";
  import * as ReactDOM from "react-dom";

  let copilotContainer;

  onMount(() => {
    ReactDOM.render(
      React.createElement(Copilot, {
        apiKey: "YOUR_API_KEY", // Replace with your API key
        copilot: "apex",
      }),
      copilotContainer
    );

    return () => {
      ReactDOM.unmountComponentAtNode(copilotContainer);
    };
  });
</script>

<div bind:this={copilotContainer}></div>
```

---

This documentation provides a clear and concise way to integrate the `react-copilot-embed-sandbox` component into your project, regardless of the framework you're using.
