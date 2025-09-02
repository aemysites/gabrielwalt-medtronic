/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || element.tagName !== 'UL') return;

  // Get all immediate LI children
  const lis = Array.from(element.children).filter((child) => child.tagName === 'LI');

  // Each cell should contain the content of the LI, not the LI element itself
  const columnsRow = lis.map((li) => {
    // Create a fragment to hold all child nodes of the LI
    const fragment = document.createDocumentFragment();
    Array.from(li.childNodes).forEach((node) => fragment.appendChild(node.cloneNode(true)));
    return fragment;
  });

  // Table header as required
  const headerRow = ['Columns (columns2)'];

  // Compose table rows
  const cells = [
    headerRow,
    columnsRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
