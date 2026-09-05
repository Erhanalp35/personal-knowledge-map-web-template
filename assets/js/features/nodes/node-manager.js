(function (PKM) {
  const { uid, now } = PKM.helpers;
  function create(mapId, values, position = {}) {
    const validation = PKM.validators.node(values);
    if (!validation.valid) return validation;
    let created;
    PKM.state.update((state) => {
      const map = state.maps.find((item) => item.id === mapId);
      if (!map) return;
      const stamp = now();
      if (validation.value.groupId && !map.groups.some((group) => group.id === validation.value.groupId)) validation.value.groupId = '';
      created = { id: uid('node'), ...validation.value, favorite: false, x: Number.isFinite(Number(position.x)) ? Number(position.x) : 180 + (map.nodes.length % 5) * 250, y: Number.isFinite(Number(position.y)) ? Number(position.y) : 140 + Math.floor(map.nodes.length / 5) * 190, lastReviewedAt: '', reviewCount: 0, nextReviewAt: '', reviewPriority: 'Normal', createdAt: stamp, updatedAt: stamp };
      map.nodes.push(created); map.updatedAt = stamp;
      PKM.categories.syncDraft(state); PKM.tags.syncDraft(state);
      PKM.activity.addToDraft(state, 'node.created', `Created topic “${created.title}” in ${map.name}`, { mapId, nodeId: created.id });
    }, { source: 'node', historyLabel: 'Create topic' });
    return created ? { valid: true, value: created } : { valid: false, message: 'Create a map before adding a topic.' };
  }
  function update(mapId, nodeId, values) {
    const validation = PKM.validators.node(values);
    if (!validation.valid) return validation;
    let updated;
    PKM.state.update((state) => {
      const map = state.maps.find((item) => item.id === mapId);
      const node = map?.nodes.find((item) => item.id === nodeId);
      if (!node) return;
      const previousStatus = node.status;
      if (validation.value.groupId && !map.groups.some((group) => group.id === validation.value.groupId)) validation.value.groupId = '';
      Object.assign(node, validation.value, { updatedAt: now() });
      map.updatedAt = node.updatedAt; updated = node;
      PKM.categories.syncDraft(state); PKM.tags.syncDraft(state);
      PKM.activity.addToDraft(state, 'node.edited', `Updated topic “${node.title}”`, { mapId, nodeId });
      if (previousStatus !== 'Mastered' && node.status === 'Mastered') PKM.activity.addToDraft(state, 'node.mastered', `Mastered “${node.title}”`, { mapId, nodeId });
    }, { source: 'node', historyLabel: 'Edit topic' });
    return updated ? { valid: true, value: updated } : { valid: false, message: 'Topic not found.' };
  }
  function duplicate(mapId, nodeId) {
    const map = PKM.state.mapById(mapId);
    const source = map?.nodes.find((node) => node.id === nodeId);
    if (!source) return null;
    const stamp = now();
    const copy = { ...source, id: uid('node'), title: `${source.title} Copy`, x: source.x + 36, y: source.y + 36, createdAt: stamp, updatedAt: stamp };
    PKM.state.update((state) => { const targetMap = state.maps.find((item) => item.id === mapId); targetMap.nodes.push(copy); targetMap.updatedAt = stamp; PKM.activity.addToDraft(state, 'node.created', `Duplicated topic “${source.title}”`, { mapId, nodeId: copy.id }); }, { source: 'node', historyLabel: 'Duplicate topic' });
    return copy;
  }
  function remove(mapId, nodeId) {
    const map = PKM.state.mapById(mapId);
    const node = map?.nodes.find((item) => item.id === nodeId);
    if (!node) return false;
    PKM.state.update((state) => {
      const targetMap = state.maps.find((item) => item.id === mapId);
      targetMap.nodes = targetMap.nodes.filter((item) => item.id !== nodeId);
      targetMap.connections = targetMap.connections.filter((connection) => connection.sourceId !== nodeId && connection.targetId !== nodeId);
      targetMap.updatedAt = now(); PKM.categories.syncDraft(state); PKM.tags.syncDraft(state);
      PKM.activity.addToDraft(state, 'node.deleted', `Deleted topic “${node.title}”`, { mapId });
    }, { source: 'node', historyLabel: 'Delete topic' });
    return true;
  }
  function move(mapId, nodeId, x, y) {
    PKM.state.update((state) => { const map = state.maps.find((item) => item.id === mapId); const node = map?.nodes.find((item) => item.id === nodeId); if (node) { node.x = Math.round(x); node.y = Math.round(y); node.updatedAt = now(); map.updatedAt = node.updatedAt; } }, { source: 'node-position', historyLabel: 'Move topic' });
  }
  function toggleFavorite(mapId, nodeId) {
    let favorite = false;
    PKM.state.update((state) => { const map = state.maps.find((item) => item.id === mapId); const node = map?.nodes.find((item) => item.id === nodeId); if (!node) return; node.favorite = !node.favorite; favorite = node.favorite; node.updatedAt = now(); map.updatedAt = node.updatedAt; PKM.activity.addToDraft(state, 'favorite.changed', `${favorite ? 'Added' : 'Removed'} “${node.title}” ${favorite ? 'to' : 'from'} favorites`, { mapId, nodeId }); }, { source: 'favorite', historyLabel: 'Change favorite' });
    return favorite;
  }
  function patch(mapId, nodeId, values, label = 'Quick edit topic') { let updated = false; PKM.state.update((state) => { const map = state.maps.find((item) => item.id === mapId); const node = map?.nodes.find((item) => item.id === nodeId); if (!node) return; if (values.status && PKM.constants.STATUS.includes(values.status)) node.status = values.status; if (values.importance && PKM.constants.IMPORTANCE.includes(values.importance)) node.importance = values.importance; if (Object.hasOwn(values, 'category')) node.category = PKM.validators.cleanText(values.category, 60); if (Object.hasOwn(values, 'groupId')) node.groupId = !values.groupId || map.groups.some((group) => group.id === values.groupId) ? values.groupId : ''; if (Object.hasOwn(values, 'favorite')) node.favorite = Boolean(values.favorite); node.updatedAt = now(); map.updatedAt = node.updatedAt; PKM.categories.syncDraft(state); updated = true; }, { source: 'node-quick-edit', historyLabel: label }); return updated; }
  PKM.nodes = { create, update, duplicate, remove, move, toggleFavorite, patch };
})(window.PKM = window.PKM || {});
