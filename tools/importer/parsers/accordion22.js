/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Header row: Always use block name as required
  const headerRow = ['Accordion (accordion22)'];

  // Extract accordion title
  let title = '';
  const header = element.querySelector('h2');
  if (header) {
    const button = header.querySelector('button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      }
    }
  }

  // Extract only the actual content (no wrappers)
  let contentCell = '';
  const panel = element.querySelector('div[data-cmp-hook-accordion="panel"]');
  if (panel) {
    // Find the deepest .cmp-text inside the panel
    const cmpText = panel.querySelector('.cmp-text');
    if (cmpText) {
      // Use all children of cmpText (usually <p>, etc.)
      contentCell = Array.from(cmpText.childNodes);
    } else {
      // Fallback: use all <p> elements inside panel
      const paragraphs = panel.querySelectorAll('p');
      if (paragraphs.length) {
        contentCell = Array.from(paragraphs);
      } else {
        // Fallback: use panel's text content
        contentCell = panel.textContent.trim();
      }
    }
  }

  // Build the table rows
  const rows = [
    headerRow,
    [title, contentCell]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
