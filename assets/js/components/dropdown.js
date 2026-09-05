(function (PKM) {
  function close(dropdown, restore = false) { if (!dropdown) return; dropdown.classList.remove('is-open'); const trigger = dropdown.querySelector('[data-dropdown-trigger]'); trigger?.setAttribute('aria-expanded', 'false'); if (restore) trigger?.focus(); }
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-dropdown-trigger]'); const target = trigger?.closest('.dropdown');
    document.querySelectorAll('.dropdown.is-open').forEach((dropdown) => { if (dropdown !== target) close(dropdown); });
    if (!trigger || !target) return;
    event.preventDefault(); const opening = !target.classList.contains('is-open'); target.classList.toggle('is-open', opening); trigger.setAttribute('aria-expanded', String(opening));
    if (opening) { const menu = target.querySelector('.dropdown__menu'), rect = trigger.getBoundingClientRect(); requestAnimationFrame(() => { const width = menu.getBoundingClientRect().width; menu.style.left = `${Math.max(8, Math.min(innerWidth - width - 8, rect.right - width))}px`; menu.style.top = `${Math.max(8, Math.min(innerHeight - menu.getBoundingClientRect().height - 8, rect.bottom + 5))}px`; menu.querySelector('button')?.focus(); }); }
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') document.querySelectorAll('.dropdown.is-open').forEach((dropdown) => close(dropdown, true)); });
  addEventListener('resize', () => document.querySelectorAll('.dropdown.is-open').forEach((dropdown) => close(dropdown)));
  PKM.dropdown = {};
})(window.PKM = window.PKM || {});
