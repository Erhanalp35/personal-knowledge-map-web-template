(function (PKM) {
  function apply(mapId, nodeIds, action, value) {
    const ids = new Set(nodeIds); if (!ids.size) return false;
    if (action === 'delete' && PKM.state.get().settings.automaticBackups) PKM.backups.addToDraft(PKM.state.get(), `Before deleting ${ids.size} topics`);
    PKM.state.update((state) => {
      const map = state.maps.find((item) => item.id === mapId); if (!map) return;
      const nodes = map.nodes.filter((node) => ids.has(node.id));
      if (action === 'delete') { map.nodes = map.nodes.filter((node) => !ids.has(node.id)); map.connections = map.connections.filter((item) => !ids.has(item.sourceId) && !ids.has(item.targetId)); }
      else nodes.forEach((node) => {
        if (action === 'status' && PKM.constants.STATUS.includes(value)) node.status = value;
        if (action === 'importance' && PKM.constants.IMPORTANCE.includes(value)) node.importance = value;
        if (action === 'category') node.category = PKM.validators.cleanText(value, 60);
        if (action === 'add-tag') node.tags = PKM.helpers.normalizeTags([...node.tags, value]).slice(0, 20);
        if (action === 'remove-tag') node.tags = node.tags.filter((tag) => tag !== value);
        if (action === 'favorite') node.favorite = true;
        if (action === 'unfavorite') node.favorite = false;
        if (action === 'group' && (!value || map.groups.some((group) => group.id === value))) node.groupId = value;
        node.updatedAt = PKM.helpers.now();
      });
      map.updatedAt = PKM.helpers.now(); PKM.categories.syncDraft(state); PKM.tags.syncDraft(state);
      PKM.activity.addToDraft(state, `bulk.${action}`, `${action === 'delete' ? 'Deleted' : 'Updated'} ${nodes.length} topics`, { mapId });
    }, { source: 'bulk', historyLabel: action === 'delete' ? 'Bulk delete topics' : 'Bulk update topics' }); return true;
  }
  PKM.bulk = { apply };
})(window.PKM = window.PKM || {});
