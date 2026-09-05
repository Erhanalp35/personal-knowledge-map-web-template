(function (PKM) {
  let data = null;
  function init() { if (!data) { data = PKM.storage.load(); PKM.storage.save(data); } return data; }
  function get() { return init(); }
  function update(mutator, detail = {}) {
    const draft = get();
    const before = detail.historyLabel && PKM.history ? PKM.helpers.clone(draft) : null;
    mutator(draft);
    data = PKM.storage.sanitize(draft);
    if (before) PKM.history.record(detail.historyLabel, before, data);
    const saved = PKM.storage.save(data);
    document.dispatchEvent(new CustomEvent('pkm:statechange', { detail: { ...detail, state: data, saved } }));
    return data;
  }
  function replace(next, detail = {}) {
    const before = detail.historyLabel && PKM.history ? PKM.helpers.clone(get()) : null;
    data = PKM.storage.sanitize(next);
    if (before) PKM.history.record(detail.historyLabel, before, data);
    PKM.storage.save(data);
    document.dispatchEvent(new CustomEvent('pkm:statechange', { detail: { ...detail, state: data, saved: true } }));
    return data;
  }
  const activeMap = () => get().maps.find((map) => map.id === get().activeMapId) || null;
  const mapById = (id) => get().maps.find((map) => map.id === id) || null;
  const nodeById = (mapId, nodeId) => mapById(mapId)?.nodes.find((node) => node.id === nodeId) || null;
  const allNodes = () => get().maps.flatMap((map) => map.nodes.map((node) => ({ ...node, mapId: map.id, mapName: map.name })));
  PKM.state = { init, get, update, replace, activeMap, mapById, nodeById, allNodes };
})(window.PKM = window.PKM || {});
