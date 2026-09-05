(function (PKM) {
  function mergeState(current, incoming) {
    const next = PKM.helpers.clone(current); const usedNames = new Set(next.maps.map((map) => map.name.toLowerCase())); const mapIds = {}, nodeIdsAll = {}, groupIdsAll = {};
    incoming.maps.forEach((source) => {
      const groupIds = {}, nodeIds = {}; let name = source.name; let count = 2;
      while (usedNames.has(name.toLowerCase())) name = `${source.name} (Imported ${count++})`; usedNames.add(name.toLowerCase());
      const groups = source.groups.map((group) => { const id = PKM.helpers.uid('group'); groupIds[group.id] = id; groupIdsAll[group.id] = id; return { ...group, id }; });
      const nodes = source.nodes.map((node) => { const id = PKM.helpers.uid('node'); nodeIds[node.id] = id; nodeIdsAll[node.id] = id; return { ...node, id, groupId: groupIds[node.groupId] || '' }; });
      const connections = source.connections.map((connection) => ({ ...connection, id: PKM.helpers.uid('connection'), sourceId: nodeIds[connection.sourceId], targetId: nodeIds[connection.targetId] })).filter((item) => item.sourceId && item.targetId);
      const mapId = PKM.helpers.uid('map'); mapIds[source.id] = mapId; next.maps.push({ ...source, id: mapId, name, groups, nodes, connections, createdAt: PKM.helpers.now(), updatedAt: PKM.helpers.now() });
    });
    incoming.savedFilters.forEach((filter) => next.savedFilters.push({ ...filter, id: PKM.helpers.uid('filter'), name: `${filter.name} (Imported)`, filters: { ...filter.filters, mapId: mapIds[filter.filters?.mapId] || '' } }));
    const importedActivity = incoming.activity.map((item) => ({ ...item, id: PKM.helpers.uid('activity'), mapId: mapIds[item.mapId] || '', nodeId: nodeIdsAll[item.nodeId] || '', groupId: groupIdsAll[item.groupId] || '' })); next.activity = [...importedActivity, ...next.activity].slice(0, PKM.constants.ACTIVITY_LIMIT); return PKM.storage.sanitize(next);
  }
  function apply(parsed, mode) {
    const payload = parsed.data && typeof parsed.data === 'object' ? parsed.data : parsed; const incoming = PKM.storage.sanitize(payload); const current = PKM.helpers.clone(PKM.state.get());
    if (current.settings.automaticBackups) PKM.backups.addToDraft(current, `Before ${mode} import`);
    let next;
    if (mode === 'merge') next = mergeState(current, incoming); else { next = incoming; next.backups = current.backups; }
    PKM.activity.addToDraft(next, 'import.performed', `${mode === 'merge' ? 'Merged' : 'Replaced data with'} an application backup`); PKM.state.replace(next, { source: 'import', historyLabel: `${mode === 'merge' ? 'Merge' : 'Replace'} imported data` }); PKM.theme.apply(); PKM.toast.show(mode === 'merge' ? 'Data merged' : 'Data imported'); return true;
  }
  function read(file, mode = 'replace') {
    if (!file) return; const reader = new FileReader();
    reader.onload = () => { let parsed; try { parsed = JSON.parse(reader.result); } catch (_) { PKM.toast.show('That file is not valid JSON.', 'error'); return; } const validation = PKM.validators.importedState(parsed); if (!validation.valid) { PKM.toast.show(validation.message, 'error'); return; } PKM.modal.confirm({ title: mode === 'merge' ? 'Merge imported data?' : 'Replace application data?', message: mode === 'merge' ? 'Imported maps will be added with safe new IDs. Existing data will be kept.' : 'Current data will be backed up, then replaced by this import.', confirmLabel: mode === 'merge' ? 'Merge data' : 'Replace data', danger: mode !== 'merge', onConfirm: () => apply(parsed, mode) }); };
    reader.onerror = () => PKM.toast.show('The backup file could not be read.', 'error'); reader.readAsText(file);
  }
  PKM.importer = { read, apply, mergeState };
})(window.PKM = window.PKM || {});
