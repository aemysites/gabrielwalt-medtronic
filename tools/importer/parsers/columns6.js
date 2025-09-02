/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the row that contains the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all immediate column items
  const columns = Array.from(row.querySelectorAll(':scope > .accordion__item'));
  if (!columns.length) return;

  // Build the header row
  const headerRow = ['Columns (columns6)'];

  // Build the columns row: each cell is the full content of a column (label + content)
  const columnsRow = columns.map((col) => {
    // We'll include the entire column block (label + content)
    return col;
  });

  // Compose the table data
  const tableData = [
    headerRow,
    columnsRow
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
