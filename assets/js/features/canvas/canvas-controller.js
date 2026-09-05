(function (PKM) {
  let surface, world, currentMap; let view = { zoom: 1, x: 0, y: 0 };
  function apply() {
    if (!world) return;
    world.style.transform = `translate3d(${view.x}px,${view.y}px,0) scale(${view.zoom})`;
    surface.style.setProperty('--grid-size', `${24 * view.zoom}px`); surface.style.setProperty('--grid-x', `${view.x}px`); surface.style.setProperty('--grid-y', `${view.y}px`);
    document.querySelectorAll('[data-zoom-value]').forEach((el) => { el.textContent = `${Math.round(view.zoom * 100)}%`; });
    document.dispatchEvent(new CustomEvent('pkm:canvaschange', { detail: { ...view } }));
  }
  function init(options) { surface = options.surface; world = options.world; currentMap = options.map; view = { zoom: PKM.state.get().settings.defaultZoom || 1, x: 24, y: 24 }; apply(); }
  function getView() { return { ...view }; }
  function getMap() { return currentMap; }
  function worldSize(map = currentMap) {
    const minWidth = PKM.constants.WORLD_MIN_WIDTH, minHeight = PKM.constants.WORLD_MIN_HEIGHT;
    if (!map) return { width: minWidth, height: minHeight };
    const groupBoxes = (map.groups || []).map((group) => PKM.groupRenderer?.bounds(map, group)).filter(Boolean);
    const width = Math.max(minWidth, ...map.nodes.map((node) => node.x + (PKM.groupRenderer?.nodeSize(node).width || PKM.constants.NODE_CARD_WIDTH) + 80), ...groupBoxes.map((box) => box.x + box.width + 80));
    const height = Math.max(minHeight, ...map.nodes.map((node) => node.y + (PKM.groupRenderer?.nodeSize(node).height || PKM.constants.NODE_CARD_HEIGHT) + 80), ...groupBoxes.map((box) => box.y + box.height + 80));
    return { width: Math.min(PKM.constants.WORLD_MAX_WIDTH, Math.ceil(width / 100) * 100), height: Math.min(PKM.constants.WORLD_MAX_HEIGHT, Math.ceil(height / 100) * 100) };
  }
  function setMap(map) { currentMap = map; }
  function setZoom(next, anchor) {
    const old = view.zoom; const zoom = Math.min(2, Math.max(.5, Math.round(next * 100) / 100)); if (zoom === old) return;
    const rect = surface.getBoundingClientRect(); const point = anchor || { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const localX = point.x - rect.left, localY = point.y - rect.top; const worldX = (localX - view.x) / old, worldY = (localY - view.y) / old;
    view.zoom = zoom; view.x = localX - worldX * zoom; view.y = localY - worldY * zoom; apply();
  }
  function panBy(dx, dy) { view.x += dx; view.y += dy; apply(); }
  function setView(next) { if (Number.isFinite(next.zoom)) view.zoom = Math.min(2, Math.max(.5, next.zoom)); if (Number.isFinite(next.x)) view.x = next.x; if (Number.isFinite(next.y)) view.y = next.y; apply(); }
  function reset() { view = { zoom: PKM.state.get().settings.defaultZoom || 1, x: 24, y: 24 }; apply(); }
  function fit() {
    if (!currentMap?.nodes.length) return reset();
    const collapsed = new Set(currentMap.groups.filter((group) => group.collapsed).map((group) => group.id));
    const boxes = currentMap.nodes.filter((node) => !collapsed.has(node.groupId)).map((node) => { const size = PKM.groupRenderer?.nodeSize(node) || { width: PKM.constants.NODE_CARD_WIDTH, height: PKM.constants.NODE_CARD_HEIGHT }; return { x: node.x, y: node.y, width: size.width, height: size.height }; });
    currentMap.groups.forEach((group) => boxes.push(PKM.groupRenderer.bounds(currentMap, group)));
    const minX = Math.min(...boxes.map((box) => box.x)), minY = Math.min(...boxes.map((box) => box.y)), maxX = Math.max(...boxes.map((box) => box.x + box.width)), maxY = Math.max(...boxes.map((box) => box.y + box.height));
    const rect = surface.getBoundingClientRect(), padX = 48, padTop = 84, padBottom = 56;
    const contentWidth = maxX - minX, contentHeight = maxY - minY, availableHeight = Math.max(1, rect.height - padTop - padBottom);
    const zoom = Math.min(1.35, Math.max(.5, Math.min((rect.width - padX * 2) / contentWidth, availableHeight / contentHeight)));
    view.zoom = zoom; view.x = (rect.width - contentWidth * zoom) / 2 - minX * zoom;
    view.y = padTop + Math.max(0, (availableHeight - contentHeight * zoom) / 2) - minY * zoom; apply();
  }
  function screenToWorld(clientX, clientY) { const rect = surface.getBoundingClientRect(); return { x: (clientX - rect.left - view.x) / view.zoom, y: (clientY - rect.top - view.y) / view.zoom }; }
  PKM.canvas = { init, apply, getView, getMap, worldSize, setMap, setZoom, panBy, setView, reset, fit, screenToWorld };
})(window.PKM = window.PKM || {});
