/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card containers (each card-module is a card)
  const cardModules = Array.from(
    element.querySelectorAll(':scope > div > div.card-module')
  );

  // Fallback: if not found, try direct children
  const cards = cardModules.length ? cardModules : Array.from(element.querySelectorAll(':scope > div'));

  const rows = [];
  // Block header as per spec
  rows.push(['Cards (cards10)']);

  cards.forEach((card) => {
    // The actual card content is inside the inner .cmp-container
    const cmpContainer = card.querySelector('.cmp-container') || card;
    // The grid holds the image, title, and text
    const grid = cmpContainer.querySelector('.aem-Grid') || cmpContainer;
    const gridChildren = Array.from(grid.children);

    // Find the image cell (first .image with an <img>)
    let imageCell = '';
    for (const div of gridChildren) {
      if (div.classList.contains('image')) {
        const img = div.querySelector('img');
        if (img) {
          imageCell = div;
          break;
        }
      }
    }

    // Find the title (first .title)
    let titleNode = '';
    for (const div of gridChildren) {
      if (div.classList.contains('title')) {
        const h3 = div.querySelector('h3');
        if (h3) {
          titleNode = h3;
          break;
        }
      }
    }

    // Find the description (first .text)
    let descNode = '';
    for (const div of gridChildren) {
      if (div.classList.contains('text')) {
        const p = div.querySelector('p');
        if (p) {
          descNode = p;
          break;
        }
      }
    }

    // Compose the text cell: title (heading) + description (paragraph)
    const textCell = [];
    if (titleNode) textCell.push(titleNode);
    if (descNode) textCell.push(descNode);

    rows.push([
      imageCell || '',
      textCell.length ? textCell : '',
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
