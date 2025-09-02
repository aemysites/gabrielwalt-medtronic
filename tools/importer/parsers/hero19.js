/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the main image (not background)
  function findMainImage(el) {
    // Look for img inside .cmp-image
    const img = el.querySelector('.cmp-image img');
    return img;
  }

  // Helper to find the main heading and subheading
  function findTextContent(el) {
    let heading = null;
    let subheading = null;
    // Find h3 or h1/h2/h4 in .cmp-title
    const titleDiv = el.querySelector('.cmp-title');
    if (titleDiv) {
      heading = titleDiv.querySelector('h1, h2, h3, h4, h5, h6');
    }
    // Find paragraph in .cmp-text
    const textDiv = el.querySelector('.cmp-text');
    if (textDiv) {
      subheading = textDiv.querySelector('p');
    }
    return { heading, subheading };
  }

  // Find the image column (right side)
  let imageCol = null;
  let textCol = null;
  const grid = element.querySelector('.aem-Grid');
  if (grid) {
    const containers = grid.querySelectorAll(':scope > .container');
    if (containers.length >= 2) {
      // Heuristic: left is text, right is image
      textCol = containers[0];
      imageCol = containers[1];
    }
  }

  // Fallback: if not found, search for .cmp-image anywhere
  if (!imageCol) {
    imageCol = element.querySelector('.cmp-image')?.parentElement;
  }
  if (!textCol) {
    textCol = element.querySelector('.cmp-title')?.parentElement;
  }

  // Get image element
  let imageEl = null;
  if (imageCol) {
    imageEl = findMainImage(imageCol);
  } else {
    imageEl = findMainImage(element);
  }

  // Get heading and subheading
  let heading = null, subheading = null;
  if (textCol) {
    ({ heading, subheading } = findTextContent(textCol));
  } else {
    ({ heading, subheading } = findTextContent(element));
  }

  // Compose the text cell content
  const textContent = [];
  if (heading) textContent.push(heading);
  if (subheading) textContent.push(subheading);

  // Build the table rows
  const headerRow = ['Hero (hero19)'];
  const imageRow = [imageEl ? imageEl : ''];
  const textRow = [textContent.length ? textContent : ''];

  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
