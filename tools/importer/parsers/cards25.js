/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from the block
  function extractCards(container) {
    const cards = [];
    // Find all card containers
    const cardModules = container.querySelectorAll('.card-module');
    cardModules.forEach((cardModule) => {
      // Find image
      let imgEl = null;
      const imageContainers = cardModule.querySelectorAll('.cmp-image');
      for (const imgContainer of imageContainers) {
        const img = imgContainer.querySelector('img');
        if (img && img.src && img.alt) {
          imgEl = img;
          break;
        }
      }
      // Find title
      let titleEl = null;
      const titleContainer = cardModule.querySelector('.cmp-title');
      if (titleContainer) {
        const h3 = titleContainer.querySelector('h3');
        if (h3) titleEl = h3;
      }
      // Find description
      let descEl = null;
      const textContainer = cardModule.querySelector('.cmp-text');
      if (textContainer) {
        const p = textContainer.querySelector('p');
        if (p) descEl = p;
      }
      // Only add cards with image and text
      if (imgEl && (titleEl || descEl)) {
        // Compose text cell
        const textCell = [];
        if (titleEl) textCell.push(titleEl);
        if (descEl) textCell.push(descEl);
        cards.push([imgEl, textCell]);
      }
    });
    return cards;
  }

  // Build table rows
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];
  const cards = extractCards(element);
  rows.push(...cards);

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
