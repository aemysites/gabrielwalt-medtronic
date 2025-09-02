/* global WebImporter */
export default function parse(element, { document }) {
  // Find the responsive-table block containing the actual table
  const responsiveTable = element.querySelector('.responsive-table');
  if (!responsiveTable) return;

  // Find the table inside the responsive-table
  const table = responsiveTable.querySelector('table');
  if (!table) return;

  // Prepare the header row as required by the block spec
  const headerRow = ['Table (striped, bordered, tableStripedBordered4)'];

  // Extract tbody rows only (skip thead entirely)
  const tbody = table.querySelector('tbody');
  const dataRows = [];
  if (tbody) {
    const trs = tbody.querySelectorAll('tr');
    trs.forEach(tr => {
      const cells = [];
      // Table is always 2 columns: Bereich, Erkrankung
      const th = tr.querySelector('th');
      const td = tr.querySelector('td');
      // Defensive: if th or td missing, skip row
      if (!th || !td) return;
      // Bereich cell: get the label and content
      const bereichContent = th.querySelector('.tablesaw-cell-content');
      let bereichCell = bereichContent ? bereichContent : th;
      // Erkrankung cell: get the content
      const erkrankungContent = td.querySelector('.tablesaw-cell-content');
      let erkrankungCell = erkrankungContent ? erkrankungContent : td;
      cells.push(bereichCell, erkrankungCell);
      dataRows.push(cells);
    });
  }

  // Compose the table rows
  const cells = [
    headerRow,
    ...dataRows
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original responsive-table element with the block
  responsiveTable.replaceWith(block);
}
