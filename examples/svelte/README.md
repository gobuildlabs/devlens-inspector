# DevLens Inspector - Svelte Example

This example demonstrates how to use the DevLens Inspector library in a Svelte application.

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

- **Reactive State**: Inspector status and last clicked element update reactively
- **Svelte Lifecycle**: Proper cleanup on component unmount
- **Keyboard Shortcut**: Press `Ctrl/Cmd + Shift + I` to toggle the inspector
- **Element Inspection**: Hover over elements to see the highlight, click to inspect

## Usage

```svelte
<script>
  import { onMount } from 'svelte';
  import { Inspector } from '@gobuildlabs/devlens-inspector';

  let inspector;

  onMount(() => {
    inspector = new Inspector({
      onElementClick: (element) => {
        console.log('Clicked:', element);
      }
    });

    return () => {
      if (inspector) {
        inspector.deactivate();
      }
    };
  });

  function activate() {
    if (inspector) inspector.activate();
  }
</script>

<button on:click={activate}>Activate Inspector</button>
```
