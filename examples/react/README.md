# DevLens Inspector - React (Next.js) Example

This example demonstrates how to use the DevLens Inspector library in a React application with Next.js 16.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Click the "Click me" button to activate the inspector

## Features

- **Next.js 16 App Router**: Uses the latest Next.js with App Router
- **Client-side Only**: Inspector runs only on the client side
- **React Hooks**: Proper lifecycle management with `useEffect` and `useRef`
- **TypeScript**: Full type safety
- **Tailwind CSS**: Styled with Tailwind

## Usage

```tsx
'use client';

import { Inspector } from '@gobuildlabs/devlens-inspector';
import { useEffect, useRef } from 'react';

export default function Home() {
  const inspectorRef = useRef<Inspector | null>(null);

  useEffect(() => {
    inspectorRef.current = new Inspector({
      onElementClick: (element) => {
        console.log('Clicked:', element);
      }
    });

    return () => inspectorRef.current?.deactivate();
  }, []);

  return (
    <button onClick={() => inspectorRef.current?.activate()}>
      Activate Inspector
    </button>
  );
}
```

## Important Notes

- The inspector must be initialized in a `'use client'` component
- Use `useRef` to store the inspector instance
- Clean up by calling `deactivate()` in the cleanup function
- The inspector only works in the browser (client-side)
