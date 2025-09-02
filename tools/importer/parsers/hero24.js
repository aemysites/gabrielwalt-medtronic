/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      // Remove any surrounding quotes
      url = url.replace(/^['"]|['"]$/g, '');
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero24)'];

  // 2. Background image row
  // Find the first child with a background-image style
  let bgImageUrl = null;
  let bgDiv = null;
  const divs = element.querySelectorAll(':scope > div');
  for (const div of divs) {
    const style = div.getAttribute('style');
    bgImageUrl = getBackgroundImageUrl(style);
    if (bgImageUrl) {
      bgDiv = div;
      break;
    }
  }

  let imageEl = null;
  if (bgImageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = bgImageUrl;
    imageEl.alt = '';
    imageEl.setAttribute('loading', 'eager');
    imageEl.style.width = '100%';
  }
  const bgRow = [imageEl ? imageEl : ''];

  // 3. Content row
  // Find the text and title elements inside the nested structure
  let contentEls = [];
  // Find the deepest .cmp-container
  let contentContainer = element.querySelector('.cmp-container .aem-Grid');
  if (contentContainer) {
    // Get all direct children
    const children = contentContainer.querySelectorAll(':scope > div');
    for (const child of children) {
      // Only include text/title blocks
      if (
        child.classList.contains('text') ||
        child.classList.contains('title')
      ) {
        // Find the actual content inside
        const cmpText = child.querySelector('.cmp-text');
        const cmpTitle = child.querySelector('.cmp-title');
        if (cmpText) {
          contentEls.push(cmpText);
        } else if (cmpTitle) {
          contentEls.push(cmpTitle);
        }
      }
    }
  }
  const contentRow = [contentEls];

  // Compose table
  const cells = [headerRow, bgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
