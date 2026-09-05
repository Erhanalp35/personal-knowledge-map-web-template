(function (PKM) {
  function gridPositions(nodes, columns, gapX, gapY) {
    const output = new Map();
    nodes.forEach((node, index) => output.set(node.id, { x: 100 + (index % columns) * gapX, y: 120 + Math.floor(index / columns) * gapY }));
    return output;
  }
  function radialPositions(nodes) {
    const output = new Map(); const count = nodes.length;
    if (count === 1) { output.set(nodes[0].id, { x: 180, y: 140 }); return output; }
    const rings = []; let remaining = count, radius = 340;
    while (remaining > 0) { const capacity = Math.max(6, Math.floor((Math.PI * 2 * radius) / 300)); const size = Math.min(remaining, capacity); rings.push({ radius, size }); remaining -= size; radius += 340; }
    const center = rings.at(-1).radius + 190; let index = 0;
    rings.forEach((ring, ringIndex) => { for (let offset = 0; offset < ring.size; offset++) { const angle = (Math.PI * 2 * offset) / ring.size - Math.PI / 2 + (ringIndex % 2 ? Math.PI / ring.size : 0); output.set(nodes[index++].id, { x: Math.round(center + Math.cos(angle) * ring.radius - 118), y: Math.round(center + Math.sin(angle) * ring.radius - 76) }); } });
    return output;
  }
  function positions(nodes, type) {
    const count = nodes.length; if (!count) return new Map();
    if (type === 'radial') return radialPositions(nodes);
    const ratio = type === 'horizontal' ? 2 : type === 'vertical' ? .55 : 1.35;
    const columns = Math.max(1, Math.ceil(Math.sqrt(count * ratio)));
    return gridPositions(nodes, columns, type === 'compact' ? 270 : 300, type === 'compact' ? 258 : 280);
  }
  function normalized(nodes, type) {
    const raw = positions(nodes, type); if (!nodes.length) return { positions: raw, width: 0, height: 0 };
    const minX = Math.min(...nodes.map((node) => raw.get(node.id).x)), minY = Math.min(...nodes.map((node) => raw.get(node.id).y));
    const output = new Map(); let width = 0, height = 0;
    nodes.forEach((node) => { const point = raw.get(node.id), x = point.x - minX, y = point.y - minY; output.set(node.id, { x, y }); width = Math.max(width, x + PKM.constants.NODE_CARD_WIDTH); height = Math.max(height, y + PKM.constants.NODE_CARD_HEIGHT); });
    return { positions: output, width, height };
  }
  function mapPositions(map, type) {
    const groupedIds = new Set(); const clusters = [];
    map.groups.forEach((group) => {
      const nodes = map.nodes.filter((node) => node.groupId === group.id); if (!nodes.length) return;
      nodes.forEach((node) => groupedIds.add(node.id)); const layout = normalized(nodes, type);
      clusters.push({ nodes, layout, paddingX: PKM.constants.GROUP_EDGE_PADDING, paddingTop: PKM.constants.GROUP_HEADER_SPACE, width: layout.width + PKM.constants.GROUP_EDGE_PADDING * 2, height: layout.height + PKM.constants.GROUP_HEADER_SPACE + PKM.constants.GROUP_EDGE_PADDING });
    });
    const ungrouped = map.nodes.filter((node) => !groupedIds.has(node.id));
    if (ungrouped.length) { const layout = normalized(ungrouped, type); clusters.push({ nodes: ungrouped, layout, paddingX: 0, paddingTop: 0, width: layout.width, height: layout.height }); }
    const output = new Map(); if (!clusters.length) return output;
    const ratio = type === 'horizontal' ? 2 : type === 'vertical' ? .55 : type === 'compact' ? 1.6 : 1.15;
    const columns = Math.max(1, Math.ceil(Math.sqrt(clusters.length * ratio))), gap = type === 'compact' ? 64 : 88;
    let y = 80;
    for (let start = 0; start < clusters.length; start += columns) {
      const row = clusters.slice(start, start + columns); let x = 100; const rowHeight = Math.max(...row.map((cluster) => cluster.height));
      row.forEach((cluster) => { cluster.nodes.forEach((node) => { const local = cluster.layout.positions.get(node.id); output.set(node.id, { x: Math.round(x + cluster.paddingX + local.x), y: Math.round(y + cluster.paddingTop + local.y) }); }); x += cluster.width + gap; });
      y += rowHeight + gap;
    }
    return output;
  }
  function apply(mapId, type) { const map = PKM.state.mapById(mapId); if (!map) return; const next = mapPositions(map, type); PKM.state.update((state) => { const target = state.maps.find((item) => item.id === mapId); target.nodes.forEach((node) => Object.assign(node, next.get(node.id), { updatedAt: PKM.helpers.now() })); target.updatedAt = PKM.helpers.now(); }, { source: 'layout', historyLabel: `Apply ${type} layout` }); PKM.toast.show('Layout applied'); requestAnimationFrame(() => PKM.canvas.fit()); }
  function open(mapId) { PKM.modal.open({ eyebrow: 'Canvas layout', title: 'Arrange topics', body: `<form class="form-stack"><label class="field"><span>Layout</span><select name="layout" autofocus><option value="grid">Grid</option><option value="horizontal">Horizontal flow</option><option value="vertical">Vertical flow</option><option value="radial">Radial</option><option value="compact">Compact</option></select></label><p class="modal-message">Applying a layout repositions every topic. You can undo it afterward.</p></form>`, confirmLabel: 'Apply layout', onConfirm: (modal) => { apply(mapId, new FormData(modal.querySelector('form')).get('layout')); return true; } }); }
  PKM.autoLayout = { positions, mapPositions, apply, open };
})(window.PKM = window.PKM || {});
