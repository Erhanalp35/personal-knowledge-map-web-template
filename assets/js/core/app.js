(function (PKM) {
  function applyPreferences() { const settings = PKM.state.get().settings; document.documentElement.dataset.animations = settings.animations && !settings.reduceMotion ? 'on' : 'off'; document.documentElement.dataset.contrast = settings.highContrast ? 'high' : 'normal'; document.documentElement.dataset.density = settings.compactDensity ? 'compact' : 'comfortable'; }
  function start() {
    PKM.state.init(); PKM.theme.apply(); applyPreferences(); const page = PKM.router.currentView(); if (page === 'knowledge-map') scrollTo(0, 0);
    if (page !== 'index' && PKM.state.get().settings.restoreLastPage && PKM.state.get().settings.lastPage !== page) PKM.state.update((state) => { state.settings.lastPage = page; }, { source: 'navigation' });
    PKM.navbar?.render(); PKM.sidebar?.render(); PKM.pages?.[page]?.init?.();
    document.addEventListener('pkm:statechange', (event) => { applyPreferences(); if (!['node-position', 'grid'].includes(event.detail.source)) { PKM.navbar?.render(); PKM.sidebar?.render(); } });
    document.addEventListener('keydown', (event) => {
      const typing = PKM.helpers.isTyping(event.target);
      if (!typing && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); PKM.commandPalette?.open(); return; }
      if (!typing && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? PKM.history?.redo() : PKM.history?.undo(); return; }
      if (!typing && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') { event.preventDefault(); PKM.history?.redo(); return; }
      if (typing) return;
      if (event.key === '/') { event.preventDefault(); document.querySelector('[data-global-search]')?.focus(); }
      if (event.key.toLowerCase() === 'n' && page === 'knowledge-map') { event.preventDefault(); PKM.nodeActions.openCreate(); }
      if (event.key === '0' && page === 'knowledge-map') { event.preventDefault(); PKM.canvas.reset(); }
      if (event.key === '?' && event.shiftKey) { event.preventDefault(); PKM.shortcutHelp?.open(); }
    });
  }
  function init() { Promise.resolve(PKM.v2Ready).then(start).catch((error) => { console.error(error); start(); }); }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})(window.PKM = window.PKM || {});
