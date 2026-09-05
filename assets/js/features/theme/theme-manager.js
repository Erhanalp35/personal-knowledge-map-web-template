(function (PKM) {
  const media = matchMedia('(prefers-color-scheme: dark)');
  function effective(preference) { return preference === 'system' ? (media.matches ? 'dark' : 'light') : preference; }
  function apply(preference = PKM.state.get().settings.theme) {
    const theme = effective(preference);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.dispatchEvent(new CustomEvent('pkm:themechange', { detail: { preference, theme } }));
  }
  function set(preference) {
    if (!['light', 'dark', 'system'].includes(preference)) return;
    PKM.state.update((state) => { state.settings.theme = preference; }, { source: 'theme' });
    apply(preference);
  }
  function toggle() { set(effective(PKM.state.get().settings.theme) === 'dark' ? 'light' : 'dark'); }
  media.addEventListener?.('change', () => { if (PKM.state.get().settings.theme === 'system') apply('system'); });
  PKM.theme = { apply, set, toggle, effective };
})(window.PKM = window.PKM || {});
