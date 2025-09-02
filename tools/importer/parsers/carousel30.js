/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image url from inline style
  function extractBgUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      // Remove any escaped chars (e.g. \2f for /)
      let url = match[1].replace(/\\([0-9a-f]{2})/gi, (m, code) => String.fromCharCode(parseInt(code, 16)));
      // Remove any surrounding quotes
      url = url.replace(/^['"]|['"]$/g, '');
      // Remove any spaces from accidental extraction
      url = url.replace(/\s+/g, '');
      return url;
    }
    return null;
  }

  // 1. Find the slide container with background image
  const bgContainer = element.querySelector('.cmp-container[style*="background-image"]');
  const bgUrl = bgContainer ? extractBgUrl(bgContainer.getAttribute('style')) : null;

  // 2. Create image element for the slide
  let imgEl = null;
  if (bgUrl) {
    imgEl = document.createElement('img');
    imgEl.src = bgUrl;
    imgEl.alt = '';
  }

  // 3. Find the text content (title, description, CTA)
  let textContent = document.createElement('div');
  const eyebrow = element.querySelector('.cmp-text p');
  if (eyebrow) textContent.appendChild(eyebrow.cloneNode(true));
  const title = element.querySelector('.cmp-title h2');
  if (title) textContent.appendChild(title.cloneNode(true));
  const desc = element.querySelector('.cmp-text h4');
  if (desc) textContent.appendChild(desc.cloneNode(true));
  const cta = element.querySelector('.cmp-button');
  if (cta) textContent.appendChild(cta.cloneNode(true));
  if (!textContent.hasChildNodes()) textContent = null;

  const headerRow = ['Carousel (carousel30)'];
  const slideRow = [imgEl, textContent];
  const rows = [headerRow, slideRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
