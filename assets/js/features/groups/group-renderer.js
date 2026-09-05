(function (PKM) {
  const nodeSize = (node) => {
    const element = document.querySelector(`[data-node-id="${CSS.escape(node.id)}"]`);
    return {
      width: Math.max(PKM.constants.NODE_CARD_WIDTH, element?.offsetWidth || 0),
      height: Math.max(PKM.constants.NODE_CARD_HEIGHT, element?.offsetHeight || 0)
    };
  };
  const bounds = (map, group) => {
    const members = map.nodes.filter((node) => node.groupId === group.id); if (group.collapsed) return { x: group.x, y: group.y, width: 250, height: 92, members };
    if (!members.length) return { x: group.x, y: group.y, width: 310, height: 190, members };
    const padding = PKM.constants.GROUP_EDGE_PADDING, headerSpace = PKM.constants.GROUP_HEADER_SPACE;
    const minX = Math.max(0, Math.min(...members.map((node) => node.x)) - padding), minY = Math.max(0, Math.min(...members.map((node) => node.y)) - headerSpace);
    const maxX = Math.max(...members.map((node) => node.x + nodeSize(node).width)) + padding;
    const maxY = Math.max(...members.map((node) => node.y + nodeSize(node).height)) + padding;
    return { x: minX, y: minY, width: Math.max(310, maxX - minX), height: Math.max(190, maxY - minY), members };
  };
  function card(map, group) { const box = bounds(map, group); const progress = PKM.progress.calculate(box.members); return `<section class="node-group ${group.collapsed ? 'is-collapsed' : ''}" data-group-id="${group.id}" style="--group-accent:${group.accent};transform:translate3d(${box.x}px,${box.y}px,0);width:${box.width}px;height:${box.height}px"><header class="node-group__header"><span class="node-group__swatch"></span><span class="node-group__copy"><strong>${PKM.helpers.escapeHtml(group.name)}</strong><small>${box.members.length} topic${box.members.length === 1 ? '' : 's'} · ${progress.percentage}% mastered</small></span><button type="button" data-group-toggle="${group.id}" aria-label="${group.collapsed ? 'Expand' : 'Collapse'} ${PKM.helpers.escapeHtml(group.name)}">${PKM.helpers.icon('chevron')}</button><button type="button" data-group-menu="${group.id}" aria-label="Group actions">${PKM.helpers.icon('dots')}</button></header><span class="node-group__progress"><span style="width:${progress.percentage}%"></span></span>${group.description && !group.collapsed ? `<p>${PKM.helpers.escapeHtml(group.description)}</p>` : ''}</section>`; }
  function render(layer, map) { if (!layer) return; layer.innerHTML = map.groups.map((group) => card(map, group)).join(''); }
  function update(layer, map, groupId) { const group = map.groups.find((item) => item.id === groupId); const current = layer?.querySelector(`[data-group-id="${CSS.escape(groupId)}"]`); if (!group || !current) return; const template = document.createElement('template'); template.innerHTML = card(map, group); current.replaceWith(template.content.firstElementChild); }
  const groupCenter = (map, groupId) => { const group = map.groups.find((item) => item.id === groupId); if (!group) return null; const box = bounds(map, group); return { x: box.x + box.width / 2, y: box.y + box.height / 2 }; };
  PKM.groupRenderer = { render, update, bounds, groupCenter, nodeSize };
})(window.PKM = window.PKM || {});
