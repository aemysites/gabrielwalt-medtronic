/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Carousel (carousel28)'];

  // Defensive: Find the main image for the slide (background image)
  let imageCell = null;
  const bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv) {
    // Extract the background-image URL
    const style = bgDiv.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f/g, '/').replace(/\\/g, '');
      // Remove any spaces from the URL
      url = url.replace(/\s+/g, '');
      // If relative, make absolute (defensive: check document.location)
      if (url.startsWith('/')) {
        // Use a fallback origin if document.location.origin is not available
        let origin = '';
        if (document.location && document.location.origin) {
          origin = document.location.origin;
        } else if (typeof window !== 'undefined' && window.location && window.location.origin) {
          origin = window.location.origin;
        } else {
          origin = 'https://main--gabrielwalt-medtronic--aemysites.aem.page';
        }
        url = origin + url;
      }
      const img = document.createElement('img');
      img.src = url;
      img.alt = '';
      imageCell = img;
    }
  }

  // Defensive: Find the content block (circle area)
  let contentCell = null;
  const circleContent = element.querySelector('.circle-content');
  if (circleContent) {
    // Gather all relevant children in order
    const contentParts = [];
    // Eyebrow (optional)
    const eyebrow = circleContent.querySelector('.eyebrow2');
    if (eyebrow) contentParts.push(eyebrow);
    // Title (h2)
    const title = circleContent.querySelector('.title');
    if (title) contentParts.push(title);
    // Description (text)
    const desc = circleContent.querySelector('.text.no-bottom-margin-p');
    if (desc) contentParts.push(desc);
    // CTA button (optional)
    const button = circleContent.querySelector('.button');
    if (button) contentParts.push(button);
    // Compose cell
    contentCell = contentParts;
  }

  // Build the table rows
  const rows = [headerRow];
  rows.push([
    imageCell,
    contentCell
  ]);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
