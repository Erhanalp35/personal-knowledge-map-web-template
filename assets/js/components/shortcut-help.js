(function (PKM) {
  function open() { const map = PKM.router.currentView() === 'knowledge-map'; const shortcuts = [['/', 'Search'], ['Ctrl K', 'Command palette'], ['Ctrl Z', 'Undo'], ['Ctrl Y', 'Redo'], ['Esc', 'Close or exit mode']]; if (map) shortcuts.push(['N', 'New node'], ['0', 'Reset view'], ['F', 'Focus selected node']); PKM.modal.open({ eyebrow: 'Keyboard', title: 'Shortcuts', body: `<dl class="shortcut-list">${shortcuts.map(([keys, label]) => `<div><dt>${keys.split(' ').map((key) => `<kbd>${PKM.helpers.escapeHtml(key)}</kbd>`).join(' + ')}</dt><dd>${PKM.helpers.escapeHtml(label)}</dd></div>`).join('')}</dl>`, hideFooter: true }); }
  PKM.shortcutHelp = { open };
})(window.PKM = window.PKM || {});
