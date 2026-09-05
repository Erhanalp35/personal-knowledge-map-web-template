(function () {
  try {
    const raw = localStorage.getItem('pkm_app_state_v2') || localStorage.getItem('pkm_app_state_v1');
    const preference = raw ? JSON.parse(raw)?.settings?.theme : 'light';
    const theme = preference === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : (preference === 'dark' ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme;
  } catch (_) { document.documentElement.dataset.theme = 'light'; }
})();
