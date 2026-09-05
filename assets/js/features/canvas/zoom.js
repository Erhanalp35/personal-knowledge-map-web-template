(function (PKM) {
  function attach(surface, toolbar) {
    toolbar.querySelector('[data-zoom-in]')?.addEventListener('click', () => PKM.canvas.setZoom(PKM.canvas.getView().zoom + .1));
    toolbar.querySelector('[data-zoom-out]')?.addEventListener('click', () => PKM.canvas.setZoom(PKM.canvas.getView().zoom - .1));
    toolbar.querySelector('[data-reset-view]')?.addEventListener('click', PKM.canvas.reset);
    toolbar.querySelector('[data-fit-map]')?.addEventListener('click', PKM.canvas.fit);
    surface.addEventListener('wheel', (event) => { event.preventDefault(); PKM.canvas.setZoom(PKM.canvas.getView().zoom + (event.deltaY < 0 ? .08 : -.08), { x: event.clientX, y: event.clientY }); }, { passive: false });
  }
  PKM.zoom = { attach };
})(window.PKM = window.PKM || {});
