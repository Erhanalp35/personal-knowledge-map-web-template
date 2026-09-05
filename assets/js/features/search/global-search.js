(function (PKM) {
  function results(query) {
    const term = String(query || '').trim().toLowerCase(); if (!term) return [];
    const maps = PKM.state.get().maps.filter((map) => `${map.name} ${map.description}`.toLowerCase().includes(term)).map((map) => ({ kind: 'map', id: map.id, mapId: map.id, title: map.name, meta: `${map.nodes.length} topics`, status: 'Knowledge map' }));
    const groups = PKM.state.get().maps.flatMap((map) => map.groups.filter((group) => `${group.name} ${group.description}`.toLowerCase().includes(term)).map((group) => ({ kind: 'group', id: group.id, mapId: map.id, title: group.name, meta: `${map.name} · ${map.nodes.filter((node) => node.groupId === group.id).length} topics`, status: 'Group' })));
    const nodes = PKM.state.allNodes().filter((node) => { const map = PKM.state.mapById(node.mapId); const labels = map?.connections.filter((item) => item.sourceId === node.id || item.targetId === node.id).map((item) => item.label) || []; return [node.title, node.description, node.category, node.notes, node.mapName, ...node.tags, ...labels].join(' ').toLowerCase().includes(term); }).map((node) => ({ kind: 'node', id: node.id, mapId: node.mapId, title: node.title, meta: `${node.mapName} · ${node.category || 'Uncategorized'}`, status: node.status }));
    return [...maps, ...nodes, ...groups].slice(0, 15);
  }
  PKM.globalSearch = { results };
})(window.PKM = window.PKM || {});
