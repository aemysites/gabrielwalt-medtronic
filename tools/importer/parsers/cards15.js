/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a card-module element
  function extractCard(cardModule) {
    // Find the main grid inside the card
    const grid = cardModule.querySelector('.aem-Grid');
    if (!grid) return null;

    // Find the first image in the card
    let imageEl = null;
    const imageContainers = grid.querySelectorAll('.image');
    for (const imgCont of imageContainers) {
      const img = imgCont.querySelector('img');
      if (img) {
        imageEl = img;
        break;
      }
    }

    // Find the title (h3)
    let titleEl = null;
    const titleDiv = grid.querySelector('.title .cmp-title__text');
    if (titleDiv) {
      titleEl = titleDiv;
    }

    // Find the description (first .text block with a <p> that is not a link)
    let descEl = null;
    const textBlocks = grid.querySelectorAll('.text .cmp-text');
    for (const tb of textBlocks) {
      const p = tb.querySelector('p');
      if (p && !p.querySelector('a')) {
        descEl = p;
        break;
      }
    }

    // Find the CTA (first .text block with a link)
    let ctaEl = null;
    for (const tb of textBlocks) {
      const a = tb.querySelector('a');
      if (a) {
        ctaEl = a;
        break;
      }
    }

    // Compose the text cell content
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);
    if (ctaEl) textCellContent.push(ctaEl);

    // Defensive: If no text content, skip this card
    if (!imageEl || textCellContent.length === 0) return null;

    return [imageEl, textCellContent];
  }

  // Find all card modules in the block
  const cardModules = element.querySelectorAll('.card-module');
  const rows = [];
  for (const cardModule of cardModules) {
    const cardRow = extractCard(cardModule);
    if (cardRow) rows.push(cardRow);
  }

  // Build the table: header row, then card rows
  const tableRows = [
    ['Cards (cards15)'],
    ...rows
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
