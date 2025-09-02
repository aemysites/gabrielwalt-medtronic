/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image from style attribute
  function extractBackgroundImageUrl(el) {
    if (!el) return null;
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      url = url.replace(/^['"]|['"]$/g, ''); // Remove quotes
      return url;
    }
    return null;
  }

  // Find the cmp-container with background-image
  const bgContainer = element.querySelector('.cmp-container[style*="background-image"]');
  const bgUrl = extractBackgroundImageUrl(bgContainer);

  // Create image element if background image exists
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
  }

  // Find the main text container (contains headline and eyebrow)
  let headlineEl = null;
  let eyebrowEl = null;

  // Find all .cmp-text elements inside the block
  const textEls = element.querySelectorAll('.cmp-text');
  textEls.forEach((txt) => {
    // If contains h1, treat as headline
    if (txt.querySelector('h1')) {
      headlineEl = txt;
    } else {
      eyebrowEl = txt;
    }
  });

  // Compose content cell for row 3
  const contentCell = [];
  if (eyebrowEl) contentCell.push(eyebrowEl);
  if (headlineEl) contentCell.push(headlineEl);

  // Compose table rows
  const headerRow = ['Hero (hero11)'];
  const imageRow = [bgImgEl ? bgImgEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
