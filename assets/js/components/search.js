(function (PKM) {
  let outsideHandler;
  function mount(container) {
    const input = container.querySelector('[data-global-search]'); const panel = container.querySelector('[data-search-results]'); if (!input || !panel) return; let activeIndex = 0;
    function close() { panel.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); activeIndex = 0; }
    function openItem(button) { if (!button) return; button.dataset.kind === 'node' ? PKM.router.openMap(button.dataset.mapId, button.dataset.id) : PKM.router.openMap(button.dataset.mapId); }
    function render() {
      const items = PKM.globalSearch.results(input.value); if (!input.value.trim()) return close(); activeIndex = Math.min(activeIndex, Math.max(0, items.length - 1));
      const groups = [['map', 'Maps'], ['node', 'Nodes'], ['group', 'Groups']];
      panel.innerHTML = items.length ? groups.map(([kind, title]) => { const subset = items.filter((item) => item.kind === kind); if (!subset.length) return ''; return `<section class="search-group" role="group" aria-label="${title}"><h3>${title}</h3>${subset.map((item) => { const index = items.indexOf(item); return `<button type="button" role="option" id="global-search-option-${index}" class="search-result ${index === activeIndex ? 'is-active' : ''}" data-kind="${item.kind}" data-id="${item.id}" data-map-id="${item.mapId}" aria-selected="${index === activeIndex}"><span class="search-result__icon">${PKM.helpers.icon(item.kind === 'map' ? 'map' : item.kind === 'group' ? 'group' : 'topics')}</span><span><strong>${PKM.helpers.escapeHtml(item.title)}</strong><small>${PKM.helpers.escapeHtml(item.meta)}</small></span><span class="search-result__status">${PKM.helpers.escapeHtml(item.status)}</span></button>`; }).join('')}</section>`; }).join('') : PKM.emptyState.render({ icon: 'search', title: 'No matches', message: 'Try a title, note, tag, group, map, or connection label.' });
      panel.hidden = false; input.setAttribute('aria-expanded', 'true'); if (items.length) input.setAttribute('aria-activedescendant', `global-search-option-${activeIndex}`); else input.removeAttribute('aria-activedescendant'); panel.querySelectorAll('[data-id]').forEach((button) => button.addEventListener('click', () => openItem(button)));
    }
    input.addEventListener('input', PKM.helpers.debounce(() => { activeIndex = 0; render(); }, 60)); input.addEventListener('focus', render);
    if (outsideHandler) document.removeEventListener('click', outsideHandler);
    outsideHandler = (event) => { if (!container.contains(event.target)) close(); };
    document.addEventListener('click', outsideHandler);
    input.addEventListener('keydown', (event) => { const buttons = [...panel.querySelectorAll('[data-id]')]; if (event.key === 'Escape') { event.preventDefault(); close(); } if (event.key === 'ArrowDown') { event.preventDefault(); activeIndex = (activeIndex + 1) % Math.max(1, buttons.length); render(); } if (event.key === 'ArrowUp') { event.preventDefault(); activeIndex = (activeIndex - 1 + Math.max(1, buttons.length)) % Math.max(1, buttons.length); render(); } if (event.key === 'Enter') { event.preventDefault(); openItem([...panel.querySelectorAll('[data-id]')][activeIndex]); } });
  }
  PKM.searchComponent = { mount };
})(window.PKM = window.PKM || {});
