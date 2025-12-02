import { Inspector } from '@gobuildlabs/devlens-inspector';

// Create inspector instance
const inspector = new Inspector({
  onElementClick: (element) => {
    console.log('Element clicked:', element);
    document.getElementById('lastClicked').textContent = element.selector;
  },
  onElementHover: (element) => {
    console.log('Element hovered:', element);
  },
  onActivate: () => {
    console.log('Inspector activated');
    updateStatus(true);
  },
  onDeactivate: () => {
    console.log('Inspector deactivated');
    updateStatus(false);
  },
});

// UI Controls
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

// Update status display
function updateStatus(isActive) {
  const statusText = document.getElementById('statusText');
  statusText.textContent = isActive ? 'Active' : 'Inactive';
  statusText.style.color = isActive ? '#48bb78' : '#f56565';
}

// Keyboard shortcut: Ctrl/Cmd + Shift + I
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
    e.preventDefault();
    if (inspector.isInspectorActive()) {
      inspector.deactivate();
    } else {
      inspector.activate();
    }
  }
});

console.log('DevLens Inspector Example loaded. Press Ctrl/Cmd + Shift + I to toggle inspector.');
