const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('DevLens Inspector extension is now active');

  // Register commands
  let activateCmd = vscode.commands.registerCommand('devlens-inspector.activate', () => {
    const panel = getOrCreateWebviewPanel(context);
    panel.webview.postMessage({ command: 'activate' });
    vscode.window.showInformationMessage('DevLens Inspector activated');
  });

  let deactivateCmd = vscode.commands.registerCommand('devlens-inspector.deactivate', () => {
    const panel = getOrCreateWebviewPanel(context);
    panel.webview.postMessage({ command: 'deactivate' });
    vscode.window.showInformationMessage('DevLens Inspector deactivated');
  });

  let toggleCmd = vscode.commands.registerCommand('devlens-inspector.toggle', () => {
    const panel = getOrCreateWebviewPanel(context);
    panel.webview.postMessage({ command: 'toggle' });
  });

  context.subscriptions.push(activateCmd, deactivateCmd, toggleCmd);
}

let currentPanel = undefined;

function getOrCreateWebviewPanel(context) {
  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.One);
    return currentPanel;
  }

  currentPanel = vscode.window.createWebviewPanel(
    'devlensInspector',
    'DevLens Inspector Demo',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );

  currentPanel.webview.html = getWebviewContent();

  currentPanel.onDidDispose(() => {
    currentPanel = undefined;
  }, null, context.subscriptions);

  // Handle messages from the webview
  currentPanel.webview.onDidReceiveMessage(
    message => {
      switch (message.command) {
        case 'inspectorActivated':
          vscode.window.showInformationMessage('Inspector activated');
          break;
        case 'inspectorDeactivated':
          vscode.window.showInformationMessage('Inspector deactivated');
          break;
        case 'elementClicked':
          vscode.window.showInformationMessage(`Element clicked: ${message.selector}`);
          break;
      }
    },
    undefined,
    context.subscriptions
  );

  return currentPanel;
}

function getWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevLens Inspector Demo</title>
  <style>
    body {
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: var(--vscode-editor-foreground);
      margin-bottom: 20px;
    }
    .controls {
      background: var(--vscode-editor-inactiveSelectionBackground);
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .button-group {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    button {
      padding: 10px 20px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
    }
    button:hover {
      background: var(--vscode-button-hoverBackground);
    }
    .status {
      margin-top: 16px;
      padding: 12px;
      background: var(--vscode-input-background);
      border-radius: 4px;
      border-left: 3px solid var(--vscode-activityBarBadge-background);
    }
    .demo-section {
      background: var(--vscode-editor-inactiveSelectionBackground);
      padding: 30px;
      border-radius: 8px;
    }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }
    .card {
      background: var(--vscode-input-background);
      padding: 24px;
      border-radius: 8px;
      border: 1px solid var(--vscode-panel-border);
    }
    .card h3 {
      margin-bottom: 8px;
      color: var(--vscode-editor-foreground);
    }
    code {
      background: var(--vscode-textCodeBlock-background);
      padding: 2px 6px;
      border-radius: 3px;
      font-family: var(--vscode-editor-font-family);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔍 DevLens Inspector</h1>

    <div class="controls">
      <h2>Inspector Controls</h2>
      <div class="button-group">
        <button id="activateBtn">Activate Inspector</button>
        <button id="deactivateBtn">Deactivate Inspector</button>
        <button id="toggleBtn">Toggle Inspector</button>
      </div>
      <div class="status">
        <strong>Status:</strong> <span id="statusText">Inactive</span>
      </div>
      <div class="status">
        <strong>Last Clicked:</strong> <code id="lastClicked">None</code>
      </div>
    </div>

    <div class="demo-section">
      <h2>Try Inspecting These Elements</h2>
      <p>Activate the inspector and hover over elements to inspect them.</p>

      <div class="card-grid">
        <div class="card">
          <h3>Card 1</h3>
          <p>Inspect this card</p>
        </div>
        <div class="card">
          <h3>Card 2</h3>
          <p>Or this one</p>
        </div>
        <div class="card">
          <h3>Card 3</h3>
          <p>Or this one!</p>
        </div>
      </div>
    </div>
  </div>

  <script type="module">
    import { Inspector } from 'https://cdn.jsdelivr.net/npm/@gobuildlabs/devlens-inspector@0.0.2/dist/index.esm.js';

    const vscode = acquireVsCodeApi();

    const inspector = new Inspector({
      onElementClick: (element) => {
        document.getElementById('lastClicked').textContent = element.selector;
        vscode.postMessage({
          command: 'elementClicked',
          selector: element.selector
        });
      },
      onActivate: () => {
        updateStatus(true);
        vscode.postMessage({ command: 'inspectorActivated' });
      },
      onDeactivate: () => {
        updateStatus(false);
        vscode.postMessage({ command: 'inspectorDeactivated' });
      }
    });

    document.getElementById('activateBtn').addEventListener('click', () => {
      inspector.activate();
    });

    document.getElementById('deactivateBtn').addEventListener('click', () => {
      inspector.deactivate();
    });

    document.getElementById('toggleBtn').addEventListener('click', () => {
      if (inspector.isInspectorActive()) {
        inspector.deactivate();
      } else {
        inspector.activate();
      }
    });

    function updateStatus(isActive) {
      const statusText = document.getElementById('statusText');
      statusText.textContent = isActive ? 'Active' : 'Inactive';
      statusText.style.color = isActive ? 'var(--vscode-testing-iconPassed)' : 'var(--vscode-testing-iconFailed)';
    }

    // Handle messages from extension
    window.addEventListener('message', event => {
      const message = event.data;
      switch (message.command) {
        case 'activate':
          inspector.activate();
          break;
        case 'deactivate':
          inspector.deactivate();
          break;
        case 'toggle':
          if (inspector.isInspectorActive()) {
            inspector.deactivate();
          } else {
            inspector.activate();
          }
          break;
      }
    });
  </script>
</body>
</html>`;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
