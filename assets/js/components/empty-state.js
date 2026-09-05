(function (PKM) {
  function render({ icon = 'topics', title, message, action = '', actionLabel = '' }) { return `<div class="empty-state"><div class="empty-state__icon">${PKM.helpers.icon(icon)}</div><h3>${PKM.helpers.escapeHtml(title)}</h3><p>${PKM.helpers.escapeHtml(message)}</p>${action ? `<button class="button button--primary" type="button" data-empty-action="${PKM.helpers.escapeHtml(action)}">${PKM.helpers.icon('plus', actionLabel)}</button>` : ''}</div>`; }
  PKM.emptyState = { render };
})(window.PKM = window.PKM || {});
