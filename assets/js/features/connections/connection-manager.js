(function (PKM) {
  const { uid, now } = PKM.helpers;
  function create(mapId, sourceId, targetId, type, label = '') {
    const map = PKM.state.mapById(mapId);
    if (!map) return { valid: false, message: 'Map not found.' };
    if (!map.nodes.some((node) => node.id === sourceId) || !map.nodes.some((node) => node.id === targetId)) return { valid: false, message: 'Choose two valid topics.' };
    if (sourceId === targetId) return { valid: false, message: 'A topic cannot connect to itself.' };
    if (!PKM.constants.RELATIONSHIPS.includes(type)) return { valid: false, message: 'Choose a relationship type.' };
    if (map.connections.some((connection) => connection.sourceId === sourceId && connection.targetId === targetId && connection.type === type)) return { valid: false, message: 'This connection already exists.' };
    const stamp = now(); const connection = { id: uid('connection'), sourceId, targetId, type, label: PKM.validators.cleanText(label, 80), createdAt: stamp, updatedAt: stamp };
    PKM.state.update((state) => { const targetMap = state.maps.find((item) => item.id === mapId); targetMap.connections.push(connection); targetMap.updatedAt = stamp; const source = targetMap.nodes.find((node) => node.id === sourceId); const target = targetMap.nodes.find((node) => node.id === targetId); PKM.activity.addToDraft(state, 'connection.created', `Connected “${source.title}” to “${target.title}”`, { mapId, nodeId: sourceId }); }, { source: 'connection', historyLabel: 'Create connection' });
    return { valid: true, value: connection };
  }
  function update(mapId, id, values) {
    const type = typeof values === 'string' ? values : values.type;
    if (!PKM.constants.RELATIONSHIPS.includes(type)) return { valid: false, message: 'Choose a relationship type.' };
    const currentMap = PKM.state.mapById(mapId); const current = currentMap?.connections.find((item) => item.id === id);
    if (!current) return { valid: false, message: 'Connection not found.' };
    if (currentMap.connections.some((item) => item.id !== id && item.sourceId === current.sourceId && item.targetId === current.targetId && item.type === type)) return { valid: false, message: 'This connection already exists.' };
    let found = false;
    PKM.state.update((state) => { const map = state.maps.find((item) => item.id === mapId); const connection = map?.connections.find((item) => item.id === id); if (!connection) return; connection.type = type; if (typeof values === 'object') connection.label = PKM.validators.cleanText(values.label, 80); connection.updatedAt = now(); map.updatedAt = connection.updatedAt; found = true; }, { source: 'connection', historyLabel: 'Edit connection' });
    return found ? { valid: true } : { valid: false, message: 'Connection not found.' };
  }
  function remove(mapId, id) {
    const map = PKM.state.mapById(mapId); const connection = map?.connections.find((item) => item.id === id); if (!connection) return false;
    const source = map.nodes.find((node) => node.id === connection.sourceId); const target = map.nodes.find((node) => node.id === connection.targetId);
    PKM.state.update((state) => { const targetMap = state.maps.find((item) => item.id === mapId); targetMap.connections = targetMap.connections.filter((item) => item.id !== id); targetMap.updatedAt = now(); PKM.activity.addToDraft(state, 'connection.deleted', `Removed connection from “${source?.title || 'topic'}” to “${target?.title || 'topic'}”`, { mapId }); }, { source: 'connection', historyLabel: 'Delete connection' });
    return true;
  }
  function reverse(mapId, id) { const currentMap = PKM.state.mapById(mapId); const current = currentMap?.connections.find((item) => item.id === id); if (!current || ['Related To', 'Similar To'].includes(current.type)) return false; if (currentMap.connections.some((item) => item.id !== id && item.sourceId === current.targetId && item.targetId === current.sourceId && item.type === current.type)) return false; let changed = false; PKM.state.update((state) => { const map = state.maps.find((item) => item.id === mapId); const connection = map?.connections.find((item) => item.id === id); [connection.sourceId, connection.targetId] = [connection.targetId, connection.sourceId]; connection.updatedAt = now(); map.updatedAt = connection.updatedAt; changed = true; }, { source: 'connection', historyLabel: 'Reverse connection' }); return changed; }
  PKM.connections = { create, update, remove, reverse };
})(window.PKM = window.PKM || {});
