# DevLens Inspector - VS Code Extension Example

This example demonstrates how to integrate the DevLens Inspector library into a VS Code extension with webview support.

## Features

- **Command Palette Integration**: Access inspector commands via Command Palette
- **Keyboard Shortcuts**: `Ctrl/Cmd + Shift + I` to toggle inspector in webview
- **Webview Communication**: Bidirectional messaging between extension and webview
- **VS Code Theming**: Respects VS Code's color theme

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Open this folder in VS Code

3. Press `F5` to launch the Extension Development Host

4. In the new window, open the Command Palette (`Ctrl/Cmd + Shift + P`) and run:
   - `DevLens: Activate Inspector` - Opens the demo webview and activates inspector
   - `DevLens: Deactivate Inspector` - Deactivates the inspector
   - `DevLens: Toggle Inspector` - Toggles inspector state

## Commands

- `devlens-inspector.activate` - Activate the inspector
- `devlens-inspector.deactivate` - Deactivate the inspector
- `devlens-inspector.toggle` - Toggle inspector (Ctrl/Cmd + Shift + I)

## Integration Guide

### In your extension's webview:

```javascript
import { Inspector } from '@gobuildlabs/devlens-inspector';

const vscode = acquireVsCodeApi();

const inspector = new Inspector({
  onElementClick: (element) => {
    // Send message to extension
    vscode.postMessage({
      command: 'elementClicked',
      selector: element.selector
    });
  }
});

// Listen for messages from extension
window.addEventListener('message', event => {
  const message = event.data;
  if (message.command === 'activate') {
    inspector.activate();
  }
});
```

### In your extension code:

```javascript
// Send message to webview
panel.webview.postMessage({ command: 'activate' });

// Receive messages from webview
panel.webview.onDidReceiveMessage(message => {
  if (message.command === 'elementClicked') {
    vscode.window.showInformationMessage(\`Clicked: \${message.selector}\`);
  }
});
```

## Packaging

To package the extension:

```bash
npm run package
```

This will create a `.vsix` file that can be installed in VS Code.
