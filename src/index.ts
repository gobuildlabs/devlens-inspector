/**
 * @gobuildlabs/devlens-inspector
 * Framework-agnostic TypeScript element inspector for web applications
 *
 * @author DevLens Team
 * @license MIT
 */

// Main Inspector class
export { Inspector } from './inspector';

// Type definitions
export type {
  InspectedElement,
  InspectorConfig,
  InspectorStyles,
  InspectorBehavior,
  CrosshairStyles,
  HighlightStyles,
  LabelStyles,
  OverlayStyles,
} from './types';

// Utility functions (for advanced usage)
export {
  generateSelector,
  generateXPath,
  getElementAttributes,
  createInspectedElement,
  matchesAnySelector,
  sanitizeColor,
  sanitizeNumber,
} from './utils';
