/* global WebImporter */
export default function parse(element, { document }) {
  // Find the correct table
  const table = element.querySelector('table.tablesaw-stack');
  if (!table) return;

  // Always use the required single-column header row
  const headerRow = ['Table (striped, bordered, tableStripedBordered1)'];

  // Get column headers from the table's thead
  let columnHeaders = [];
  const thead = table.querySelector('thead');
  if (thead) {
    const ths = thead.querySelectorAll('th');
    columnHeaders = Array.from(ths).map(th => {
      const btn = th.querySelector('button');
      return btn ? btn.textContent.trim() : th.textContent.trim();
    });
  }

  // Get table body rows
  const tbody = table.querySelector('tbody');
  const dataRows = [];
  if (tbody) {
    const trs = tbody.querySelectorAll('tr');
    trs.forEach(tr => {
      // Each row has two columns: Bereich (th) and Produkte (td)
      const th = tr.querySelector('th');
      const td = tr.querySelector('td');
      if (!th || !td) return;
      // For each cell, use the full content (including HTML structure)
      dataRows.push([
        th,
        td
      ]);
    });
  }

  // Compose all rows for the block table
  // CRITICAL FIX: Only the first row (headerRow) should be a single cell (block name)
  // All other rows must match the number of columns in the data (columnHeaders.length)
  // Remove the columnHeaders row so only the headerRow is the first row
  const cells = [headerRow, ...dataRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
