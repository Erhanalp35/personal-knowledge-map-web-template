(function (PKM) {
  function setMobile(open) {
    document.body.classList.toggle('sidebar-open', open);
    const root = document.getElementById('app-sidebar');
    if (!root) return;
    const mobile = matchMedia('(max-width: 820px)').matches;
    root.inert = mobile && !open;
    if (mobile && !open) root.setAttribute('aria-hidden', 'true'); else root.removeAttribute('aria-hidden');
  }
  function mapItem(map, active) {
    return `<li class="map-list__item ${active ? 'is-active' : ''}"><button class="map-list__open" type="button" data-open-map="${map.id}" title="Open ${PKM.helpers.escapeHtml(map.name)}"><span class="map-avatar">${PKM.helpers.escapeHtml(map.name.slice(0, 1).toUpperCase())}</span><span><strong>${PKM.helpers.escapeHtml(map.name)}</strong><small>${map.nodes.length} topic${map.nodes.length === 1 ? '' : 's'}</small></span></button><div class="dropdown"><button class="icon-button icon-button--small" type="button" data-dropdown-trigger aria-haspopup="menu" aria-expanded="false" aria-label="Actions for ${PKM.helpers.escapeHtml(map.name)}">${PKM.helpers.icon('dots')}</button><div class="dropdown__menu" role="menu"><button type="button" role="menuitem" data-map-action="rename" data-map-id="${map.id}">${PKM.helpers.icon('edit', 'Rename')}</button><button type="button" role="menuitem" data-map-action="duplicate" data-map-id="${map.id}">${PKM.helpers.icon('copy', 'Duplicate')}</button><button type="button" role="menuitem" class="danger-text" data-map-action="delete" data-map-id="${map.id}">${PKM.helpers.icon('trash', 'Delete')}</button></div></div></li>`;
  }
  function render() {
    const root = document.getElementById('app-sidebar'); if (!root) return;
    const state = PKM.state.get(); const view = PKM.router.currentView();
    root.className = `sidebar ${state.settings.sidebarCollapsed ? 'is-collapsed' : ''}`;
    root.innerHTML = `<div class="sidebar__mobile-head"><strong>Navigation</strong><button class="icon-button" type="button" data-close-sidebar aria-label="Close navigation">${PKM.helpers.icon('close')}</button></div><nav aria-label="Primary navigation"><ul class="nav-list">${PKM.constants.NAV_ITEMS.map((item) => `<li><a class="nav-link ${view === item.id ? 'is-active' : ''}" href="${PKM.router.href(item.id)}" ${view === item.id ? 'aria-current="page"' : ''}>${PKM.helpers.icon(item.icon, item.label)}</a></li>`).join('')}</ul></nav><div class="sidebar__mobile-tools"><button class="nav-link" type="button" data-sidebar-command>${PKM.helpers.icon('command', 'Commands')}</button><button class="nav-link" type="button" data-sidebar-shortcuts>${PKM.helpers.icon('keyboard', 'Shortcuts')}</button></div><div class="sidebar__maps"><div class="sidebar__section-head"><span>My maps</span><button class="icon-button icon-button--small" type="button" data-create-map aria-label="Create map" data-tooltip="Create map">${PKM.helpers.icon('plus')}</button></div>${state.maps.length ? `<ul class="map-list">${state.maps.map((map) => mapItem(map, map.id === state.activeMapId)).join('')}</ul>` : PKM.emptyState.render({ icon: 'map', title: 'No maps yet', message: 'Create a map to start organizing what you learn.', action: 'create-map', actionLabel: 'Create map' })}</div><button class="sidebar__collapse" type="button" data-collapse-sidebar>${PKM.helpers.icon('panel')}<span>${state.settings.sidebarCollapsed ? 'Expand' : 'Collapse'} sidebar</span></button><button class="sidebar__scrim" type="button" data-close-sidebar aria-label="Close navigation"></button>`;
    root.querySelectorAll('[data-create-map], [data-empty-action="create-map"]').forEach((button) => button.addEventListener('click', PKM.mapActions.create));
    root.querySelectorAll('[data-open-map]').forEach((button) => button.addEventListener('click', () => PKM.router.openMap(button.dataset.openMap)));
    root.querySelectorAll('[data-map-action]').forEach((button) => button.addEventListener('click', () => PKM.mapActions[button.dataset.mapAction === 'delete' ? 'remove' : button.dataset.mapAction]?.(button.dataset.mapId)));
    root.querySelectorAll('[data-close-sidebar]').forEach((button) => button.addEventListener('click', () => setMobile(false)));
    root.querySelector('[data-sidebar-command]')?.addEventListener('click', () => { setMobile(false); PKM.commandPalette?.open(); });
    root.querySelector('[data-sidebar-shortcuts]')?.addEventListener('click', () => { setMobile(false); PKM.shortcutHelp?.open(); });
    root.querySelector('[data-collapse-sidebar]')?.addEventListener('click', () => { PKM.state.update((draft) => { draft.settings.sidebarCollapsed = !draft.settings.sidebarCollapsed; }, { source: 'sidebar' }); });
    setMobile(document.body.classList.contains('sidebar-open'));
  }
  addEventListener('resize', PKM.helpers.debounce(() => setMobile(document.body.classList.contains('sidebar-open')), 100));
  PKM.sidebar = { render, setMobile };
})(window.PKM = window.PKM || {});

(function (PKM) {
  if (PKM.v2Ready) return;
  const source = document.currentScript.src;
  PKM.v2Ready = new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = new URL('../core/v2-loader.js', source).href; script.onload = () => Promise.resolve(PKM.v2ModulesReady).then(resolve, reject); script.onerror = () => reject(new Error('Unable to load the V2 feature modules.')); document.head.append(script); });
})(window.PKM = window.PKM || {});
