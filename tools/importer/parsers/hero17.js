/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from inline style
  function extractBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      // Remove any leading \2f and decode URI components
      let url = match[1].replace(/\\2f\s*/g, '/').replace(/['"]/g, '');
      // Remove leading/trailing whitespace
      url = url.trim();
      // If the URL is relative, prepend the origin
      if (url.startsWith('/')) {
        try {
          url = new URL(url, document.location.origin).href;
        } catch (e) {
          // fallback: leave as is
        }
      }
      return url;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero17)'];

  // 2. Background image row
  let bgImgUrl = null;
  let bgImgEl = null;
  // The background image is on the first .cmp-container inside the main element
  const bgContainer = element.querySelector('.cmp-container');
  if (bgContainer && bgContainer.hasAttribute('style')) {
    bgImgUrl = extractBgImageUrl(bgContainer.getAttribute('style'));
    if (bgImgUrl) {
      bgImgEl = document.createElement('img');
      bgImgEl.src = bgImgUrl;
      // Optionally, set alt to empty (decorative)
      bgImgEl.alt = '';
    }
  }
  const bgImgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row (title, subheading, etc.)
  // Find the innermost .cmp-container (the one with the text)
  let contentContainer = null;
  const containers = element.querySelectorAll('.cmp-container');
  if (containers.length > 1) {
    contentContainer = containers[containers.length - 1];
  } else {
    contentContainer = containers[0];
  }
  // Defensive: fallback to element if not found
  if (!contentContainer) contentContainer = element;

  // Collect all direct text blocks inside contentContainer
  // We'll collect all .cmp-text blocks in order
  const textBlocks = contentContainer.querySelectorAll('.cmp-text');
  const contentEls = [];
  textBlocks.forEach(tb => {
    // Use the whole cmp-text div (preserves <p> and structure)
    contentEls.push(tb);
  });
  const contentRow = [contentEls];

  // Compose the table
  const cells = [headerRow, bgImgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
