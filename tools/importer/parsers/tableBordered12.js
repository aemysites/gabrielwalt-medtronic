/* global WebImporter */
export default function parse(element, { document }) {
  // Find the table with the relevant data
  const table = element.querySelector('table.tablesaw-columntoggle');
  if (!table) return;

  // Header row for the block table
  const headerRow = ['Table (bordered, tableBordered12)'];

  // Prepare rows for each data row in the source table
  const rows = [];

  // Get all table rows (skip thead, use tbody)
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  const trList = Array.from(tbody.querySelectorAll('tr'));

  trList.forEach((tr) => {
    // Each row has two columns: Bereich (th) and Erkrankung (td)
    const th = tr.querySelector('th');
    const td = tr.querySelector('td');
    if (!th || !td) return;
    // Use the text content or the inner HTML of th and td, but do not nest th/td tags
    // We'll use the content as elements to preserve formatting (e.g., lists, links)
    const thContent = Array.from(th.childNodes);
    const tdContent = Array.from(td.childNodes);
    rows.push([thContent, tdContent]);
  });

  // Compose the block table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original table with the block table
  table.replaceWith(block);
}
