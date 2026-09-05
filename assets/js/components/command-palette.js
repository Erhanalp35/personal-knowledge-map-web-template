(function (PKM) {
  let shell = null; let restore = null;
  const commands = () => {
    const view = PKM.router.currentView(); const list = [
      { id: 'map-new', label: 'Create Map', hint: 'New workspace', icon: 'map', run: () => PKM.mapActions?.create() },
      { id: 'nav-dashboard', label: 'Open Dashboard', hint: 'Navigation', icon: 'dashboard', run: () => PKM.router.go('dashboard') },
      { id: 'nav-map', label: 'Open Knowledge Map', hint: 'Navigation', icon: 'map', run: () => PKM.router.go('knowledge-map') },
      { id: 'nav-favorites', label: 'Open Favorites', hint: 'Navigation', icon: 'star', run: () => PKM.router.go('favorites') },
      { id: 'nav-review', label: 'Open Review', hint: 'Navigation', icon: 'review', run: () => PKM.router.go('review') },
      { id: 'theme', label: 'Toggle Theme', hint: 'Appearance', icon: 'moon', run: () => PKM.theme.toggle() },
      { id: 'settings', label: 'Open Settings', hint: 'Navigation', icon: 'settings', run: () => PKM.router.go('settings') }
    ];
    if (PKM.state.activeMap() && PKM.nodeActions) list.unshift({ id: 'node-new', label: 'Create Node', hint: PKM.state.activeMap().name, icon: 'plus', run: () => PKM.nodeActions.openCreate() });
    if (view === 'knowledge-map' && PKM.canvas) list.push({ id: 'fit', label: 'Fit Map', hint: 'Canvas', icon: 'fit', run: () => PKM.canvas.fit() }, { id: 'reset', label: 'Reset Zoom', hint: 'Canvas', icon: 'reset', run: () => PKM.canvas.reset() });
    if (PKM.exporter) list.push({ id: 'export', label: 'Export Data', hint: 'Backup', icon: 'download', run: () => PKM.exporter.download('all') });
    return list;
  };
  function close() { shell?.remove(); shell = null; document.body.classList.remove('palette-open'); restore?.focus?.(); }
  function open() {
    close(); restore = document.activeElement; shell = document.createElement('div'); shell.className = 'palette-layer'; shell.innerHTML = `<div class="modal-backdrop" data-palette-close></div><section class="command-palette" role="dialog" aria-modal="true" aria-label="Command palette"><label class="command-palette__search">${PKM.helpers.icon('search')}<input type="search" data-command-search autocomplete="off" placeholder="Type a command…" aria-label="Search commands" aria-controls="command-list" aria-expanded="true"><kbd>Esc</kbd></label><div class="command-list" id="command-list" role="listbox" aria-label="Commands"></div></section>`; document.body.append(shell); document.body.classList.add('palette-open');
    const input = shell.querySelector('input'); const list = shell.querySelector('.command-list'); let activeIndex = 0;
    const render = () => { const term = input.value.trim().toLowerCase(); const items = commands().filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(term)); activeIndex = Math.min(activeIndex, Math.max(0, items.length - 1)); list.innerHTML = items.length ? items.map((item, index) => `<button type="button" role="option" id="command-option-${index}" aria-selected="${index === activeIndex}" class="${index === activeIndex ? 'is-active' : ''}" data-command="${item.id}"><span>${PKM.helpers.icon(item.icon)}</span><strong>${PKM.helpers.escapeHtml(item.label)}</strong><small>${PKM.helpers.escapeHtml(item.hint)}</small></button>`).join('') : `<p class="command-empty">No matching commands</p>`; if (items.length) input.setAttribute('aria-activedescendant', `command-option-${activeIndex}`); else input.removeAttribute('aria-activedescendant'); list.querySelectorAll('[data-command]').forEach((button) => button.addEventListener('click', () => { const item = items.find((entry) => entry.id === button.dataset.command); close(); item?.run(); })); };
    input.addEventListener('input', () => { activeIndex = 0; render(); }); input.addEventListener('keydown', (event) => { const buttons = [...list.querySelectorAll('button')]; if (event.key === 'ArrowDown') { event.preventDefault(); activeIndex = (activeIndex + 1) % Math.max(1, buttons.length); render(); } if (event.key === 'ArrowUp') { event.preventDefault(); activeIndex = (activeIndex - 1 + Math.max(1, buttons.length)) % Math.max(1, buttons.length); render(); } if (event.key === 'Enter') { event.preventDefault(); buttons[activeIndex]?.click(); } if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); } });
    shell.addEventListener('keydown', (event) => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; } if (event.key !== 'Tab') return; const focusable = [...shell.querySelectorAll('input,button:not([disabled])')]; if (!focusable.length) return; const first = focusable[0], last = focusable.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } });
    shell.querySelector('[data-palette-close]').addEventListener('click', close); render(); input.focus();
  }
  PKM.commandPalette = { open, close };
})(window.PKM = window.PKM || {});
