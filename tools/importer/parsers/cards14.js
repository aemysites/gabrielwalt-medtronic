/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the first non-empty image from a card
  function getCardImage(card) {
    // Find all image wrappers
    const imageDivs = card.querySelectorAll('.image');
    for (const imgDiv of imageDivs) {
      const img = imgDiv.querySelector('img');
      if (img && img.src) return img;
    }
    return '';
  }

  // Helper to extract the title (h3) from a card
  function getCardTitle(card) {
    const titleDiv = card.querySelector('.title');
    if (titleDiv) {
      const h3 = titleDiv.querySelector('h3, .cmp-title__text');
      if (h3) return h3;
    }
    return '';
  }

  // Helper to extract the description (p) from a card
  function getCardDescription(card) {
    const textDiv = card.querySelector('.text');
    if (textDiv) {
      const p = textDiv.querySelector('p');
      if (p) return p;
    }
    return '';
  }

  // Find all card containers (each card is a .card-module)
  const cardModules = element.querySelectorAll('.card-module');

  // Build table rows
  const rows = [];
  // Header row (must match block name exactly)
  rows.push(['Cards (cards14)']);

  // For each card, extract image and text content
  cardModules.forEach((card) => {
    // First cell: image (reference the actual element)
    const img = getCardImage(card);
    // Second cell: text (title + description, as elements)
    const title = getCardTitle(card);
    const desc = getCardDescription(card);
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    rows.push([
      img || '',
      textCell.length ? textCell : '',
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
