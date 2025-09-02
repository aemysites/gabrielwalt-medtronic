/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image from inline style
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1]
        .replace(/\\2f/g, '/')
        .replace(/\\/g, '')
        .replace(/\s/g, ''); // remove spaces
      // Remove any surrounding quotes
      url = url.replace(/^['"]|['"]$/g, '');
      // Remove any whitespace
      url = url.trim();
      // Remove any spaces in the path
      url = url.replace(/\s+/g, '');
      return url;
    }
    return null;
  }

  // Find the background image container
  const bgContainer = element.querySelector('[style*="background-image"]');
  let imageCell = '';
  if (bgContainer) {
    const imgUrl = getBackgroundImageUrl(bgContainer);
    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = '';
      imageCell = img;
    }
  }

  // Find the inner content container (with text/button)
  let contentContainer = null;
  const containers = element.querySelectorAll('.cmp-container');
  if (containers.length > 1) {
    contentContainer = containers[containers.length - 1];
  } else if (containers.length === 1) {
    contentContainer = containers[0];
  }

  // Gather content rows and clean up unnecessary wrappers/classes
  let contentCell = '';
  if (contentContainer) {
    const grid = contentContainer.querySelector('.aem-Grid');
    if (grid) {
      // Extract eyebrow, heading, subheading, and button
      const eyebrow = grid.querySelector('.eyebrow2 p');
      const heading = grid.querySelector('.h1 p');
      const subheading = grid.querySelector('h4');
      const button = grid.querySelector('a.cmp-button');
      // Compose a fragment
      const frag = document.createDocumentFragment();
      if (eyebrow) {
        const eyebrowClone = document.createElement('p');
        eyebrowClone.textContent = eyebrow.textContent;
        frag.appendChild(eyebrowClone);
      }
      if (heading) {
        const h1 = document.createElement('h1');
        h1.textContent = heading.textContent;
        frag.appendChild(h1);
      }
      if (subheading) {
        const subheadingClone = document.createElement('h4');
        subheadingClone.innerHTML = subheading.innerHTML;
        frag.appendChild(subheadingClone);
      }
      if (button) {
        const btn = button.cloneNode(true);
        frag.appendChild(btn);
      }
      contentCell = frag;
    }
  }

  const headerRow = ['Hero (hero20)'];
  const imageRow = [imageCell];
  const contentRow = [contentCell];
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
