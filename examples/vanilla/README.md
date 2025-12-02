# DevLens Inspector - Vanilla JavaScript Example

This example demonstrates how to use the DevLens Inspector library in a vanilla JavaScript application.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

## Features

- **Activate/Deactivate Inspector**: Use the buttons to control the inspector
- **Keyboard Shortcut**: Press `Ctrl/Cmd + Shift + I` to toggle the inspector
- **Element Inspection**: Hover over elements to see the highlight, click to inspect
- **Status Display**: See the current inspector status and last clicked element

## Usage

```javascript
import { Inspector } from '@gobuildlabs/devlens-inspector';

const inspector = new Inspector({
  onElementClick: (element) => {
    console.log('Clicked:', element);
  },
  onElementHover: (element) => {
    console.log('Hovered:', element);
  }
});

// Activate the inspector
inspector.activate();

// Deactivate the inspector
inspector.deactivate();

// Check if active
inspector.isInspectorActive();
```
