/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a card-module element
  function extractCard(cardEl) {
    // Find the image (first .cmp-image img)
    const img = cardEl.querySelector('.cmp-image img');
    // Find the title (first .cmp-title__text)
    const title = cardEl.querySelector('.cmp-title__text');
    // Find the description (first .cmp-text p)
    const desc = cardEl.querySelector('.cmp-text p');

    // Defensive: Only include elements if they exist
    // Image cell
    let imageCell = img ? img : '';

    // Text cell: Compose a fragment with title and description
    const frag = document.createDocumentFragment();
    if (title) frag.appendChild(title);
    if (desc) frag.appendChild(desc);
    let textCell = frag.childNodes.length > 0 ? frag : '';

    return [imageCell, textCell];
  }

  // Find all card-module containers (cards)
  const cardModules = element.querySelectorAll('.card-module');
  const rows = [];

  // Header row
  rows.push(['Cards (cards32)']);

  // Each card row
  cardModules.forEach(cardEl => {
    rows.push(extractCard(cardEl));
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
