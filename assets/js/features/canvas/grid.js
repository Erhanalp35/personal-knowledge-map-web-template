(function (PKM) {
  function apply(surface) { const enabled = PKM.state.get().settings.gridEnabled; surface.classList.toggle('has-grid', enabled); surface.querySelector('[data-grid-toggle]')?.setAttribute('aria-pressed', String(enabled)); }
  function attach(surface, toolbar) { const button = toolbar.querySelector('[data-grid-toggle]'); apply(surface); button?.addEventListener('click', () => { PKM.state.update((state) => { state.settings.gridEnabled = !state.settings.gridEnabled; }, { source: 'grid' }); apply(surface); PKM.toast.show(PKM.state.get().settings.gridEnabled ? 'Grid shown' : 'Grid hidden'); }); }
  PKM.grid = { attach, apply };
})(window.PKM = window.PKM || {});
