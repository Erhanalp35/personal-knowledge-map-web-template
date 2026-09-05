(function (PKM) {
  function syncDraft(state) { state.tags = [...new Set(state.maps.flatMap((map) => map.nodes.flatMap((node) => node.tags || [])))].sort((a, b) => a.localeCompare(b)); }
  function all() { return PKM.state.get().tags; }
  PKM.tags = { syncDraft, all };
})(window.PKM = window.PKM || {});
