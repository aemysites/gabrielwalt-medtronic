/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all card-module containers
  const cardContainers = Array.from(
    element.querySelectorAll('.card-module')
  );

  // Defensive: if no cards found, do nothing
  if (!cardContainers.length) return;

  // Table header
  const headerRow = ['Cards (cards16)'];
  const rows = [headerRow];

  cardContainers.forEach(card => {
    // Find the image (first .cmp-image img inside .image)
    const imageDiv = card.querySelector('.image .cmp-image');
    let imgEl = null;
    if (imageDiv) {
      imgEl = imageDiv.querySelector('img');
    }

    // Find the title (h3 inside .cmp-title)
    const titleDiv = card.querySelector('.cmp-title');
    let titleEl = null;
    if (titleDiv) {
      titleEl = titleDiv.querySelector('h3');
    }

    // Find the description (first p inside .cmp-text)
    const textDiv = card.querySelector('.cmp-text');
    let descEl = null;
    if (textDiv) {
      descEl = textDiv.querySelector('p');
    }

    // Compose the text cell: title (heading) + description (paragraph)
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);

    // Only add row if both image and text content exist
    if (imgEl && textCell.length) {
      rows.push([imgEl, textCell]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
