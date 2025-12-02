import type {
  InspectorConfig,
  InspectedElement,
  InspectorBehavior,
  CrosshairStyles,
  HighlightStyles,
  LabelStyles,
  OverlayStyles,
} from './types';
import {
  createInspectedElement,
  matchesAnySelector,
  sanitizeColor,
  sanitizeNumber,
  injectStyles,
  removeStyles,
} from './utils';

/**
 * Default configuration values for the Inspector
 */
const DEFAULT_CONFIG = {
  onElementClick: () => {},
  onElementHover: () => {},
  onActivate: () => {},
  onDeactivate: () => {},
  styles: {
    crosshair: {
      enabled: true,
      color: '#ff0000',
      width: 2,
      opacity: 0.5,
    },
    highlight: {
      borderColor: 'red',
      borderWidth: 2,
      borderStyle: 'solid',
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      borderRadius: '0',
    },
    label: {
      enabled: true,
      backgroundColor: '#ff0000',
      textColor: '#ffffff',
      fontSize: '12px',
      padding: '4px 8px',
      borderRadius: '4px',
      position: 'top',
      offset: 8,
      showSelector: true,
      showDimensions: true,
    },
    cursor: 'crosshair',
    overlay: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      zIndex: 999999,
    },
  },
  behavior: {
    stopPropagation: true,
    preventDefault: true,
    autoDeactivate: true,
    clickThreshold: 1,
    excludeSelectors: [],
    includeSelectors: ['*'],
    captureKeys: ['Escape'],
  },
} as const;

type PrivateInspectorConfig = {
  onElementClick: (element: InspectedElement) => void;
  onElementHover: (element: InspectedElement) => void;
  onActivate: () => void;
  onDeactivate: () => void;
  styles: {
    crosshair: Required<CrosshairStyles>;
    highlight: Required<HighlightStyles>;
    label: Omit<Required<LabelStyles>, 'customTemplate'> & { customTemplate?: (element: InspectedElement) => string };
    cursor: string;
    overlay: Required<OverlayStyles>;
  };
  behavior: Required<InspectorBehavior>;
};

/**
 * Main Inspector class for element inspection
 */
export class Inspector {
  private config: PrivateInspectorConfig;
  private isActive = false;
  private overlay: HTMLDivElement | null = null;
  private highlightOverlay: HTMLDivElement | null = null;
  private crosshairV: HTMLDivElement | null = null;
  private crosshairH: HTMLDivElement | null = null;
  private highlightedElement: HTMLElement | null = null;
  private floatingLabel: HTMLDivElement | null = null;
  private clickCount = 0;

  // Bound event handlers
  private boundMouseMove: (event: MouseEvent) => void;
  private boundClick: (event: MouseEvent) => void;
  private boundKeyDown: (event: KeyboardEvent) => void;

  /**
   * Creates a new Inspector instance
   * @param config Configuration options
   */
  constructor(config: InspectorConfig = {}) {
    this.config = this.mergeConfig(config);

    // Bind event handlers
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundClick = this.handleClick.bind(this);
    this.boundKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Merges user config with defaults
   * @param config User configuration
   * @returns Merged configuration
   */
  private mergeConfig(config: InspectorConfig): PrivateInspectorConfig {
    return {
      onElementClick: config.onElementClick ?? DEFAULT_CONFIG.onElementClick,
      onElementHover: config.onElementHover ?? DEFAULT_CONFIG.onElementHover,
      onActivate: config.onActivate ?? DEFAULT_CONFIG.onActivate,
      onDeactivate: config.onDeactivate ?? DEFAULT_CONFIG.onDeactivate,
      styles: {
        crosshair: {
          enabled: config.styles?.crosshair?.enabled ?? DEFAULT_CONFIG.styles.crosshair.enabled,
          color: sanitizeColor(
            config.styles?.crosshair?.color ?? DEFAULT_CONFIG.styles.crosshair.color,
            DEFAULT_CONFIG.styles.crosshair.color
          ),
          width: sanitizeNumber(
            config.styles?.crosshair?.width ?? DEFAULT_CONFIG.styles.crosshair.width,
            1,
            10,
            DEFAULT_CONFIG.styles.crosshair.width
          ),
          opacity: sanitizeNumber(
            config.styles?.crosshair?.opacity ?? DEFAULT_CONFIG.styles.crosshair.opacity,
            0,
            1,
            DEFAULT_CONFIG.styles.crosshair.opacity
          ),
        },
        highlight: {
          borderColor: sanitizeColor(
            config.styles?.highlight?.borderColor ?? DEFAULT_CONFIG.styles.highlight.borderColor,
            DEFAULT_CONFIG.styles.highlight.borderColor
          ),
          borderWidth: sanitizeNumber(
            config.styles?.highlight?.borderWidth ?? DEFAULT_CONFIG.styles.highlight.borderWidth,
            1,
            20,
            DEFAULT_CONFIG.styles.highlight.borderWidth
          ),
          borderStyle: config.styles?.highlight?.borderStyle ?? DEFAULT_CONFIG.styles.highlight.borderStyle,
          backgroundColor: sanitizeColor(
            config.styles?.highlight?.backgroundColor ?? DEFAULT_CONFIG.styles.highlight.backgroundColor,
            DEFAULT_CONFIG.styles.highlight.backgroundColor
          ),
          borderRadius: config.styles?.highlight?.borderRadius ?? DEFAULT_CONFIG.styles.highlight.borderRadius,
        },
        label: {
          enabled: config.styles?.label?.enabled ?? DEFAULT_CONFIG.styles.label.enabled,
          backgroundColor: sanitizeColor(
            config.styles?.label?.backgroundColor ?? DEFAULT_CONFIG.styles.label.backgroundColor,
            DEFAULT_CONFIG.styles.label.backgroundColor
          ),
          textColor: sanitizeColor(
            config.styles?.label?.textColor ?? DEFAULT_CONFIG.styles.label.textColor,
            DEFAULT_CONFIG.styles.label.textColor
          ),
          fontSize: config.styles?.label?.fontSize ?? DEFAULT_CONFIG.styles.label.fontSize,
          padding: config.styles?.label?.padding ?? DEFAULT_CONFIG.styles.label.padding,
          borderRadius: config.styles?.label?.borderRadius ?? DEFAULT_CONFIG.styles.label.borderRadius,
          position: config.styles?.label?.position ?? DEFAULT_CONFIG.styles.label.position,
          offset: sanitizeNumber(
            config.styles?.label?.offset ?? DEFAULT_CONFIG.styles.label.offset,
            0,
            100,
            DEFAULT_CONFIG.styles.label.offset
          ),
          showSelector: config.styles?.label?.showSelector ?? DEFAULT_CONFIG.styles.label.showSelector,
          showDimensions: config.styles?.label?.showDimensions ?? DEFAULT_CONFIG.styles.label.showDimensions,
          customTemplate: config.styles?.label?.customTemplate,
        },
        cursor: config.styles?.cursor ?? DEFAULT_CONFIG.styles.cursor,
        overlay: {
          enabled: config.styles?.overlay?.enabled ?? DEFAULT_CONFIG.styles.overlay.enabled,
          backgroundColor: sanitizeColor(
            config.styles?.overlay?.backgroundColor ?? DEFAULT_CONFIG.styles.overlay.backgroundColor,
            DEFAULT_CONFIG.styles.overlay.backgroundColor
          ),
          zIndex: sanitizeNumber(
            config.styles?.overlay?.zIndex ?? DEFAULT_CONFIG.styles.overlay.zIndex,
            1,
            9999999,
            DEFAULT_CONFIG.styles.overlay.zIndex
          ),
        },
      },
      behavior: {
        stopPropagation: config.behavior?.stopPropagation ?? DEFAULT_CONFIG.behavior.stopPropagation,
        preventDefault: config.behavior?.preventDefault ?? DEFAULT_CONFIG.behavior.preventDefault,
        autoDeactivate: config.behavior?.autoDeactivate ?? DEFAULT_CONFIG.behavior.autoDeactivate,
        clickThreshold: sanitizeNumber(
          config.behavior?.clickThreshold ?? DEFAULT_CONFIG.behavior.clickThreshold,
          1,
          100,
          DEFAULT_CONFIG.behavior.clickThreshold
        ),
        excludeSelectors: config.behavior?.excludeSelectors ?? [...DEFAULT_CONFIG.behavior.excludeSelectors],
        includeSelectors: config.behavior?.includeSelectors ?? [...DEFAULT_CONFIG.behavior.includeSelectors],
        captureKeys: config.behavior?.captureKeys ?? [...DEFAULT_CONFIG.behavior.captureKeys],
      },
    };
  }

  /**
   * Activates the inspector mode
   */
  public activate(): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.clickCount = 0;
    this.injectInspectorStyles();
    this.createOverlay();
    this.addEventListeners();
    this.config.onActivate();
  }

  /**
   * Deactivates the inspector mode
   */
  public deactivate(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    this.clickCount = 0;
    this.removeEventListeners();
    this.clearHighlight();
    this.removeOverlay();
    this.removeInspectorStyles();
    this.config.onDeactivate();
  }

  /**
   * Checks if the inspector is currently active
   * @returns True if active
   */
  public isInspectorActive(): boolean {
    return this.isActive;
  }

  /**
   * Updates the inspector configuration
   * @param config New configuration options
   */
  public updateConfig(config: Partial<InspectorConfig>): void {
    this.config = this.mergeConfig({ ...this.config, ...config });

    // Reapply styles if active
    if (this.isActive) {
      this.removeInspectorStyles();
      this.injectInspectorStyles();
    }
  }

  /**
   * Injects CSS styles for inspector UI
   */
  private injectInspectorStyles(): void {
    const crosshair = this.config.styles.crosshair;
    const highlight = this.config.styles.highlight;
    const label = this.config.styles.label;
    const overlay = this.config.styles.overlay;

    const css = `
      .devlens-inspector-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-color: ${overlay.backgroundColor} !important;
        pointer-events: none !important;
        z-index: ${overlay.zIndex} !important;
        cursor: ${this.config.styles.cursor} !important;
      }

      .devlens-inspector-crosshair {
        position: fixed !important;
        background-color: ${crosshair.color} !important;
        opacity: ${crosshair.opacity} !important;
        pointer-events: none !important;
        z-index: ${overlay.zIndex + 1} !important;
      }

      .devlens-inspector-crosshair-vertical {
        width: ${crosshair.width}px !important;
        height: 100vh !important;
      }

      .devlens-inspector-crosshair-horizontal {
        width: 100vw !important;
        height: ${crosshair.width}px !important;
      }

      .devlens-inspector-highlight-overlay {
        position: fixed !important;
        pointer-events: none !important;
        z-index: ${overlay.zIndex + 1} !important;
        border: ${highlight.borderWidth}px ${highlight.borderStyle} ${highlight.borderColor} !important;
        background-color: ${highlight.backgroundColor} !important;
        box-sizing: border-box !important;
        transition: all 0.1s ease-out !important;
      }

      .devlens-inspector-label {
        position: fixed !important;
        background-color: ${label.backgroundColor} !important;
        color: ${label.textColor} !important;
        padding: ${label.padding} !important;
        border-radius: ${label.borderRadius} !important;
        font-size: ${label.fontSize} !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        white-space: nowrap !important;
        z-index: ${overlay.zIndex + 2} !important;
        pointer-events: none !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
      }
    `;

    injectStyles(css, 'devlens-inspector-styles');
  }

  /**
   * Removes injected CSS styles
   */
  private removeInspectorStyles(): void {
    removeStyles('devlens-inspector-styles');
  }

  /**
   * Creates the overlay and UI elements
   */
  private createOverlay(): void {
    if (!this.config.styles.overlay.enabled) {
      return;
    }

    this.overlay = document.createElement('div');
    this.overlay.className = 'devlens-inspector-overlay';

    // Create highlight overlay
    this.highlightOverlay = document.createElement('div');
    this.highlightOverlay.className = 'devlens-inspector-highlight-overlay';
    this.highlightOverlay.style.display = 'none';
    this.overlay.appendChild(this.highlightOverlay);

    // Create crosshairs if enabled
    if (this.config.styles.crosshair.enabled) {
      this.crosshairV = document.createElement('div');
      this.crosshairV.className = 'devlens-inspector-crosshair devlens-inspector-crosshair-vertical';

      this.crosshairH = document.createElement('div');
      this.crosshairH.className = 'devlens-inspector-crosshair devlens-inspector-crosshair-horizontal';

      this.overlay.appendChild(this.crosshairV);
      this.overlay.appendChild(this.crosshairH);
    }

    document.body.appendChild(this.overlay);
  }

  /**
   * Removes the overlay
   */
  private removeOverlay(): void {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
      this.highlightOverlay = null;
      this.crosshairV = null;
      this.crosshairH = null;
    }
  }

  /**
   * Adds event listeners
   */
  private addEventListeners(): void {
    document.addEventListener('mousemove', this.boundMouseMove, true);
    document.addEventListener('click', this.boundClick, true);
    document.addEventListener('keydown', this.boundKeyDown, true);
  }

  /**
   * Removes event listeners
   */
  private removeEventListeners(): void {
    document.removeEventListener('mousemove', this.boundMouseMove, true);
    document.removeEventListener('click', this.boundClick, true);
    document.removeEventListener('keydown', this.boundKeyDown, true);
  }

  /**
   * Handles mouse move events
   * @param event Mouse event
   */
  private handleMouseMove(event: MouseEvent): void {
    // Update crosshair position
    if (this.crosshairV && this.crosshairH) {
      this.crosshairV.style.setProperty('left', `${event.clientX}px`, 'important');
      this.crosshairH.style.setProperty('top', `${event.clientY}px`, 'important');
    }

    // Find element at cursor
    let element = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;

    // Skip inspector elements
    while (
      element &&
      (element === this.overlay ||
        element === this.crosshairV ||
        element === this.crosshairH ||
        element === this.floatingLabel ||
        element === this.highlightOverlay ||
        element.classList.contains('devlens-inspector-overlay') ||
        element.classList.contains('devlens-inspector-crosshair') ||
        element.classList.contains('devlens-inspector-label') ||
        element.classList.contains('devlens-inspector-highlight-overlay'))
    ) {
      element = element.parentElement;
    }

    // Check if element should be inspected
    if (element && this.shouldInspectElement(element)) {
      this.clearHighlight();
      this.highlightElement(element);
      this.highlightedElement = element;

      // Fire hover callback
      const inspectedElement = createInspectedElement(element);
      this.config.onElementHover(inspectedElement);
    } else if (this.highlightedElement) {
      this.clearHighlight();
    }
  }

  /**
   * Handles click events
   * @param event Mouse event
   */
  private handleClick(event: MouseEvent): void {
    if (this.config.behavior.stopPropagation) {
      event.stopPropagation();
    }

    if (this.config.behavior.preventDefault) {
      event.preventDefault();
    }

    const element = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;

    // Handle clicking through overlay
    if (element && (element === this.overlay || element === this.highlightOverlay)) {
        this.overlay!.style.pointerEvents = 'none';
        const underlyingElement = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
        this.overlay!.style.pointerEvents = ''; // Restore

        if (underlyingElement && this.shouldInspectElement(underlyingElement)) {
            this.processClick(underlyingElement);
        }
        return;
    }

    if (element && this.shouldInspectElement(element)) {
      this.processClick(element);
    }
  }

  private processClick(element: HTMLElement): void {
      this.clickCount++;

      const inspectedElement = createInspectedElement(element);
      this.config.onElementClick(inspectedElement);

      // Auto-deactivate if threshold reached
      if (this.config.behavior.autoDeactivate && this.clickCount >= this.config.behavior.clickThreshold) {
        this.deactivate();
      }
  }

  /**
   * Handles keyboard events
   * @param event Keyboard event
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (this.config.behavior.captureKeys.includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      this.deactivate();
    }
  }

  /**
   * Checks if an element should be inspected
   * @param element The element to check
   * @returns True if element should be inspected
   */
  private shouldInspectElement(element: HTMLElement): boolean {
    // Skip body and html
    if (element === document.body || element === document.documentElement) {
      return false;
    }

    // Check exclude selectors
    if (this.config.behavior.excludeSelectors.length > 0) {
      if (matchesAnySelector(element, this.config.behavior.excludeSelectors)) {
        return false;
      }
    }

    // Check include selectors
    if (this.config.behavior.includeSelectors.length > 0) {
      return matchesAnySelector(element, this.config.behavior.includeSelectors);
    }

    return true;
  }

  /**
   * Highlights an element
   * @param element The element to highlight
   */
  private highlightElement(element: HTMLElement): void {
    if (!this.highlightOverlay) return;

    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    const borderRadius = computedStyle.borderRadius;

    this.highlightOverlay.style.display = 'block';
    this.highlightOverlay.style.top = `${rect.top}px`;
    this.highlightOverlay.style.left = `${rect.left}px`;
    this.highlightOverlay.style.width = `${rect.width}px`;
    this.highlightOverlay.style.height = `${rect.height}px`;
    this.highlightOverlay.style.borderRadius = borderRadius;

    // Create floating label if enabled
    if (this.config.styles.label.enabled) {
      this.createFloatingLabel(element);
    }
  }

  /**
   * Clears the current highlight
   */
  private clearHighlight(): void {
    if (this.highlightOverlay) {
      this.highlightOverlay.style.display = 'none';
    }
    this.highlightedElement = null;

    if (this.floatingLabel) {
      this.floatingLabel.remove();
      this.floatingLabel = null;
    }
  }

  /**
   * Creates a floating label for an element
   * @param element The element to label
   */
  private createFloatingLabel(element: HTMLElement): void {
    const label = this.config.styles.label;
    const rect = element.getBoundingClientRect();

    this.floatingLabel = document.createElement('div');
    this.floatingLabel.className = 'devlens-inspector-label';

    // Generate label content
    let content = '';

    if (label.customTemplate) {
      const inspectedElement = createInspectedElement(element);
      content = label.customTemplate(inspectedElement);
    } else {
      // Default: only show tag name
      content = element.tagName.toLowerCase();
    }

    this.floatingLabel.textContent = content;

    // Position label
    const offset = label.offset;
    let top = 0;
    let left = 0;

    switch (label.position) {
      case 'top':
        top = rect.top - offset - 24; // Approximate height of label
        left = rect.left;
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left;
        break;
      case 'left':
        top = rect.top;
        left = rect.left - offset; // Needs width calculation for exact positioning
        break;
      case 'right':
        top = rect.top;
        left = rect.right + offset;
        break;
    }

    // Ensure label stays within viewport
    if (top < 0) top = rect.bottom + offset;

    this.floatingLabel.style.setProperty('top', `${top}px`, 'important');
    this.floatingLabel.style.setProperty('left', `${left}px`, 'important');

    document.body.appendChild(this.floatingLabel);
  }
}
