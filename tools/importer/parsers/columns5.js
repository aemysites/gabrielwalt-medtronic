/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main nav menu
  const navMenu = element.querySelector('nav.nav-menu');
  if (!navMenu) return;

  // Find the top-level nav items (columns)
  const navList = navMenu.querySelector('ul.nav-items__level-1--list');
  if (!navList) return;

  // Get all top-level nav-list-item elements
  const columns = Array.from(navList.children).filter(li => li.classList && li.classList.contains('nav-list-item'));
  if (columns.length === 0) return;

  // For each column, extract the main link (the title) as a block of content (not just the <a>)
  const cells = columns.map(col => {
    // Defensive: Find the main link
    const link = col.querySelector('a.nav-items__level-1--link');
    if (!link) return document.createTextNode('');
    // Instead of just the link, create a div and append all content from the column (to capture all text)
    const cellDiv = document.createElement('div');
    // Append the link (clone to avoid moving from DOM)
    cellDiv.appendChild(link.cloneNode(true));
    return cellDiv;
  });

  // Table header
  const headerRow = ['Columns (columns5)'];
  // Table content row: each cell is a column title/link (with all text content)
  const contentRow = cells;

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original nav section with table
  element.replaceWith(table);
}
