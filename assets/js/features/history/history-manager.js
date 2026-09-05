(function (PKM) {
  const undoStack = []; const redoStack = []; let replaying = false;
  const trim = (stack) => { while (stack.length > PKM.constants.HISTORY_LIMIT) stack.shift(); };
  function record(label, before, after) {
    if (replaying || !label) return;
    undoStack.push({ label, before: PKM.helpers.clone(before), after: PKM.helpers.clone(after) }); trim(undoStack); redoStack.length = 0; notify();
  }
  function notify() { document.dispatchEvent(new CustomEvent('pkm:historychange', { detail: status() })); }
  function undo() {
    const entry = undoStack.pop(); if (!entry) return false;
    replaying = true; redoStack.push({ ...entry, after: PKM.helpers.clone(PKM.state.get()) }); PKM.state.replace(entry.before, { source: 'history' }); replaying = false; notify(); PKM.toast?.show(`Undid: ${entry.label}`); return true;
  }
  function redo() {
    const entry = redoStack.pop(); if (!entry) return false;
    replaying = true; undoStack.push({ ...entry, before: PKM.helpers.clone(PKM.state.get()) }); PKM.state.replace(entry.after, { source: 'history' }); replaying = false; notify(); PKM.toast?.show(`Redid: ${entry.label}`); return true;
  }
  function clear() { undoStack.length = 0; redoStack.length = 0; notify(); }
  const status = () => ({ canUndo: undoStack.length > 0, canRedo: redoStack.length > 0, undoLabel: undoStack.at(-1)?.label || '', redoLabel: redoStack.at(-1)?.label || '' });
  PKM.history = { record, undo, redo, clear, status };
})(window.PKM = window.PKM || {});
