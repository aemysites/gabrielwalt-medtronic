/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from a card block
  function extractImage(card) {
    const img = card.querySelector('img');
    return img || null;
  }

  // Helper to extract text content from a card block
  function extractText(card) {
    const fragments = [];
    // Headings
    card.querySelectorAll('h1, h2').forEach(h => {
      fragments.push(h.cloneNode(true));
    });
    // All <p> and <div> with text
    card.querySelectorAll('p, div').forEach(el => {
      if (el.textContent.trim().length > 0) {
        fragments.push(el.cloneNode(true));
      }
    });
    // CTA
    let cta = card.querySelector('a.btn, a.cta-tracking, a.bg-medtronic-blue, a.bg-light-orange');
    if (cta) fragments.push(cta.cloneNode(true));
    return fragments;
  }

  const cards = [];

  // 1. Squat Hero blocks (image + text)
  element.querySelectorAll('.squat-hero').forEach(hero => {
    const imgDiv = hero.querySelector('.pull-right');
    const textDiv = hero.querySelector('.content.left');
    if (imgDiv && textDiv) {
      const img = extractImage(imgDiv);
      const text = extractText(textDiv);
      if (img && text.length) {
        cards.push([img, text]);
      }
    }
  });

  // 2. Hero blocks (image + text)
  element.querySelectorAll('.hero .row.hero').forEach(row => {
    const mediaCol = row.querySelector('.hero--media .content');
    const textCol = row.querySelector('.hero--text .content');
    if (mediaCol && textCol) {
      const img = extractImage(mediaCol);
      const text = extractText(textCol);
      if (img && text.length) {
        cards.push([img, text]);
      }
    }
  });

  // 3. Mini squat blocks (image + text)
  element.querySelectorAll('.single-row-template .row.mini').forEach(row => {
    const cols = row.children;
    if (cols.length === 2) {
      // Left: image, Right: text
      const imgCol = cols[0].querySelector('.tta__graphic');
      const textCol = cols[1].querySelector('.tta__headline');
      if (imgCol && textCol) {
        const img = extractImage(imgCol);
        const text = extractText(textCol.parentElement);
        if (img && text.length) {
          cards.push([img, text]);
        }
      }
      // Special case: right column also has an image at the bottom
      const extraImg = cols[1].querySelector('.tta__graphic img');
      if (extraImg && textCol) {
        const text = extractText(textCol.parentElement);
        cards.push([extraImg, text]);
      }
    }
  });

  // 4. Three-column cards (image + text only)
  element.querySelectorAll('.single-row-template .row.three-column > div').forEach(col => {
    const imgCol = col.querySelector('.tta__graphic');
    const textCol = col.querySelector('.tta__headline');
    const img = imgCol ? extractImage(imgCol) : null;
    if (img && textCol) {
      const text = extractText(textCol.parentElement);
      if (text.length) {
        cards.push([img, text]);
      }
    }
  });

  // 5. Mini squat with image on right
  element.querySelectorAll('.single-row-template .row.mini.bg-navy-blue').forEach(row => {
    const cols = row.children;
    if (cols.length === 2) {
      // Left: text, Right: image
      const textCol = cols[0].querySelector('.tta__headline');
      const imgCol = cols[1].querySelector('.tta__graphic');
      if (imgCol && textCol) {
        const img = extractImage(imgCol);
        const text = extractText(textCol.parentElement);
        if (img && text.length) {
          cards.push([img, text]);
        }
      }
    }
  });

  // Build the table
  const headerRow = ['Cards (cards8)'];
  const rows = cards.map(([img, text]) => [img, text]);
  const cells = [headerRow, ...rows];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
