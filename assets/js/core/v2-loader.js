(function (PKM) {
  const scriptBase = new URL('.', document.currentScript.src);
  const page = document.body.dataset.page || '';
  const cssBase = new URL('../../../', scriptBase);
  const styles = ['assets/css/layout/inspector-v2.css', 'assets/css/layout/navbar-v2.css', 'assets/css/components/groups.css', 'assets/css/components/bulk-actions.css', 'assets/css/components/context-menu.css', 'assets/css/components/command-palette.css', 'assets/css/components/minimap.css', 'assets/css/components/study.css', 'assets/css/pages/v2-pages.css'];
  if (page === 'knowledge-map') styles.push('assets/css/pages/knowledge-map-v2.css', 'assets/css/pages/knowledge-map-interactions.css', 'assets/css/pages/knowledge-map-mobile.css');
  if (page === 'review') styles.push('assets/css/pages/review.css');
  styles.push('assets/css/base/v3-polish.css');
  styles.forEach((path) => { if (document.querySelector(`link[href$="${path.split('/').at(-1)}"]`)) return; const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = new URL(path, cssBase).href; document.head.append(link); });
  const modules = [
    '../features/history/history-manager.js', '../features/backup/backup-manager.js', '../features/templates/map-templates.js',
    '../features/groups/group-manager.js', '../features/groups/group-actions.js', '../features/review/review-manager.js', '../features/review/study-session.js',
    '../features/filters/saved-filters.js', '../features/filters/smart-views.js', '../components/context-menu.js', '../components/command-palette.js', '../components/shortcut-help.js'
  ];
  if (!PKM.exporter) modules.push('../features/import-export/exporter.js');
  if (!PKM.importer) modules.push('../features/import-export/importer.js');
  if (page === 'knowledge-map') modules.push('../features/groups/group-renderer.js', '../features/bulk-actions/bulk-manager.js', '../features/canvas/auto-layout.js', '../features/canvas/minimap.js');
  const load = (path) => new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = new URL(path, scriptBase).href; script.onload = resolve; script.onerror = () => reject(new Error(`Unable to load ${path}`)); document.head.append(script); });
  PKM.v2ModulesReady = modules.reduce((promise, path) => promise.then(() => load(path)), Promise.resolve());
})(window.PKM = window.PKM || {});
