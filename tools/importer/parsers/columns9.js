/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children of a grid
  function getImmediateContainers(parent) {
    return Array.from(parent.querySelectorAll(':scope > div'));
  }

  // Find the top-level grid
  const topGrid = element.querySelector('.aem-Grid');
  if (!topGrid) return;

  // Get its immediate children (should be two containers: left and right columns)
  const columns = getImmediateContainers(topGrid);
  if (columns.length < 2) return;

  // --- LEFT COLUMN ---
  let leftCell = null;
  const leftGrid = columns[0].querySelector('.aem-Grid');
  if (leftGrid) {
    const img = leftGrid.querySelector('img');
    if (img) {
      const imgDiv = document.createElement('div');
      const cmpImage = img.closest('.cmp-image');
      if (cmpImage) {
        imgDiv.appendChild(cmpImage.cloneNode(true));
      } else {
        imgDiv.appendChild(img.cloneNode(true));
      }
      leftCell = imgDiv;
    }
  }

  // --- RIGHT COLUMN ---
  let rightCell = null;
  const rightGrid = columns[1];
  if (rightGrid) {
    const rightContent = document.createElement('div');
    // Get all .text and .button children in DOM order
    rightGrid.childNodes.forEach((node) => {
      if (node.nodeType === 1 && (node.classList.contains('text') || node.classList.contains('button'))) {
        if (node.classList.contains('text') && !node.textContent.trim()) return;
        rightContent.appendChild(node.cloneNode(true));
      }
    });
    if (rightContent.childNodes.length > 0) {
      rightCell = rightContent;
    }
  }

  // Only include non-empty cells
  const rowCells = [];
  if (leftCell) rowCells.push(leftCell);
  if (rightCell) rowCells.push(rightCell);
  if (rowCells.length === 0) return;

  const headerRow = ['Columns (columns9)'];
  const cells = [headerRow, rowCells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
