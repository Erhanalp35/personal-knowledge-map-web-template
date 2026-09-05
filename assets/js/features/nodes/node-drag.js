(function (PKM) {
  function attach(layer, map, onSelect) {
    let drag = null; let frame = null;
    layer.addEventListener('pointerdown', (event) => {
      const nodeEl = event.target.closest('.knowledge-node'); if (!nodeEl || event.target.closest('button') || event.button !== 0) return;
      const node = map.nodes.find((item) => item.id === nodeEl.dataset.nodeId); if (!node) return;
      drag = { node, nodeEl, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: node.x, y: node.y, moved: false };
      nodeEl.setPointerCapture(event.pointerId); nodeEl.classList.add('is-dragging'); document.body.classList.add('node-dragging'); if (!event.ctrlKey && !event.metaKey && !event.shiftKey) onSelect(node.id, event);
    });
    layer.addEventListener('pointermove', (event) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const zoom = PKM.canvas.getView().zoom; const minY = drag.node.groupId ? PKM.constants.GROUP_HEADER_SPACE : 0; const x = Math.max(0, drag.x + (event.clientX - drag.startX) / zoom); const y = Math.max(minY, drag.y + (event.clientY - drag.startY) / zoom); drag.moved ||= Math.abs(event.clientX - drag.startX) > 3 || Math.abs(event.clientY - drag.startY) > 3;
      drag.node.x = x; drag.node.y = y; if (frame) cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { drag?.nodeEl && (drag.nodeEl.style.transform = `translate3d(${x}px,${y}px,0)`); PKM.connectionRenderer.updateNode(map, drag.node.id); if (drag.node.groupId) PKM.groupRenderer?.update(document.querySelector('.groups-layer'), map, drag.node.groupId); PKM.minimap?.draw(); });
    });
    const end = (event) => { if (!drag || event.pointerId !== drag.pointerId) return; if (frame) cancelAnimationFrame(frame); drag.nodeEl.classList.remove('is-dragging'); document.body.classList.remove('node-dragging'); if (drag.nodeEl.hasPointerCapture(event.pointerId)) drag.nodeEl.releasePointerCapture(event.pointerId); if (drag.moved) { const finalX = drag.node.x, finalY = drag.node.y; drag.node.x = drag.x; drag.node.y = drag.y; PKM.nodes.move(map.id, drag.node.id, finalX, finalY); } drag = null; };
    layer.addEventListener('pointerup', end); layer.addEventListener('pointercancel', end);
  }
  PKM.nodeDrag = { attach };
})(window.PKM = window.PKM || {});
