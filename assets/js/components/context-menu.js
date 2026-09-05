(function (PKM) {
  let active = null;
  function close() { active?.remove(); active = null; }
  function open({ x, y, label = 'Actions', items = [] }) {
    close(); const available = items.filter((item) => item && item.label && typeof item.action === 'function'); if (!available.length) return;
    active = document.createElement('div'); active.className = 'context-menu'; active.setAttribute('role', 'menu'); active.setAttribute('aria-label', label);
    active.innerHTML = available.map((item, index) => `<button type="button" role="menuitem" data-menu-index="${index}" class="${item.danger ? 'danger-text' : ''}">${PKM.helpers.icon(item.icon || 'arrow', item.label)}</button>`).join(''); document.body.append(active);
    const rect = active.getBoundingClientRect(); active.style.left = `${Math.max(8, Math.min(x, innerWidth - rect.width - 8))}px`; active.style.top = `${Math.max(8, Math.min(y, innerHeight - rect.height - 8))}px`;
    active.querySelectorAll('[data-menu-index]').forEach((button) => button.addEventListener('click', () => { const item = available[Number(button.dataset.menuIndex)]; close(); item.action(); }));
    active.addEventListener('keydown', (event) => { const buttons = [...active.querySelectorAll('button')]; const index = buttons.indexOf(document.activeElement); if (event.key === 'ArrowDown') { event.preventDefault(); buttons[(index + 1) % buttons.length].focus(); } if (event.key === 'ArrowUp') { event.preventDefault(); buttons[(index - 1 + buttons.length) % buttons.length].focus(); } if (event.key === 'Escape') { event.preventDefault(); close(); } });
    requestAnimationFrame(() => active?.querySelector('button')?.focus());
  }
  document.addEventListener('pointerdown', (event) => { if (active && !active.contains(event.target)) close(); }, true);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  addEventListener('resize', close); addEventListener('blur', close);
  PKM.contextMenu = { open, close };
})(window.PKM = window.PKM || {});
