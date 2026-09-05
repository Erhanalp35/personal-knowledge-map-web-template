(function (PKM) {
  let active = null;
  let restoreTarget = null;
  let restoreSelector = '';
  function selectorFor(element) {
    if (!element?.matches) return '';
    if (element.id) return `#${CSS.escape(element.id)}`;
    const data = [...element.attributes].find((attribute) => attribute.name.startsWith('data-') && attribute.name !== 'data-tooltip');
    if (data) return `[${data.name}${data.value ? `="${CSS.escape(data.value)}"` : ''}]`;
    const href = element.getAttribute('href'); if (href) return `[href="${CSS.escape(href)}"]`;
    const label = element.getAttribute('aria-label'); return label ? `${element.tagName.toLowerCase()}[aria-label="${CSS.escape(label)}"]` : '';
  }
  function close(reason = 'dismiss') {
    if (!active) return;
    const onClose = active._onClose;
    active.remove(); active = null;
    document.body.classList.remove('modal-open');
    const replacement = restoreSelector ? document.querySelector(restoreSelector) : null;
    const fallback = [...document.querySelectorAll('[data-add-node], [data-page-add-node], main button, [data-create-map], a[href]')].find((element) => !element.disabled && element.getClientRects().length);
    (restoreTarget?.isConnected ? restoreTarget : replacement || fallback)?.focus();
    restoreTarget = null; restoreSelector = '';
    onClose?.(reason);
  }
  function open(options) {
    close('replace'); restoreTarget = document.activeElement; restoreSelector = selectorFor(restoreTarget);
    const shell = document.createElement('div');
    shell.className = 'modal-layer';
    shell.innerHTML = `<div class="modal-backdrop" data-modal-close></div><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal__header"><div><p class="eyebrow">${PKM.helpers.escapeHtml(options.eyebrow || '')}</p><h2 id="modal-title">${PKM.helpers.escapeHtml(options.title)}</h2></div><button class="icon-button" type="button" data-modal-close aria-label="Close dialog" data-tooltip="Close">${PKM.helpers.icon('close')}</button></header><div class="modal__body">${options.body || ''}</div>${options.hideFooter ? '' : `<footer class="modal__footer"><button class="button button--ghost" type="button" data-modal-close>${PKM.helpers.escapeHtml(options.cancelLabel || 'Cancel')}</button><button class="button ${options.danger ? 'button--danger' : 'button--primary'}" type="button" data-modal-confirm>${PKM.helpers.escapeHtml(options.confirmLabel || 'Save')}</button></footer>`}</section>`;
    shell._onClose = options.onClose;
    const confirmSelection = async () => {
      const confirm = shell.querySelector('[data-modal-confirm]'); if (!confirm || confirm.disabled) return;
      confirm.disabled = true;
      let result = false;
      try { result = await options.onConfirm?.(shell.querySelector('.modal')); }
      catch (error) { console.error('Dialog action failed.', error); PKM.toast?.show('That action could not be completed.', 'error'); }
      if (confirm.isConnected) confirm.disabled = false;
      if (result !== false) close('confirm');
    };
    shell.addEventListener('click', (event) => {
      if (event.target.closest('[data-modal-close]')) return close('dismiss');
      if (event.target.closest('[data-modal-confirm]')) confirmSelection();
    });
    shell.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || !event.target.closest('form') || event.target.matches('textarea, select, button')) return;
      event.preventDefault();
      confirmSelection();
    });
    shell.addEventListener('submit', (event) => { event.preventDefault(); confirmSelection(); });
    document.body.append(shell); document.body.classList.add('modal-open'); active = shell;
    requestAnimationFrame(() => (shell.querySelector('[autofocus]') || shell.querySelector('input, select, textarea, button') || shell).focus());
    return shell;
  }
  function confirm({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm }) { return open({ title, body: `<p class="modal-message">${PKM.helpers.escapeHtml(message)}</p>`, confirmLabel, danger, onConfirm }); }
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && active) { event.preventDefault(); event.stopImmediatePropagation(); close('escape'); return; } if (event.key === 'Tab' && active) { const focusable = [...active.querySelectorAll('button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')]; if (!focusable.length) return; const first = focusable[0], last = focusable.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } });
  PKM.modal = { open, close, confirm };
})(window.PKM = window.PKM || {});
