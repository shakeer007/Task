// Component loader - fetches and injects HTML components

/**
 * Load a component into a container element
 * @param {string} containerId - ID of the container element
 * @param {string} componentPath - Path to the component HTML file (relative to HTML file)
 */
async function loadComponent(containerId, componentPath) {
  const container = document.getElementById(containerId);
  if (!container) {
    // Silently skip if container doesn't exist on this page
    return;
  }

  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }
    const html = await response.text();
    container.innerHTML = html;
    console.log(`Loaded component: ${componentPath}`);
  } catch (error) {
    console.error(`Failed to load component "${componentPath}":`, error);
    container.innerHTML = `<div class="component-error">⚠️ Failed to load component</div>`;
  }
}

/**
 * Load all components for the portfolio
 */
async function loadAllComponents() {
  // Define mapping of container IDs to component file paths
  const components = [
    { id: 'header', path: '../components/header.html' },
    { id: 'hero', path: '../components/hero.html' },
    { id: 'services', path: '../components/sections/services-section.html' },
    { id: 'testimonials', path: '../components/sections/testimonials-section.html' },
    { id: 'contact', path: '../components/sections/contact-section.html' },
    { id: 'footer', path: '../components/footer.html' },
    { id: 'about-content', path: '../components/about-content.html' },
    { id: 'services-content', path: '../components/services-content.html' },
    { id: 'blog-content', path: '../components/blog-content.html' },
    { id: 'contact-content', path: '../components/contact-content.html' },
    { id: 'projects-content', path: '../components/projects-content.html' },
    { id: 'skills-content', path: '../components/skills-content.html' }
  ];

  // Load all components that exist on the page
  const loadPromises = components.map(comp => loadComponent(comp.id, comp.path));
  await Promise.all(loadPromises);

  // After header is loaded, load the navbar into the header's nav container
  const headerContainer = document.getElementById('header');
  if (headerContainer) {
    // The navbar should be loaded inside the header's <nav id="navbar"> element
    const navElement = headerContainer.querySelector('#navbar');
    if (navElement) {
      try {
        const response = await fetch('../components/navbar.html');
        if (response.ok) {
          const navbarHtml = await response.text();
          navElement.innerHTML = navbarHtml;
          console.log('Loaded navbar component');
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to load navbar component:', error);
        navElement.innerHTML = '<div class="component-error">⚠️ Navbar failed to load</div>';
      }
    } else {
      // No <nav id="navbar"> found, maybe the header doesn't have it? (It should)
      console.warn('No <nav id="navbar"> found inside header container');
    }
  }

  // Wait a tiny bit to ensure the DOM is fully painted
setTimeout(() => {
  window.dispatchEvent(new CustomEvent('componentsLoaded'));
}, 50);

  // Dispatch event to notify that components are ready
  window.dispatchEvent(new CustomEvent('componentsLoaded'));
}

// Start loading components when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAllComponents);
} else {
  loadAllComponents();
}