/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Find the main grid containing the two columns
  let mainGrid = null;
  const grids = element.querySelectorAll('.aem-Grid');
  for (const grid of grids) {
    const directChildren = Array.from(grid.children).filter(child => child.nodeType === 1);
    if (directChildren.length === 2) {
      mainGrid = grid;
      break;
    }
  }
  if (!mainGrid) return;

  // First column: left side (text + small image)
  const leftCol = mainGrid.children[0];
  // Second column: right side (large image)
  const rightCol = mainGrid.children[1];

  // LEFT COLUMN
  const leftBlocks = Array.from(leftCol.querySelectorAll(':scope > div'));
  const leftCellContent = [];
  for (const block of leftBlocks) {
    // Only include elements that have actual content
    if (block.querySelector('img')) {
      leftCellContent.push(block);
    } else if (block.classList.contains('text')) {
      leftCellContent.push(block);
    }
  }

  // RIGHT COLUMN
  let rightImageBlock = null;
  const rightImages = rightCol.querySelectorAll('img');
  if (rightImages.length) {
    rightImageBlock = rightImages[0].closest('.image') || rightImages[0];
  }
  const rightCellContent = rightImageBlock ? [rightImageBlock] : [];

  // Table header
  const headerRow = ['Columns (columns21)'];
  const contentRow = [leftCellContent, rightCellContent];

  // Create block table
  const cells = [headerRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(blockTable);
}
