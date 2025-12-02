# @devlens/inspector

> 🔍 A lightweight, framework-agnostic TypeScript library for visual element inspection on web pages

[![npm version](https://img.shields.io/npm/v/@devlens/inspector.svg)](https://www.npmjs.com/package/@devlens/inspector)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@devlens/inspector)](https://bundlephobia.com/package/@devlens/inspector)
[![npm version](https://badge.fury.io/js/@gobuildlabs%2Fdevlens-inspector.svg)](https://www.npmjs.com/package/@gobuildlabs/devlens-inspector)

**@devlens/inspector** enables visual element inspection with crosshairs, highlights, and floating labels. Perfect for building developer tools, browser extensions, testing utilities, and debugging interfaces.

---

## ✨ Features

- 🎯 **Framework Agnostic** - Works everywhere: React, Vue, Svelte, Angular, Vanilla JS, and more
- 🧩 **Browser Extensions** - Native support for Chrome, Firefox, Edge, and Safari extensions
- 📘 **TypeScript First** - Full type safety with comprehensive JSDoc documentation
- 🎨 **Fully Customizable** - Customize crosshairs, highlights, labels, overlays, and behavior
- 🪶 **Zero Dependencies** - Lightweight (13KB) with no external dependencies
- 🔒 **Security First** - Built-in input sanitization and XSS prevention
- 🎮 **Event-Driven** - Rich callback system for element interactions
- 📦 **Tree-Shakeable** - Import only what you need (ESM + UMD)
- 🌐 **Universal** - Works in browsers, extensions, VSCode webviews, and Electron apps

---

## 📦 Installation

```bash
npm install @devlens/inspector
```

```bash
yarn add @devlens/inspector
```

```bash
pnpm add @devlens/inspector
```

---

## 🚀 Quick Start

```typescript
import { Inspector } from '@devlens/inspector';

const inspector = new Inspector({
  onElementClick: (element) => {
    console.log('Clicked:', element.tagName);
    console.log('Selector:', element.selector);
    console.log('Position:', element.boundingRect);
  }
});

// Activate inspector mode
inspector.activate();

// Deactivate when done
inspector.deactivate();
```

---

## 🌍 Where You Can Use It

### ✅ **Browser Extensions**

<details>
<summary><strong>Chrome Extensions</strong></summary>

Perfect for Chrome extension content scripts:

```typescript
// content-script.ts
import { Inspector } from '@devlens/inspector';

let inspector: Inspector;

// Listen for activation message
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'ACTIVATE_INSPECTOR') {
    inspector = new Inspector({
      onElementClick: (element) => {
        // Send element data to background script
        chrome.runtime.sendMessage({
          type: 'ELEMENT_SELECTED',
          data: {
            selector: element.selector,
            tagName: element.tagName,
            text: element.innerText,
            url: element.url
          }
        });
      }
    });
    inspector.activate();
  }

  if (message.type === 'DEACTIVATE_INSPECTOR') {
    inspector?.deactivate();
  }
});
```

**Manifest V3 Support**: ✅ Fully compatible

</details>

<details>
<summary><strong>Firefox Extensions</strong></summary>

Same as Chrome, just use `browser.*` API:

```typescript
import { Inspector } from '@devlens/inspector';

browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'ACTIVATE_INSPECTOR') {
    const inspector = new Inspector({
      onElementClick: (element) => {
        browser.runtime.sendMessage({
          type: 'ELEMENT_SELECTED',
          data: element
        });
      }
    });
    inspector.activate();
  }
});
```

**WebExtensions API**: ✅ Fully compatible

</details>

<details>
<summary><strong>Edge Extensions</strong></summary>

Uses the same Chrome extension API:

```typescript
import { Inspector } from '@devlens/inspector';
// Same code as Chrome extensions
```

**Edge Chromium**: ✅ Fully compatible

</details>

<details>
<summary><strong>Safari Extensions</strong></summary>

Works with Safari Web Extensions:

```typescript
import { Inspector } from '@devlens/inspector';

browser.runtime.onMessage.addListener((message) => {
  // Same WebExtensions API as Firefox
});
```

**Safari 14+**: ✅ Compatible with Web Extensions

</details>

---

### ✅ **Frontend Frameworks**

<details>
<summary><strong>React</strong></summary>

```tsx
import { Inspector, type InspectedElement } from '@devlens/inspector';
import { useEffect, useRef, useState } from 'react';

function ElementInspector() {
  const inspectorRef = useRef<Inspector | null>(null);
  const [selectedElement, setSelectedElement] = useState<InspectedElement | null>(null);

  useEffect(() => {
    inspectorRef.current = new Inspector({
      onElementClick: (element) => {
        setSelectedElement(element);
      },
      styles: {
        highlight: {
          borderColor: '#3b82f6',
          borderWidth: 2
        }
      }
    });

    return () => {
      inspectorRef.current?.deactivate();
    };
  }, []);

  const handleActivate = () => {
    inspectorRef.current?.activate();
  };

  return (
    <div>
      <button onClick={handleActivate}>
        🔍 Inspect Element
      </button>

      {selectedElement && (
        <div>
          <h3>Selected Element</h3>
          <p><strong>Tag:</strong> {selectedElement.tagName}</p>
          <p><strong>Selector:</strong> {selectedElement.selector}</p>
          <p><strong>Text:</strong> {selectedElement.innerText}</p>
        </div>
      )}
    </div>
  );
}
```

**React Versions**: ✅ 16.8+ (Hooks), 18.x

</details>

<details>
<summary><strong>Next.js</strong></summary>

**App Directory (Client Component)**:

```tsx
'use client';

import { Inspector } from '@devlens/inspector';
import { useEffect, useRef } from 'react';

export default function InspectorButton() {
  const inspectorRef = useRef<Inspector>();

  useEffect(() => {
    // Only runs on client side
    inspectorRef.current = new Inspector({
      onElementClick: (element) => {
        console.log('Inspected:', element);
      }
    });

    return () => inspectorRef.current?.deactivate();
  }, []);

  return (
    <button onClick={() => inspectorRef.current?.activate()}>
      Inspect Element
    </button>
  );
}
```

**Pages Directory**:

```tsx
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues
const InspectorButton = dynamic(
  () => import('@/components/InspectorButton'),
  { ssr: false }
);

export default function Page() {
  return <InspectorButton />;
}
```

**Next.js Versions**: ✅ 12.x, 13.x, 14.x, 15.x

</details>

<details>
<summary><strong>Svelte</strong></summary>

```svelte
<script lang="ts">
  import { Inspector, type InspectedElement } from '@devlens/inspector';
  import { onMount, onDestroy } from 'svelte';

  let inspector: Inspector;
  let selectedElement: InspectedElement | null = null;

  onMount(() => {
    inspector = new Inspector({
      onElementClick: (element) => {
        selectedElement = element;
      }
    });
  });

  onDestroy(() => {
    inspector?.deactivate();
  });

  function activate() {
    inspector.activate();
  }
</script>

<button on:click={activate}>
  🔍 Inspect Element
</button>

{#if selectedElement}
  <div class="result">
    <h3>Selected: {selectedElement.tagName}</h3>
    <p>Selector: {selectedElement.selector}</p>
  </div>
{/if}
```

**Svelte Versions**: ✅ 3.x, 4.x, 5.x
**SvelteKit**: ✅ Fully compatible

</details>

<details>
<summary><strong>Vue</strong></summary>

**Vue 3 (Composition API)**:

```vue
<template>
  <div>
    <button @click="activate">🔍 Inspect Element</button>

    <div v-if="selectedElement">
      <h3>Selected: {{ selectedElement.tagName }}</h3>
      <p>Selector: {{ selectedElement.selector }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Inspector, type InspectedElement } from '@devlens/inspector';
import { ref, onMounted, onUnmounted } from 'vue';

const selectedElement = ref<InspectedElement | null>(null);
let inspector: Inspector;

onMounted(() => {
  inspector = new Inspector({
    onElementClick: (element) => {
      selectedElement.value = element;
    }
  });
});

onUnmounted(() => {
  inspector?.deactivate();
});

function activate() {
  inspector?.activate();
}
</script>
```

**Vue Versions**: ✅ 2.7+, 3.x
**Nuxt.js**: ✅ 2.x, 3.x (use client-only component)

</details>

<details>
<summary><strong>Angular</strong></summary>

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Inspector, InspectedElement } from '@devlens/inspector';

@Component({
  selector: 'app-inspector',
  template: `
    <button (click)="activate()">🔍 Inspect Element</button>

    <div *ngIf="selectedElement">
      <h3>Selected: {{ selectedElement.tagName }}</h3>
      <p>Selector: {{ selectedElement.selector }}</p>
    </div>
  `
})
export class InspectorComponent implements OnInit, OnDestroy {
  private inspector?: Inspector;
  selectedElement?: InspectedElement;

  ngOnInit() {
    this.inspector = new Inspector({
      onElementClick: (element) => {
        this.selectedElement = element;
      }
    });
  }

  ngOnDestroy() {
    this.inspector?.deactivate();
  }

  activate() {
    this.inspector?.activate();
  }
}
```

**Angular Versions**: ✅ 12+, 13+, 14+, 15+, 16+, 17+

</details>

<details>
<summary><strong>Solid.js</strong></summary>

```tsx
import { Inspector, type InspectedElement } from '@devlens/inspector';
import { createSignal, onMount, onCleanup } from 'solid-js';

function InspectorComponent() {
  const [selectedElement, setSelectedElement] = createSignal<InspectedElement | null>(null);
  let inspector: Inspector;

  onMount(() => {
    inspector = new Inspector({
      onElementClick: (element) => {
        setSelectedElement(element);
      }
    });
  });

  onCleanup(() => {
    inspector?.deactivate();
  });

  return (
    <div>
      <button onClick={() => inspector.activate()}>
        🔍 Inspect Element
      </button>

      {selectedElement() && (
        <div>
          <h3>Selected: {selectedElement()!.tagName}</h3>
        </div>
      )}
    </div>
  );
}
```

**Solid.js Versions**: ✅ 1.x

</details>

<details>
<summary><strong>Preact</strong></summary>

```tsx
import { Inspector, type InspectedElement } from '@devlens/inspector';
import { useEffect, useRef, useState } from 'preact/hooks';

function InspectorComponent() {
  const inspectorRef = useRef<Inspector>();
  const [selected, setSelected] = useState<InspectedElement | null>(null);

  useEffect(() => {
    inspectorRef.current = new Inspector({
      onElementClick: (element) => setSelected(element)
    });

    return () => inspectorRef.current?.deactivate();
  }, []);

  return (
    <button onClick={() => inspectorRef.current?.activate()}>
      Inspect
    </button>
  );
}
```

**Preact Versions**: ✅ 10.x

</details>

<details>
<summary><strong>Vanilla JavaScript/TypeScript</strong></summary>

**No framework needed!**

```javascript
import { Inspector } from '@devlens/inspector';

const inspector = new Inspector({
  onElementClick: (element) => {
    document.getElementById('output').textContent =
      `Selected: ${element.tagName} (${element.selector})`;
  }
});

document.getElementById('inspect-btn').addEventListener('click', () => {
  inspector.activate();
});
```

**Browser Support**: ✅ Modern browsers (ES2020+)

</details>

---

### ✅ **Meta-Frameworks & Build Tools**

<details>
<summary><strong>Vite</strong></summary>

```typescript
import { Inspector } from '@devlens/inspector';
// Works out of the box with Vite
```

**Vite Versions**: ✅ 3.x, 4.x, 5.x

</details>

<details>
<summary><strong>Webpack</strong></summary>

```typescript
import { Inspector } from '@devlens/inspector';
// Works with Webpack 5+ (ESM support)
```

**Webpack Versions**: ✅ 4.x (with ESM plugin), 5.x

</details>

<details>
<summary><strong>Parcel</strong></summary>

```typescript
import { Inspector } from '@devlens/inspector';
// Works out of the box
```

**Parcel Versions**: ✅ 2.x

</details>

<details>
<summary><strong>Rollup</strong></summary>

```typescript
import { Inspector } from '@devlens/inspector';
// Native ESM support
```

**Rollup Versions**: ✅ 2.x, 3.x, 4.x

</details>

<details>
<summary><strong>esbuild</strong></summary>

```typescript
import { Inspector } from '@devlens/inspector';
// Fast bundling support
```

**esbuild Versions**: ✅ 0.14+

</details>

---

### ✅ **TanStack Ecosystem**

<details>
<summary><strong>TanStack Query (React Query)</strong></summary>

```tsx
import { Inspector } from '@devlens/inspector';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';

function InspectorWithQuery() {
  const inspector = useRef<Inspector>();
  const queryClient = useQueryClient();

  useEffect(() => {
    inspector.current = new Inspector({
      onElementClick: (element) => {
        // Store inspected element in React Query cache
        queryClient.setQueryData(['lastInspected'], element);
      }
    });
  }, []);

  // Query the last inspected element
  const { data: lastInspected } = useQuery({
    queryKey: ['lastInspected'],
    enabled: false
  });

  return (
    <button onClick={() => inspector.current?.activate()}>
      Inspect Element
    </button>
  );
}
```

**TanStack Query Versions**: ✅ 4.x, 5.x

</details>

<details>
<summary><strong>TanStack Router</strong></summary>

```tsx
import { Inspector } from '@devlens/inspector';
import { useRouter } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

function RouteInspector() {
  const router = useRouter();
  const inspector = useRef<Inspector>();

  useEffect(() => {
    inspector.current = new Inspector({
      onElementClick: (element) => {
        // Navigate to inspector route with element data
        router.navigate({
          to: '/inspector/$elementId',
          params: { elementId: element.selector }
        });
      }
    });
  }, []);

  return <button onClick={() => inspector.current?.activate()}>Inspect</button>;
}
```

**TanStack Router Versions**: ✅ 1.x

</details>

<details>
<summary><strong>TanStack Table</strong></summary>

```tsx
import { Inspector } from '@devlens/inspector';
import { useReactTable } from '@tanstack/react-table';

function TableWithInspector() {
  const inspector = useRef<Inspector>();

  const handleInspectCell = () => {
    inspector.current = new Inspector({
      onElementClick: (element) => {
        // Inspect table cells, rows, or headers
        console.log('Table element:', element);
      },
      behavior: {
        // Only inspect table elements
        includeSelectors: ['td', 'th', 'tr']
      }
    });
    inspector.current.activate();
  };

  return (
    <button onClick={handleInspectCell}>
      Inspect Table Cells
    </button>
  );
}
```

**TanStack Table Versions**: ✅ 8.x

</details>

---

### ✅ **Desktop Apps**

<details>
<summary><strong>Electron</strong></summary>

**Renderer Process**:

```typescript
import { Inspector } from '@devlens/inspector';

const inspector = new Inspector({
  onElementClick: (element) => {
    // Send to main process via IPC
    window.electronAPI.sendInspectedElement(element);
  }
});

inspector.activate();
```

**Electron Versions**: ✅ 20+, 21+, 22+, 23+, 24+, 25+

</details>

<details>
<summary><strong>Tauri</strong></summary>

```typescript
import { Inspector } from '@devlens/inspector';
import { invoke } from '@tauri-apps/api/tauri';

const inspector = new Inspector({
  onElementClick: async (element) => {
    // Send to Rust backend
    await invoke('handle_inspected_element', { element });
  }
});
```

**Tauri Versions**: ✅ 1.x, 2.x

</details>

<details>
<summary><strong>NW.js</strong></summary>

```typescript
import { Inspector } from '@devlens/inspector';

const inspector = new Inspector({
  onElementClick: (element) => {
    // Access Node.js APIs directly
    require('fs').writeFileSync('inspected.json', JSON.stringify(element));
  }
});
```

**NW.js Versions**: ✅ 0.70+

</details>

---

### ✅ **IDE Extensions**

<details>
<summary><strong>VSCode Extensions</strong></summary>

**Webview Content**:

```typescript
import { Inspector } from '@devlens/inspector';

const vscode = acquireVsCodeApi();

const inspector = new Inspector({
  onElementClick: (element) => {
    // Send to extension host
    vscode.postMessage({
      type: 'elementInspected',
      data: {
        selector: element.selector,
        tagName: element.tagName
      }
    });
  }
});

// Listen for activation from extension
window.addEventListener('message', (event) => {
  if (event.data.type === 'activate') {
    inspector.activate();
  }
});
```

**VSCode API**: ✅ 1.60+

</details>

<details>
<summary><strong>JetBrains IDEs (WebStorm, IntelliJ)</strong></summary>

Works in embedded browser panels:

```typescript
import { Inspector } from '@devlens/inspector';

const inspector = new Inspector({
  onElementClick: (element) => {
    // Communicate with IDE via custom protocol
    window.postMessage({ type: 'IDE_INSPECT', element }, '*');
  }
});
```

</details>

---

### ✅ **Testing Frameworks**

<details>
<summary><strong>Playwright</strong></summary>

```typescript
import { test, expect } from '@playwright/test';

test('inspect elements during test', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Inject inspector into page
  await page.addScriptTag({
    type: 'module',
    content: `
      import { Inspector } from '@devlens/inspector';
      window.inspector = new Inspector({
        onElementClick: (element) => {
          window.lastInspected = element;
        }
      });
    `
  });

  // Use inspector in tests
  await page.evaluate(() => window.inspector.activate());
});
```

**Playwright Versions**: ✅ 1.x

</details>

<details>
<summary><strong>Cypress</strong></summary>

```typescript
describe('Element Inspector', () => {
  it('inspects elements', () => {
    cy.visit('http://localhost:3000');

    // Inject and use inspector
    cy.window().then((win) => {
      // Import inspector in Cypress
      // (add as support file or inject via task)
    });
  });
});
```

**Cypress Versions**: ✅ 10.x, 11.x, 12.x, 13.x

</details>

<details>
<summary><strong>Puppeteer</strong></summary>

```typescript
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.evaluateOnNewDocument(() => {
  // Inject inspector into page context
  import('@devlens/inspector').then(({ Inspector }) => {
    window.inspector = new Inspector({
      onElementClick: (element) => console.log(element)
    });
  });
});
```

**Puppeteer Versions**: ✅ 19+, 20+, 21+

</details>

---

### ✅ **Static Site Generators**

<details>
<summary><strong>Astro</strong></summary>

**Client-side Component**:

```astro
---
// InspectorButton.astro
---

<button id="inspect-btn">🔍 Inspect Element</button>

<script>
  import { Inspector } from '@devlens/inspector';

  const inspector = new Inspector({
    onElementClick: (element) => {
      console.log('Inspected:', element);
    }
  });

  document.getElementById('inspect-btn')?.addEventListener('click', () => {
    inspector.activate();
  });
</script>
```

**Astro Versions**: ✅ 2.x, 3.x, 4.x

</details>

<details>
<summary><strong>Gatsby</strong></summary>

```tsx
import { Inspector } from '@devlens/inspector';
import { useEffect, useRef } from 'react';

export default function InspectorPage() {
  const inspector = useRef<Inspector>();

  useEffect(() => {
    inspector.current = new Inspector({
      onElementClick: (el) => console.log(el)
    });
  }, []);

  return <button onClick={() => inspector.current?.activate()}>Inspect</button>;
}
```

**Gatsby Versions**: ✅ 4.x, 5.x

</details>

<details>
<summary><strong>Remix</strong></summary>

```tsx
import { Inspector } from '@devlens/inspector';
import { useEffect, useRef } from 'react';

export default function InspectorRoute() {
  const inspector = useRef<Inspector>();

  useEffect(() => {
    inspector.current = new Inspector({
      onElementClick: (element) => console.log(element)
    });
  }, []);

  return <button onClick={() => inspector.current?.activate()}>Inspect</button>;
}
```

**Remix Versions**: ✅ 1.x, 2.x

</details>

<details>
<summary><strong>11ty (Eleventy)</strong></summary>

Add to your template:

```html
<button id="inspect">Inspect</button>

<script type="module">
  import { Inspector } from '@devlens/inspector';

  const inspector = new Inspector({
    onElementClick: (el) => console.log(el)
  });

  document.getElementById('inspect').onclick = () => inspector.activate();
</script>
```

**11ty Versions**: ✅ 2.x, 3.x

</details>

---

### ✅ **Other Environments**

<details>
<summary><strong>Bookmarklets</strong></summary>

```javascript
javascript:(function(){
  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = `
    import { Inspector } from 'https://unpkg.com/@devlens/inspector';
    const inspector = new Inspector({
      onElementClick: (el) => alert(el.selector)
    });
    inspector.activate();
  `;
  document.head.appendChild(script);
})();
```

</details>

<details>
<summary><strong>Browser DevTools Console</strong></summary>

```javascript
// Paste in console
const script = document.createElement('script');
script.src = 'https://unpkg.com/@devlens/inspector';
document.head.appendChild(script);

// Then use it
const inspector = new Inspector({ /* ... */ });
inspector.activate();
```

</details>

<details>
<summary><strong>Embedded Iframes</strong></summary>

```typescript
import { Inspector } from '@devlens/inspector';

// Works inside iframes
const inspector = new Inspector({
  onElementClick: (element) => {
    // Send to parent window
    window.parent.postMessage({
      type: 'IFRAME_ELEMENT_SELECTED',
      element
    }, '*');
  }
});
```

</details>

<details>
<summary><strong>Web Components</strong></summary>

```typescript
import { Inspector } from '@devlens/inspector';

class InspectorElement extends HTMLElement {
  private inspector: Inspector;

  connectedCallback() {
    this.inspector = new Inspector({
      onElementClick: (element) => {
        this.dispatchEvent(new CustomEvent('element-selected', {
          detail: element
        }));
      }
    });
  }

  activate() {
    this.inspector.activate();
  }
}

customElements.define('element-inspector', InspectorElement);
```

</details>

---

## 🎨 Full Customization

```typescript
const inspector = new Inspector({
  // Event handlers
  onElementClick: (element) => {
    console.log('Clicked:', element);
  },
  onElementHover: (element) => {
    console.log('Hovering:', element);
  },
  onActivate: () => {
    console.log('Inspector activated!');
  },
  onDeactivate: () => {
    console.log('Inspector deactivated!');
  },

  // Style customization
  styles: {
    crosshair: {
      enabled: true,
      color: '#00ff00',
      width: 3,
      opacity: 0.7
    },
    highlight: {
      borderColor: '#3b82f6',
      borderWidth: 3,
      borderStyle: 'dashed',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderRadius: '8px'
    },
    label: {
      enabled: true,
      backgroundColor: '#1f2937',
      textColor: '#10b981',
      fontSize: '14px',
      padding: '8px 12px',
      borderRadius: '6px',
      position: 'bottom',
      offset: 12,
      showSelector: true,
      showDimensions: true,
      // Custom template
      customTemplate: (element) => `
        <strong>${element.tagName}</strong><br/>
        ${element.selector}<br/>
        ${element.boundingRect.width}×${element.boundingRect.height}px
      `
    },
    cursor: 'crosshair',
    overlay: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      zIndex: 999999
    }
  },

  // Behavior configuration
  behavior: {
    stopPropagation: true,
    preventDefault: true,
    autoDeactivate: false,
    clickThreshold: 3,
    excludeSelectors: ['.navbar', '.footer'],
    includeSelectors: ['button', 'a', 'input'],
    captureKeys: ['Escape', 'q']
  }
});
```

---

## 📚 API Reference

### `Inspector` Class

#### Constructor

```typescript
new Inspector(config?: InspectorConfig)
```

#### Methods

- **`activate(): void`** - Activates inspector mode
- **`deactivate(): void`** - Deactivates inspector mode
- **`isInspectorActive(): boolean`** - Returns activation state
- **`updateConfig(config: Partial<InspectorConfig>): void`** - Updates configuration

### `InspectedElement` Type

```typescript
type InspectedElement = {
  tagName: string;              // HTML tag name (e.g., 'DIV')
  selector: string;             // CSS selector
  xpath: string;                // XPath selector
  innerText?: string;           // Text content
  innerHTML?: string;           // HTML content
  value?: string;               // For input elements
  boundingRect: DOMRect;        // Element bounds
  computedStyle: CSSStyleDeclaration; // Computed styles
  attributes: Record<string, string>; // All attributes
  classList: string[];          // CSS classes
  id?: string;                  // Element ID
  url: string;                  // Page URL
  timestamp: number;            // Click timestamp
  element: HTMLElement;         // DOM reference
}
```

### TypeScript Support

Full TypeScript definitions included with comprehensive JSDoc:

```typescript
import type {
  InspectorConfig,
  InspectedElement,
  InspectorStyles,
  InspectorBehavior,
  CrosshairStyles,
  HighlightStyles,
  LabelStyles,
  OverlayStyles
} from '@devlens/inspector';
```

---

## 🌐 Browser Support

- ✅ **Chrome** 80+
- ✅ **Firefox** 74+
- ✅ **Safari** 13.1+
- ✅ **Edge** 80+
- ✅ **Opera** 67+

For older browsers, transpile with Babel.

---

## 📦 Bundle Formats

- **ESM** (`dist/index.esm.js`) - For modern bundlers
- **UMD** (`dist/index.js`) - For `<script>` tags or AMD
- **TypeScript** (`dist/index.d.ts`) - Type declarations

---

## 🤝 Contributing

Contributions are welcome! This is an open-source project.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Setup

```bash
# Clone the repo
git clone https://github.com/devlens/inspector.git
cd inspector

# Install dependencies
pnpm install

# Build the library
pnpm run build

# Run in watch mode
pnpm run dev

# Type check
pnpm run type-check

# Lint
pnpm run lint
```

---

## 📝 License

**MIT License**

Copyright (c) 2025 DevLens Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🔗 Links

- **[GitHub Repository](https://github.com/devlens/inspector)**
- **[NPM Package](https://www.npmjs.com/package/@devlens/inspector)**
- **[Issue Tracker](https://github.com/devlens/inspector/issues)**
- **[Changelog](https://github.com/devlens/inspector/releases)**

---

## 🌟 Show Your Support

If this library helped you, please consider:

- ⭐ **Star the repository** on GitHub
- 🐛 **Report issues** if you find any bugs
- 💡 **Suggest features** via GitHub Issues
- 🔀 **Contribute** code or documentation
- 📢 **Share** with others who might find it useful

---

## 💡 Inspiration

This library was extracted from the [DevLens Chrome Extension](https://github.com/devlens/devlens) to make element inspection functionality available to all developers, regardless of their framework or environment.

---

**Made with ❤️ by the DevLens Team**

**Open Source • MIT Licensed • TypeScript**
