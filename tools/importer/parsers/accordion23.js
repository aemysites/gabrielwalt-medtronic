/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the accordion title
  function getAccordionTitle(el) {
    const header = el.querySelector('.cmp-accordion__header');
    if (!header) return '';
    const btn = header.querySelector('button');
    if (!btn) return '';
    const titleSpan = btn.querySelector('.cmp-accordion__title');
    if (!titleSpan) return '';
    return titleSpan.textContent.trim();
  }

  // Helper to extract all text content from the panel
  function getAccordionContentText(el) {
    const panel = el.querySelector('[data-cmp-hook-accordion="panel"]');
    if (!panel) return '';
    // Find all <p> elements inside the panel
    const paragraphs = Array.from(panel.querySelectorAll('p'));
    // If no <p>, fallback to all text nodes inside panel
    if (paragraphs.length > 0) {
      return paragraphs.map(p => p.textContent.trim()).filter(Boolean).join('\n');
    } else {
      return panel.textContent.trim();
    }
  }

  const rows = [];
  rows.push(['Accordion (accordion23)']);

  const title = getAccordionTitle(element);
  const contentText = getAccordionContentText(element);
  rows.push([
    title,
    contentText
  ]);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
