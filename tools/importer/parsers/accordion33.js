/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check for required structure
  if (!element) return;

  // Header row for Accordion block
  const headerRow = ['Accordion (accordion33)'];

  // --- Title cell ---
  // The title is inside the button > span.cmp-accordion__title
  let titleText = '';
  const headerButton = element.querySelector('.cmp-accordion__button');
  if (headerButton) {
    const titleSpan = headerButton.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      titleText = titleSpan.textContent.trim();
    }
  }
  // Create a <strong> element for the title
  const titleEl = document.createElement('strong');
  titleEl.textContent = titleText;

  // --- Content cell ---
  // The content is inside the panel div
  const panel = element.querySelector('[data-cmp-hook-accordion="panel"]');
  let contentEls = [];
  if (panel) {
    // Defensive: find all immediate children with actual content
    // In this HTML, the content is inside .container > .cmp-container > .aem-Grid > .text > .cmp-text
    const textBlocks = panel.querySelectorAll('.cmp-text');
    textBlocks.forEach((tb) => {
      // Each .cmp-text contains a <p>
      const p = tb.querySelector('p');
      if (p) contentEls.push(p);
    });
  }
  // If no content found, fallback to the panel itself
  if (contentEls.length === 0 && panel) {
    contentEls = [panel];
  }

  // Build the rows for the block table
  const rows = [
    headerRow,
    [titleEl, contentEls],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
