'use client';

import Image from "next/image";
import { Inspector } from '@gobuildlabs/devlens-inspector';
import { useEffect, useRef } from 'react';

export default function Home() {

  const inspectorRef = useRef<Inspector | null>(null);

  useEffect(() => {
    // Only runs on client side
    inspectorRef.current = new Inspector({
      onElementClick: (element) => {
        console.log('Inspected Element:', {
          tagName: element.tagName,
          selector: element.selector,
          boundingRect: element.boundingRect
        });
      }
    });

    return () => inspectorRef.current?.deactivate();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex w-full flex-1 justify-center items-center gap-4 text-base font-medium sm:flex-row">
          <button
            className="flex hover:cursor-pointer h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            onClick={() => inspectorRef.current?.activate()}
          >
            Click me
          </button>
        </div>
      </main>
    </div>
  );
}
