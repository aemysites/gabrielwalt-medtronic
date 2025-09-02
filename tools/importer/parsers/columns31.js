/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find all direct column containers inside the grid
  const columnContainers = Array.from(grid.children).filter(child => child.classList.contains('container'));

  // For each column, extract its content as a cell
  const columnCells = columnContainers.map(container => {
    // Find the cmp-container inside this column
    const cmpContainer = container.querySelector('.cmp-container');
    // Defensive: if not found, fallback to the container itself
    const contentRoot = cmpContainer || container;
    // Get all .aem-GridColumn children (these are the actual content blocks)
    const gridCols = Array.from(contentRoot.querySelectorAll('.aem-GridColumn'));
    // For each gridCol, extract its .cmp-text content
    const cellContent = gridCols.map(col => {
      const textBlock = col.querySelector('.cmp-text');
      return textBlock ? Array.from(textBlock.childNodes) : [];
    }).flat();
    // Create a wrapper div for the cell
    const cellDiv = document.createElement('div');
    cellContent.forEach(node => cellDiv.appendChild(node.cloneNode(true)));
    return cellDiv;
  });

  // Build the table rows
  const headerRow = ['Columns (columns31)'];
  const contentRow = columnCells;

  const rows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
