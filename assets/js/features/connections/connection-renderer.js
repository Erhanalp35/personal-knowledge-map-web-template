(function (PKM) {
  let svg = null; let map = null; let nodeLayer = null;
  const directed = (type) => ['Depends On', 'Part Of', 'Leads To'].includes(type);
  function point(nodeId) {
    const node = map.nodes.find((item) => item.id === nodeId); if (!node) return null;
    const group = map.groups.find((item) => item.id === node.groupId && item.collapsed); if (group) return PKM.groupRenderer.groupCenter(map, group.id);
    const element = nodeLayer.querySelector(`[data-node-id="${CSS.escape(nodeId)}"]`); return { x: node.x + (element?.offsetWidth || 236) / 2, y: node.y + (element?.offsetHeight || 142) / 2 };
  }
  function geometry(connection) {
    const source = point(connection.sourceId), target = point(connection.targetId); if (!source || !target) return null;
    const bend = Math.max(70, Math.abs(target.x - source.x) * .42); const direction = target.x >= source.x ? 1 : -1;
    return { path: `M ${source.x} ${source.y} C ${source.x + bend * direction} ${source.y}, ${target.x - bend * direction} ${target.y}, ${target.x} ${target.y}`, x: (source.x + target.x) / 2, y: (source.y + target.y) / 2 };
  }
  function group(connection) {
    const geo = geometry(connection); if (!geo) return ''; const text = connection.label || connection.type; const width = Math.min(150, Math.max(70, text.length * 6.2 + 20)); const show = PKM.state.get().settings.connectionLabels;
    return `<g class="connection ${show ? 'show-label' : ''}" data-connection-id="${connection.id}" tabindex="0" role="button" aria-label="${PKM.helpers.escapeHtml(connection.type)} connection${connection.label ? `, ${PKM.helpers.escapeHtml(connection.label)}` : ''}"><path class="connection__line" d="${geo.path}" ${directed(connection.type) ? 'marker-end="url(#arrowhead)"' : ''}></path><path class="connection__hit" d="${geo.path}"></path><g class="connection__label" transform="translate(${geo.x} ${geo.y})"><rect x="${-width / 2}" y="-11" width="${width}" height="22" rx="11"></rect><text text-anchor="middle" dy="4">${PKM.helpers.escapeHtml(text)}</text></g></g>`;
  }
  function render(target, currentMap, nodes) { svg = target; map = currentMap; nodeLayer = nodes; svg.innerHTML = `<defs><marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M0 0 L10 5 L0 10 z"></path></marker></defs>${map.connections.map(group).join('')}`; }
  function updateNode(currentMap, nodeId) { map = currentMap; map.connections.filter((connection) => connection.sourceId === nodeId || connection.targetId === nodeId).forEach((connection) => { const element = svg?.querySelector(`[data-connection-id="${CSS.escape(connection.id)}"]`); const geo = geometry(connection); if (!element || !geo) return; element.querySelectorAll('path').forEach((path) => path.setAttribute('d', geo.path)); element.querySelector('.connection__label')?.setAttribute('transform', `translate(${geo.x} ${geo.y})`); }); }
  PKM.connectionRenderer = { render, updateNode, directed };
})(window.PKM = window.PKM || {});
