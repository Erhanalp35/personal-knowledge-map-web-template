(function (PKM) {
  function packageData(type = 'all', mapId = '') {
    const state = PKM.helpers.clone(PKM.state.get()); let data = state;
    if (type === 'current-map' || type === 'selected-map') { const target = PKM.state.mapById(mapId || state.activeMapId); data = { ...PKM.storage.blankState(), settings: state.settings, maps: target ? [PKM.helpers.clone(target)] : [], activeMapId: target?.id || '', categories: state.categories, tags: state.tags }; }
    return { metadata: { appVersion: PKM.constants.APP_VERSION, exportDate: PKM.helpers.now(), exportType: type }, data };
  }
  function download(type = 'all', mapId = '') {
    try { const payload = packageData(type, mapId); const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); const date = new Date().toISOString().slice(0, 10); anchor.href = url; anchor.download = `knowledge-atlas-${type}-${date}.json`; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); PKM.toast.show('Data exported'); return true; }
    catch (error) { console.error('Export failed.', error); PKM.toast.show('Data could not be exported.', 'error'); return false; }
  }
  PKM.exporter = { packageData, download };
})(window.PKM = window.PKM || {});
