(function (PKM) {
  let region;
  function ensure() { if (!region) { region = document.createElement('div'); region.className = 'toast-region'; region.setAttribute('aria-live', 'polite'); document.body.append(region); } return region; }
  function show(message, tone = 'success') {
    const toast = document.createElement('div'); toast.className = `toast toast--${tone}`; toast.setAttribute('role', 'status'); toast.innerHTML = `<span class="toast__dot"></span><span>${PKM.helpers.escapeHtml(message)}</span>`; ensure().append(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => { toast.classList.remove('is-visible'); setTimeout(() => toast.remove(), 220); }, 3000);
  }
  PKM.toast = { show };
})(window.PKM = window.PKM || {});
