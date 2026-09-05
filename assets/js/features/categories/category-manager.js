(function (PKM) {
  function syncDraft(state) { state.categories = [...new Set(state.maps.flatMap((map) => map.nodes.map((node) => node.category).filter(Boolean)))].sort((a, b) => a.localeCompare(b)); }
  function all() { return PKM.state.get().categories; }
  PKM.categories = { syncDraft, all };
})(window.PKM = window.PKM || {});
