(function (PKM) {
  function snapshot(state) { const data = PKM.helpers.clone(state); data.backups = []; return PKM.storage.sanitize(data); }
  function addToDraft(state, reason = 'Manual backup') {
    const backup = { id: PKM.helpers.uid('backup'), reason, createdAt: PKM.helpers.now(), data: snapshot(state) };
    state.backups = [backup, ...(state.backups || [])].slice(0, PKM.constants.BACKUP_LIMIT); return backup;
  }
  function create(reason = 'Manual backup') { let backup; PKM.state.update((state) => { backup = addToDraft(state, reason); }, { source: 'backup' }); PKM.toast?.show('Backup created'); return backup; }
  function remove(id) { PKM.state.update((state) => { state.backups = state.backups.filter((item) => item.id !== id); }, { source: 'backup' }); }
  function restore(id) {
    const backup = PKM.state.get().backups.find((item) => item.id === id); if (!backup) return false;
    const retained = PKM.helpers.clone(PKM.state.get().backups); const next = PKM.storage.sanitize(backup.data); next.backups = retained;
    PKM.state.replace(next, { source: 'backup-restore', historyLabel: 'Restore backup' }); PKM.theme.apply(); return true;
  }
  PKM.backups = { addToDraft, create, remove, restore };
})(window.PKM = window.PKM || {});
