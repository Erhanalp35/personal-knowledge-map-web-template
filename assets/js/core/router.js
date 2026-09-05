(function (PKM) {
  const onIndex = () => !/\/pages\//i.test(location.pathname.replace(/\\/g, '/'));
  const href = (view, params = {}) => {
    const file = view === 'index' ? 'index.html' : `${view}.html`;
    const base = onIndex() ? (view === 'index' ? '' : 'pages/') : (view === 'index' ? '../' : '');
    const query = new URLSearchParams(params).toString();
    return `${base}${file}${query ? `?${query}` : ''}`;
  };
  const go = (view, params) => { location.href = href(view, params); };
  const openMap = (mapId, nodeId = '') => { PKM.state.update((state) => { if (state.maps.some((map) => map.id === mapId)) state.activeMapId = mapId; }, { source: 'map-selection' }); go('knowledge-map', { map: mapId, ...(nodeId ? { node: nodeId } : {}) }); };
  const currentView = () => document.body.dataset.page || 'dashboard';
  PKM.router = { href, go, openMap, currentView, onIndex };
})(window.PKM = window.PKM || {});
