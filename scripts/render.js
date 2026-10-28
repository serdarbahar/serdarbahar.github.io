/* Content lives in content/*.js. This renderer preserves the original table styles. */
(() => {
  'use strict';

  function link(label, url) {
    const anchor = document.createElement('a');
    anchor.textContent = label;
    anchor.href = url;
    return anchor;
  }

  function appendLinks(container, links) {
    links.filter(item => item.url).forEach((item, index) => {
      if (index) container.append(document.createTextNode(' \u00a0/\u00a0 '));
      container.append(link(item.label, item.url));
    });
  }

  function appendPaperLinks(container, paper) {
    const links = paper.links.filter(item =>
      /^(bib|bibtex)$/i.test(item.label) ? item.bibtex?.trim() : item.url
    );
    if (!links.length) return;
    container.append(document.createElement('br'));
    const citations = [];
    links.forEach((item, index) => {
      if (index) container.append(document.createTextNode(' \u00a0/\u00a0 '));
      if (/^(bib|bibtex)$/i.test(item.label)) {
        const citation = document.createElement('pre');
        citation.className = 'bibtex-entry';
        citation.id = `${paper.id}-bibtex-${index}`;
        citation.textContent = item.bibtex;
        citation.hidden = true;
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'bibtex-toggle';
        toggle.textContent = item.label;
        toggle.setAttribute('aria-controls', citation.id);
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', () => {
          citation.hidden = !citation.hidden;
          toggle.setAttribute('aria-expanded', String(!citation.hidden));
        });
        container.append(toggle);
        citations.push(citation);
      } else {
        const anchor = link(item.label, item.url);
        if (item.label.toLowerCase() === 'pdf') {
          anchor.target = '_blank';
          anchor.rel = 'noopener';
        }
        container.append(anchor);
      }
    });
    container.append(...citations);
  }

  const profile = window.siteProfile;
  document.title = profile.name;
  document.querySelector('meta[name="author"]').content = profile.name;
  document.getElementById('profile-name').textContent = profile.name;
  const photo = document.getElementById('profile-photo');
  photo.src = profile.photo.src;
  photo.alt = profile.photo.alt || profile.name;
  document.getElementById('profile-photo-link').href = profile.photo.url || profile.photo.src;

  const biography = document.getElementById('profile-description');
  profile.description.forEach(paragraph => {
    const element = document.createElement('p');
    const parts = Array.isArray(paragraph) ? paragraph : [paragraph];
    parts.forEach(part => {
      if (typeof part === 'string') element.append(document.createTextNode(part));
      else if (part.url) element.append(link(part.text, part.url));
      else element.append(document.createTextNode(part.text));
    });
    biography.append(element);
  });

  appendLinks(document.getElementById('profile-links'), profile.links);
  const publications = document.getElementById('publications');

  window.sitePapers.forEach(paper => {
    const row = document.createElement('tr');
    row.id = paper.id;
    if (paper.highlight) row.setAttribute('bgcolor', '#ffffd0');

    const imageCell = document.createElement('td');
    imageCell.style.cssText = 'padding:16px;width:20%;vertical-align:middle';
    const image = document.createElement('img');
    image.src = paper.image;
    image.alt = paper.imageAlt || paper.title;
    image.width = 160;
    image.loading = 'lazy';
    image.style.display = 'block';
    imageCell.append(image);
    if (paper.hoverImage) {
      image.tabIndex = 0;
      image.title = 'Hover or focus to play the demonstration';
      let hovered = false;
      let focused = false;
      let replay = 0;
      const play = () => {
        // A fresh URL restarts even a GIF that has already finished playing.
        const url = new URL(paper.hoverImage, document.baseURI);
        url.searchParams.set('play', String(++replay));
        image.src = url.href;
      };
      row.addEventListener('mouseenter', () => {
        hovered = true;
        if (!focused) play();
      });
      row.addEventListener('mouseleave', () => {
        hovered = false;
        if (!focused) image.src = paper.image;
      });
      row.addEventListener('focusin', () => {
        if (!focused && !hovered) play();
        focused = true;
      });
      row.addEventListener('focusout', event => {
        focused = row.contains(event.relatedTarget);
        if (!focused && !hovered) image.src = paper.image;
      });
      if (paper.autoplay) {
        image.loading = 'eager';
        play();
      }
    }

    const details = document.createElement('td');
    details.style.cssText = 'padding:8px;width:80%;vertical-align:middle';
    const title = document.createElement('span');
    title.className = 'papertitle';
    title.textContent = paper.title;
    details.append(title);
    details.append(document.createElement('br'));

    paper.authors.forEach((id, index) => {
      const author = window.siteAuthors[id];
      if (!author) throw new Error(`Unknown author "${id}" in paper "${paper.id}"`);
      if (index) details.append(document.createTextNode(', '));
      let name = author.url ? link(author.name, author.url) : document.createTextNode(author.name);
      if (author.bold) {
        const bold = document.createElement('strong');
        bold.append(name);
        name = bold;
      }
      details.append(name);
    });
    details.append(document.createElement('br'));
    const awards = paper.awards || [];
    const entryCount = Math.max(paper.venues.length, paper.years.length, awards.length);
    for (let index = 0; index < entryCount; index++) {
      const name = paper.venues[index];
      const year = paper.years[index];
      const award = awards[index];
      const inlineYear = Boolean(name && name.includes('{year}'));
      if (index) details.append(document.createElement('br'));
      if (name) {
        const venue = document.createElement('em');
        venue.textContent = inlineYear ? name.replaceAll('{year}', year ?? '').trim() : name;
        details.append(venue);
      }
      if (!inlineYear && year !== undefined && year !== null && year !== '') {
        details.append(document.createTextNode(`${name ? ', ' : ''}${year}`));
      }
      if (award) details.append(document.createTextNode(` (${award})`));
    }
    appendPaperLinks(details, paper);
    if (paper.description) {
      const description = document.createElement('p');
      description.textContent = paper.description;
      details.append(description);
    }
    row.append(imageCell, details);
    publications.append(row);
  });
})();
