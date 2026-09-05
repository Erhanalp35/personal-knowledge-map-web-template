(function (PKM) {
  const { uid, now } = PKM.helpers;
  function create(mapId, values, position = {}) {
    const result = PKM.validators.group(values); if (!result.valid) return result; let created;
    PKM.state.update((state) => { const map = state.maps.find((item) => item.id === mapId); if (!map) return; const stamp = now(); created = { id: uid('group'), ...result.value, collapsed: false, x: Number.isFinite(Number(position.x)) ? Number(position.x) : 100, y: Number.isFinite(Number(position.y)) ? Number(position.y) : 100, createdAt: stamp, updatedAt: stamp }; map.groups.push(created); map.updatedAt = stamp; PKM.activity.addToDraft(state, 'group.created', `Created group “${created.name}”`, { mapId, groupId: created.id }); }, { source: 'group', historyLabel: 'Create group' });
    return created ? { valid: true, value: created } : { valid: false, message: 'Map not found.' };
  }
  function update(mapId, groupId, values) {
    const result = PKM.validators.group(values); if (!result.valid) return result; let found = false;
    PKM.state.update((state) => { const map = state.maps.find((item) => item.id === mapId); const group = map?.groups.find((item) => item.id === groupId); if (!group) return; Object.assign(group, result.value, { updatedAt: now() }); map.updatedAt = group.updatedAt; found = true; }, { source: 'group', historyLabel: 'Edit group' });
    return found ? { valid: true } : { valid: false, message: 'Group not found.' };
  }
  function toggle(mapId, groupId) { const current = PKM.state.mapById(mapId)?.groups.find((item) => item.id === groupId); if (!current) return false; const historyLabel = current.collapsed ? 'Expand group' : 'Collapse group'; PKM.state.update((state) => { const map = state.maps.find((item) => item.id === mapId); const group = map.groups.find((item) => item.id === groupId); if (!group.collapsed) { const members = map.nodes.filter((node) => node.groupId === groupId); if (members.length) { group.x = Math.max(0, Math.min(...members.map((node) => node.x)) - 28); group.y = Math.max(0, Math.min(...members.map((node) => node.y)) - 70); } } group.collapsed = !group.collapsed; group.updatedAt = now(); map.updatedAt = group.updatedAt; }, { source: 'group', historyLabel }); return true; }
  function assign(mapId, nodeIds, groupId = '') {
    PKM.state.update((state) => { const map = state.maps.find((item) => item.id === mapId); if (!map || (groupId && !map.groups.some((group) => group.id === groupId))) return; map.nodes.filter((node) => nodeIds.includes(node.id)).forEach((node) => { node.groupId = groupId; node.updatedAt = now(); }); map.updatedAt = now(); }, { source: 'group', historyLabel: groupId ? 'Move topics to group' : 'Remove topics from group' });
  }
  function remove(mapId, groupId, deleteNodes = false) {
    PKM.state.update((state) => { const map = state.maps.find((item) => item.id === mapId); const group = map?.groups.find((item) => item.id === groupId); if (!group) return; const nodeIds = new Set(map.nodes.filter((node) => node.groupId === groupId).map((node) => node.id)); map.groups = map.groups.filter((item) => item.id !== groupId); if (deleteNodes) { map.nodes = map.nodes.filter((node) => !nodeIds.has(node.id)); map.connections = map.connections.filter((connection) => !nodeIds.has(connection.sourceId) && !nodeIds.has(connection.targetId)); } else map.nodes.forEach((node) => { if (node.groupId === groupId) node.groupId = ''; }); map.updatedAt = now(); PKM.activity.addToDraft(state, 'group.deleted', `Deleted group “${group.name}”${deleteNodes ? ' and its topics' : ''}`, { mapId }); }, { source: 'group', historyLabel: 'Delete group' });
  }
  PKM.groups = { create, update, toggle, assign, remove };
})(window.PKM = window.PKM || {});
