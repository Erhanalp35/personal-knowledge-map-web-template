(function (PKM) {
  const { uid, now } = PKM.helpers;
  function create(values) {
    const validation = PKM.validators.mapName(values.name, PKM.state.get().maps);
    if (!validation.valid) return validation;
    const stamp = now();
    const template = PKM.mapTemplates?.build(values.template || 'blank', stamp) || { nodes: [], connections: [], groups: [] };
    const map = { id: uid('map'), name: validation.value, description: PKM.validators.cleanText(values.description, 300), createdAt: stamp, updatedAt: stamp, nodes: template.nodes, connections: template.connections, groups: template.groups, settings: {} };
    PKM.state.update((state) => { state.maps.push(map); state.activeMapId = map.id; if (!state.settings.defaultMapId) state.settings.defaultMapId = map.id; PKM.categories.syncDraft(state); PKM.tags.syncDraft(state); PKM.activity.addToDraft(state, 'map.created', `Created map “${map.name}”`, { mapId: map.id }); }, { source: 'map', historyLabel: 'Create map' });
    return { valid: true, value: map };
  }
  function rename(id, values) {
    const state = PKM.state.get();
    const validation = PKM.validators.mapName(values.name, state.maps, id);
    if (!validation.valid) return validation;
    let updated;
    PKM.state.update((draft) => {
      const map = draft.maps.find((item) => item.id === id);
      if (!map) return;
      const previous = map.name;
      map.name = validation.value;
      map.description = PKM.validators.cleanText(values.description, 300);
      map.updatedAt = now();
      updated = map;
      PKM.activity.addToDraft(draft, 'map.renamed', `Renamed “${previous}” to “${map.name}”`, { mapId: map.id });
    }, { source: 'map', historyLabel: 'Edit map' });
    return updated ? { valid: true, value: updated } : { valid: false, message: 'Map not found.' };
  }
  function duplicate(id) {
    const source = PKM.state.mapById(id);
    if (!source) return null;
    const state = PKM.state.get();
    let base = `${source.name} Copy`;
    let index = 2;
    while (state.maps.some((map) => map.name.toLowerCase() === base.toLowerCase())) base = `${source.name} Copy ${index++}`;
    const stamp = now();
    const nodeIds = {}; const groupIds = {};
    (source.groups || []).forEach((group) => { groupIds[group.id] = uid('group'); });
    const copy = {
      ...source, id: uid('map'), name: base, createdAt: stamp, updatedAt: stamp,
      groups: (source.groups || []).map((group) => ({ ...group, id: groupIds[group.id], x: group.x + 32, y: group.y + 32, createdAt: stamp, updatedAt: stamp })),
      nodes: source.nodes.map((node) => { const id = uid('node'); nodeIds[node.id] = id; return { ...node, id, groupId: groupIds[node.groupId] || '', x: node.x + 32, y: node.y + 32, createdAt: stamp, updatedAt: stamp }; }),
      connections: source.connections.map((connection) => ({ ...connection, id: uid('connection'), sourceId: nodeIds[connection.sourceId], targetId: nodeIds[connection.targetId], createdAt: stamp, updatedAt: stamp })), settings: { ...(source.settings || {}) }
    };
    PKM.state.update((draft) => { draft.maps.push(copy); draft.activeMapId = copy.id; PKM.activity.addToDraft(draft, 'map.created', `Duplicated map “${source.name}”`, { mapId: copy.id }); }, { source: 'map', historyLabel: 'Duplicate map' });
    return copy;
  }
  function remove(id) {
    const source = PKM.state.mapById(id);
    if (!source) return false;
    PKM.state.update((state) => {
      if (state.settings.automaticBackups) PKM.backups?.addToDraft(state, `Before deleting map ${source.name}`);
      state.maps = state.maps.filter((map) => map.id !== id);
      if (state.activeMapId === id) state.activeMapId = state.maps[0]?.id || '';
      if (state.settings.defaultMapId === id) state.settings.defaultMapId = state.maps[0]?.id || '';
      PKM.activity.addToDraft(state, 'map.deleted', `Deleted map “${source.name}”`);
    }, { source: 'map', historyLabel: 'Delete map' });
    return true;
  }
  function activate(id) {
    if (!PKM.state.mapById(id)) return false;
    PKM.state.update((state) => { state.activeMapId = id; }, { source: 'map-selection' });
    return true;
  }
  PKM.maps = { create, rename, duplicate, remove, activate };
})(window.PKM = window.PKM || {});
