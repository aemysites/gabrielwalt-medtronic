/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from style attribute
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1]
        .replace(/\\2f/g, '/') // Replace unicode \2f with /
        .replace(/\s/g, '')     // Remove spaces
        .replace(/\\/g, '');  // Remove remaining backslashes
      url = url.replace(/^['"]|['"]$/g, '');
      // If relative, prepend origin
      if (url.startsWith('/')) {
        url = document.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // Find the cmp-container with background-image
  const bgContainer = element.querySelector('[class*="cmp-container"][style*="background-image"]');
  let bgImgUrl = null;
  if (bgContainer) {
    bgImgUrl = getBackgroundImageUrl(bgContainer);
  }

  // Create image element for background
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }

  // Find content elements
  const cmpTextPs = element.querySelectorAll('.cmp-text p');
  const eyebrow = cmpTextPs[0] || null;
  const mainHeading = cmpTextPs[1] || null;
  const title = element.querySelector('.cmp-title .cmp-title__text');
  const button = element.querySelector('.cmp-button');

  // Compose content cell
  const contentFragments = [];
  if (eyebrow) {
    contentFragments.push(eyebrow);
  }
  if (mainHeading) {
    const h2 = document.createElement('h2');
    h2.innerHTML = mainHeading.innerHTML;
    contentFragments.push(h2);
  }
  if (title) {
    contentFragments.push(title);
  }
  if (button) {
    contentFragments.push(button);
  }

  // Table rows
  const headerRow = ['Hero (hero26)'];
  const imageRow = [bgImgEl ? bgImgEl : ''];
  const contentRow = [contentFragments];

  const cells = [headerRow, imageRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
