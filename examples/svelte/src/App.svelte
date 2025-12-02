<script>
  import { onMount } from 'svelte';
  import { Inspector } from '@gobuildlabs/devlens-inspector';

  let inspector;
  let isActive = false;
  let lastClicked = 'None';

  onMount(() => {
    inspector = new Inspector({
      onElementClick: (element) => {
        console.log('Element clicked:', element);
        lastClicked = element.selector;
      },
      onElementHover: (element) => {
        console.log('Element hovered:', element);
      },
      onActivate: () => {
        console.log('Inspector activated');
        isActive = true;
      },
      onDeactivate: () => {
        console.log('Inspector deactivated');
        isActive = false;
      },
    });

    // Keyboard shortcut
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        toggleInspector();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (inspector) {
        inspector.deactivate();
      }
    };
  });

  function activateInspector() {
    if (inspector) inspector.activate();
  }

  function deactivateInspector() {
    if (inspector) inspector.deactivate();
  }

  function toggleInspector() {
    if (inspector) {
      if (inspector.isInspectorActive()) {
        inspector.deactivate();
      } else {
        inspector.activate();
      }
    }
  }
</script>

<main>
  <div class="container">
    <header>
      <h1>🔍 DevLens Inspector</h1>
      <p class="subtitle">Svelte Example</p>
    </header>

    <div class="controls">
      <h2>Inspector Controls</h2>
      <div class="button-group">
        <button class="btn-primary" on:click={activateInspector}>
          Activate Inspector
        </button>
        <button class="btn-secondary" on:click={deactivateInspector}>
          Deactivate Inspector
        </button>
        <button class="btn-danger" on:click={toggleInspector}>
          Toggle Inspector
        </button>
      </div>
      <div class="status">
        <strong>Status:</strong>
        <span class:active={isActive} class:inactive={!isActive}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div class="status">
        <strong>Last Clicked:</strong>
        <code>{lastClicked}</code>
      </div>
    </div>

    <div class="demo-section">
      <h2>Try Inspecting These Elements</h2>
      <p class="description">
        Click "Activate Inspector" above, then hover over and click any element below to inspect it.
      </p>

      <div class="card-grid">
        <div class="card">
          <h3>Card 1</h3>
          <p>This is a demo card with rounded corners. Try inspecting it!</p>
        </div>
        <div class="card">
          <h3>Card 2</h3>
          <p>Hover over me to see the inspector highlight my border radius.</p>
        </div>
        <div class="card">
          <h3>Card 3</h3>
          <p>Click on me while the inspector is active to see my details.</p>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 40px 20px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  header {
    text-align: center;
    color: white;
    margin-bottom: 60px;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
  }

  .controls {
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    margin-bottom: 40px;
  }

  .controls h2 {
    margin-bottom: 20px;
    color: #2d3748;
  }

  .button-group {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  button {
    padding: 14px 28px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
  }

  .btn-primary {
    background: #667eea;
    color: white;
  }

  .btn-primary:hover {
    background: #5568d3;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: #48bb78;
    color: white;
  }

  .btn-secondary:hover {
    background: #38a169;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(72, 187, 120, 0.4);
  }

  .btn-danger {
    background: #f56565;
    color: white;
  }

  .btn-danger:hover {
    background: #e53e3e;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(245, 101, 101, 0.4);
  }

  .status {
    margin-top: 20px;
    padding: 16px;
    background: #f7fafc;
    border-radius: 8px;
    border-left: 4px solid #667eea;
  }

  .status strong {
    color: #667eea;
  }

  .active {
    color: #48bb78;
  }

  .inactive {
    color: #f56565;
  }

  code {
    background: #2d3748;
    color: #68d391;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  .demo-section {
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .demo-section h2 {
    font-size: 1.75rem;
    margin-bottom: 24px;
    color: #2d3748;
  }

  .description {
    color: #718096;
    margin-bottom: 24px;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-top: 24px;
  }

  .card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 32px;
    border-radius: 12px;
    color: white;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }

  .card h3 {
    font-size: 1.5rem;
    margin-bottom: 12px;
  }

  .card p {
    opacity: 0.9;
    line-height: 1.6;
  }
</style>
