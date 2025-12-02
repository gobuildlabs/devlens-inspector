/**
 * Represents an inspected element with all its metadata
 */
export type InspectedElement = {
  /** The HTML tag name (e.g., 'DIV', 'BUTTON') */
  tagName: string;

  /** CSS selector for the element */
  selector: string;

  /** XPath selector for the element */
  xpath: string;

  /** Text content of the element */
  innerText?: string;

  /** HTML content of the element */
  innerHTML?: string;

  /** Value for input elements */
  value?: string;

  /** Element's bounding rectangle */
  boundingRect: DOMRect;

  /** Computed CSS styles */
  computedStyle: CSSStyleDeclaration;

  /** All HTML attributes as key-value pairs */
  attributes: Record<string, string>;

  /** Array of CSS class names */
  classList: string[];

  /** Element ID if present */
  id?: string;

  /** Current page URL */
  url: string;

  /** Timestamp when element was clicked */
  timestamp: number;

  /** Reference to the actual DOM element */
  element: HTMLElement;
};

/**
 * Configuration options for the Inspector instance
 */
export type InspectorConfig = {
  /**
   * Callback invoked when an element is clicked
   * @param element The inspected element data
   */
  onElementClick?: (element: InspectedElement) => void;

  /**
   * Callback invoked when an element is hovered
   * @param element The inspected element data
   */
  onElementHover?: (element: InspectedElement) => void;

  /**
   * Callback invoked when inspector is activated
   */
  onActivate?: () => void;

  /**
   * Callback invoked when inspector is deactivated
   */
  onDeactivate?: () => void;

  /**
   * Style customization options
   * @default Default styling applied
   */
  styles?: InspectorStyles;

  /**
   * Behavior customization options
   * @default Default behavior applied
   */
  behavior?: InspectorBehavior;
};

/**
 * Style configuration for inspector UI elements
 */
export type InspectorStyles = {
  /**
   * Crosshair cursor styles
   * @default Enabled with red color
   */
  crosshair?: CrosshairStyles;

  /**
   * Element highlight styles
   * @default Red border with transparent background
   */
  highlight?: HighlightStyles;

  /**
   * Floating label styles
   * @default Dark background with white text
   */
  label?: LabelStyles;

  /**
   * CSS cursor style
   * @default 'crosshair'
   */
  cursor?: string;

  /**
   * Overlay backdrop styles
   * @default Semi-transparent black overlay
   */
  overlay?: OverlayStyles;
};

/**
 * Crosshair visual configuration
 */
export type CrosshairStyles = {
  /**
   * Whether crosshair is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Crosshair color (CSS color value)
   * @default '#ff0000'
   */
  color?: string;

  /**
   * Crosshair line width in pixels
   * @default 2
   */
  width?: number;

  /**
   * Crosshair opacity (0-1)
   * @default 0.5
   */
  opacity?: number;
};

/**
 * Element highlight border configuration
 */
export type HighlightStyles = {
  /**
   * Border color (CSS color value)
   * @default 'red'
   */
  borderColor?: string;

  /**
   * Border width in pixels
   * @default 2
   */
  borderWidth?: number;

  /**
   * Border style (solid, dashed, dotted)
   * @default 'solid'
   */
  borderStyle?: string;

  /**
   * Background color (CSS color value)
   * @default 'rgba(255, 0, 0, 0.1)'
   */
  backgroundColor?: string;

  /**
   * Border radius (CSS value)
   * @default '0'
   */
  borderRadius?: string;
};

/**
 * Floating label configuration
 */
export type LabelStyles = {
  /**
   * Whether label is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Label background color
   * @default '#333'
   */
  backgroundColor?: string;

  /**
   * Label text color
   * @default '#fff'
   */
  textColor?: string;

  /**
   * Font size (CSS value)
   * @default '12px'
   */
  fontSize?: string;

  /**
   * Padding (CSS value)
   * @default '4px 8px'
   */
  padding?: string;

  /**
   * Border radius (CSS value)
   * @default '4px'
   */
  borderRadius?: string;

  /**
   * Label position relative to element
   * @default 'top'
   */
  position?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Distance from element in pixels
   * @default 8
   */
  offset?: number;

  /**
   * Show CSS selector in label
   * @default true
   */
  showSelector?: boolean;

  /**
   * Show element dimensions in label
   * @default true
   */
  showDimensions?: boolean;

  /**
   * Custom template function for label content
   * @param element The inspected element
   * @returns HTML string for label content
   */
  customTemplate?: (element: InspectedElement) => string;
};

/**
 * Overlay backdrop configuration
 */
export type OverlayStyles = {
  /**
   * Whether overlay is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Overlay background color
   * @default 'rgba(0, 0, 0, 0.1)'
   */
  backgroundColor?: string;

  /**
   * CSS z-index value
   * @default 999999
   */
  zIndex?: number;
};

/**
 * Inspector behavior configuration
 */
export type InspectorBehavior = {
  /**
   * Stop event propagation on click
   * @default true
   */
  stopPropagation?: boolean;

  /**
   * Prevent default click behavior
   * @default true
   */
  preventDefault?: boolean;

  /**
   * Automatically deactivate after first click
   * @default true
   */
  autoDeactivate?: boolean;

  /**
   * Number of clicks before auto-deactivating
   * @default 1
   */
  clickThreshold?: number;

  /**
   * CSS selectors to exclude from inspection
   * @default []
   */
  excludeSelectors?: string[];

  /**
   * CSS selectors to include in inspection
   * @default ['*']
   */
  includeSelectors?: string[];

  /**
   * Keyboard keys that trigger deactivation
   * @default ['Escape']
   */
  captureKeys?: string[];
};
