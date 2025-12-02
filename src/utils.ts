import type { InspectedElement } from './types';

/**
 * Generates a unique CSS selector for an element
 * @param element The DOM element
 * @returns A unique CSS selector string
 */
export function generateSelector(element: HTMLElement): string {
  // If element has ID, use it
  if (element.id) {
    return `#${element.id}`;
  }

  // Build selector path from element to root
  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let selector = current.tagName.toLowerCase();

    // Add class if available
    if (current.className && typeof current.className === 'string') {
      const classes = current.className.trim().split(/\s+/).filter(Boolean);
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }

    // Add nth-child if needed for uniqueness
    if (current.parentElement) {
      const siblings = Array.from(current.parentElement.children);
      const index = siblings.indexOf(current);
      if (siblings.length > 1) {
        selector += `:nth-child(${index + 1})`;
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ');
}

/**
 * Generates an XPath for an element
 * @param element The DOM element
 * @returns An XPath string
 */
export function generateXPath(element: HTMLElement): string {
  if (element.id) {
    return `//*[@id="${element.id}"]`;
  }

  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let index = 1;
    let sibling: Element | null = current.previousElementSibling;

    while (sibling) {
      if (sibling.tagName === current.tagName) {
        index++;
      }
      sibling = sibling.previousElementSibling;
    }

    const tagName = current.tagName.toLowerCase();
    const xpathIndex = index > 1 ? `[${index}]` : '';
    path.unshift(`${tagName}${xpathIndex}`);
    current = current.parentElement;
  }

  return `/${path.join('/')}`;
}

/**
 * Extracts all attributes from an element
 * @param element The DOM element
 * @returns Object with attribute key-value pairs
 */
export function getElementAttributes(element: HTMLElement): Record<string, string> {
  const attributes: Record<string, string> = {};

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    if (attr) {
      attributes[attr.name] = attr.value;
    }
  }

  return attributes;
}

/**
 * Creates an InspectedElement object from a DOM element
 * @param element The DOM element to inspect
 * @returns InspectedElement object with all metadata
 */
export function createInspectedElement(element: HTMLElement): InspectedElement {
  const computedStyle = window.getComputedStyle(element);
  const boundingRect = element.getBoundingClientRect();

  return {
    tagName: element.tagName,
    selector: generateSelector(element),
    xpath: generateXPath(element),
    innerText: element.innerText,
    innerHTML: element.innerHTML,
    value: element instanceof HTMLInputElement ? element.value : undefined,
    boundingRect: boundingRect,
    computedStyle: computedStyle,
    attributes: getElementAttributes(element),
    classList: Array.from(element.classList),
    id: element.id || undefined,
    url: window.location.href,
    timestamp: Date.now(),
    element: element,
  };
}

/**
 * Checks if an element matches any of the given selectors
 * @param element The DOM element
 * @param selectors Array of CSS selectors
 * @returns True if element matches any selector
 */
export function matchesAnySelector(element: HTMLElement, selectors: string[]): boolean {
  return selectors.some(selector => {
    try {
      return element.matches(selector);
    } catch {
      // Invalid selector, ignore
      return false;
    }
  });
}

/**
 * Sanitizes a CSS color value
 * @param color The color value to sanitize
 * @param defaultColor Fallback color if invalid
 * @returns Sanitized color value
 */
export function sanitizeColor(color: string, defaultColor: string): string {
  // Allow hex colors
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (hexPattern.test(color)) {
    return color;
  }

  // Allow rgb/rgba
  const rgbPattern = /^rgba?\([^)]+\)$/;
  if (rgbPattern.test(color)) {
    return color;
  }

  // Allow named colors (basic validation)
  const namedColors = ['red', 'blue', 'green', 'black', 'white', 'yellow', 'orange', 'purple', 'pink', 'gray', 'transparent'];
  if (namedColors.includes(color.toLowerCase())) {
    return color;
  }

  return defaultColor;
}

/**
 * Sanitizes a numeric value within a range
 * @param value The value to sanitize
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @param defaultValue Fallback value if invalid
 * @returns Sanitized numeric value
 */
export function sanitizeNumber(
  value: number,
  min: number,
  max: number,
  defaultValue: number
): number {
  const num = Number(value);
  if (isNaN(num)) {
    return defaultValue;
  }
  return Math.min(Math.max(num, min), max);
}

/**
 * Injects CSS styles into the document
 * @param css CSS string to inject
 * @param id Unique ID for the style element
 * @returns The created style element
 */
export function injectStyles(css: string, id: string): HTMLStyleElement {
  // Remove existing style element if present
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);

  return style;
}

/**
 * Removes injected styles from the document
 * @param id The ID of the style element to remove
 */
export function removeStyles(id: string): void {
  const style = document.getElementById(id);
  if (style) {
    style.remove();
  }
}
