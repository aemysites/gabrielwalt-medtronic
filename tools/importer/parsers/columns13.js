/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirements
  const headerRow = ['Columns (columns13)'];

  // Find the direct column containers (teaser blocks)
  let columns = [];
  const grid = element.querySelector('.aem-Grid');
  if (grid) {
    columns = Array.from(grid.children).filter(child => child.classList.contains('teaser'));
  } else {
    columns = Array.from(element.querySelectorAll(':scope > .teaser'));
  }

  // For each column, extract the main content block (the .cmp-teaser__description)
  // Remove empty <p> elements from each description
  const cells = columns.map(col => {
    const desc = col.querySelector('.cmp-teaser__description');
    if (desc) {
      // Clone to avoid mutating source DOM
      const descClone = desc.cloneNode(true);
      // Remove all <p> elements that have only whitespace (or are empty)
      descClone.querySelectorAll('p').forEach(p => {
        if (!p.textContent.trim()) {
          p.remove();
        }
      });
      return descClone;
    }
    return col;
  });

  // Build the table rows: header and one row with all columns
  const tableRows = [
    headerRow,
    cells
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
