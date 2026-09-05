(function (PKM) {
  function attach(surface) {
    let start = null;
    surface.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || event.shiftKey || event.target.closest('.knowledge-node, .connection, .node-group, button, input, select')) return;
      start = { x: event.clientX, y: event.clientY }; surface.setPointerCapture(event.pointerId); surface.classList.add('is-panning');
    });
    surface.addEventListener('pointermove', (event) => { if (!start) return; PKM.canvas.panBy(event.clientX - start.x, event.clientY - start.y); start = { x: event.clientX, y: event.clientY }; });
    const end = (event) => { if (!start) return; start = null; surface.classList.remove('is-panning'); if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId); };
    surface.addEventListener('pointerup', end); surface.addEventListener('pointercancel', end);
  }
  PKM.pan = { attach };
})(window.PKM = window.PKM || {});
