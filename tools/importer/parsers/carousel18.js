/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image url from style attribute
  function extractBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
    return match ? match[1] : null;
  }

  // Find the carousel block
  const carousel = element.querySelector('.carousel, .cmp-carousel');
  if (!carousel) return;

  // Find all carousel items/slides
  const items = carousel.querySelectorAll('.cmp-carousel__item');
  if (!items.length) return;

  // Table header
  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find the slide's main container (where background-image and text live)
    let slideContainer = item.querySelector('.cmp-container[style*="background-image"]');
    if (!slideContainer) {
      // Defensive: fallback to first .cmp-container inside item
      slideContainer = item.querySelector('.cmp-container');
    }

    // --- IMAGE CELL ---
    let imageCell = '';
    if (slideContainer) {
      const bgUrl = extractBgImageUrl(slideContainer.getAttribute('style'));
      if (bgUrl) {
        // Create an <img> element for the background image
        const img = document.createElement('img');
        img.src = bgUrl;
        img.alt = '';
        img.style.maxWidth = '100%';
        imageCell = img;
      }
    }

    // --- TEXT CELL ---
    // Gather all text content (including eyebrow, title, description, CTA)
    const textCell = document.createElement('div');
    // Eyebrow (if present)
    const eyebrow = slideContainer && slideContainer.querySelector('.eyebrow2 .cmp-text');
    if (eyebrow) textCell.appendChild(eyebrow.cloneNode(true));
    // Title (h2 or h1)
    const title = slideContainer && slideContainer.querySelector('h2, h1');
    if (title) textCell.appendChild(title.cloneNode(true));
    // All .text blocks (excluding eyebrow)
    const textBlocks = slideContainer ? Array.from(slideContainer.querySelectorAll('.text')) : [];
    textBlocks.forEach(tb => {
      if (!tb.classList.contains('eyebrow2')) {
        const cmpText = tb.querySelector('.cmp-text');
        if (cmpText) textCell.appendChild(cmpText.cloneNode(true));
      }
    });
    // CTA button (link)
    const button = slideContainer && slideContainer.querySelector('.button a');
    if (button) textCell.appendChild(button.cloneNode(true));

    // Compose row: [image, text]
    rows.push([
      imageCell,
      textCell.childNodes.length ? textCell : ''
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
