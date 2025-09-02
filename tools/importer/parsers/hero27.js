/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image from inline style
  function getBackgroundImageUrl(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      let url = match[1].replace(/\\2f /g, '/').replace(/\\/g, '');
      // Remove any surrounding quotes
      url = url.replace(/^['"]|['"]$/g, '');
      // If relative, prepend origin
      if (url.startsWith('/')) {
        url = document.location.origin + url;
      }
      return url;
    }
    return null;
  }

  // Find the cmp-container with the background image
  const bgContainer = element.querySelector('.cmp-container[style*="background-image"]');
  let bgImgUrl = null;
  if (bgContainer) {
    bgImgUrl = getBackgroundImageUrl(bgContainer);
  }

  // Compose background image element if found
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
    bgImgEl.setAttribute('loading', 'lazy');
    // Optionally set width/height if available
    // bgImgEl.width = 750; bgImgEl.height = 415;
  }

  // Find the text blocks inside the deepest cmp-container
  // Defensive: find all .cmp-text elements inside the block
  const textBlocks = Array.from(element.querySelectorAll('.cmp-text'));

  // Compose the content cell
  const contentCell = [];

  // Eyebrow (first text block)
  if (textBlocks[0]) {
    // Use the paragraph as a span for eyebrow
    const eyebrowPara = textBlocks[0].querySelector('p');
    if (eyebrowPara) {
      const eyebrowSpan = document.createElement('span');
      eyebrowSpan.className = 'hero-eyebrow';
      eyebrowSpan.textContent = eyebrowPara.textContent;
      contentCell.push(eyebrowSpan);
    }
  }

  // Heading (second text block)
  if (textBlocks[1]) {
    // Use all paragraphs as heading
    const headingParas = textBlocks[1].querySelectorAll('p');
    if (headingParas.length) {
      const heading = document.createElement('h1');
      heading.innerHTML = Array.from(headingParas).map(p => p.innerHTML).join('<br>');
      contentCell.push(heading);
    }
  }

  // Subheading (third text block)
  if (textBlocks[2]) {
    const subheadingPara = textBlocks[2].querySelector('p');
    if (subheadingPara) {
      const subheading = document.createElement('p');
      subheading.innerHTML = subheadingPara.innerHTML;
      contentCell.push(subheading);
    }
  }

  // Compose the table rows
  const headerRow = ['Hero (hero27)'];
  const bgRow = [bgImgEl ? bgImgEl : ''];
  const contentRow = [contentCell];

  const cells = [headerRow, bgRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
