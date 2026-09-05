(function (PKM) {
  function addToDraft(state, type, message, refs = {}) {
    state.activity.unshift({ id: PKM.helpers.uid('activity'), type, message, mapId: refs.mapId || '', nodeId: refs.nodeId || '', groupId: refs.groupId || '', createdAt: PKM.helpers.now() });
    state.activity = state.activity.slice(0, PKM.constants.ACTIVITY_LIMIT);
  }
  function add(type, message, refs) { PKM.state.update((state) => addToDraft(state, type, message, refs), { source: 'activity' }); }
  PKM.activity = { add, addToDraft };
})(window.PKM = window.PKM || {});
