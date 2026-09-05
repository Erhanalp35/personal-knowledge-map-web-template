(function (PKM) {
  function init() { const state = PKM.state.get(); const target = state.settings.restoreLastPage && state.settings.lastPage && state.settings.lastPage !== 'index' ? state.settings.lastPage : 'dashboard'; setTimeout(() => PKM.router.go(target), 80); }
  PKM.pages = PKM.pages || {}; PKM.pages.index = { init };
})(window.PKM = window.PKM || {});
