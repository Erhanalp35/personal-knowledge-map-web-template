(function (PKM) {
  function save(name, filters) { const clean = PKM.validators.cleanText(name, 80); if (!clean) return false; PKM.state.update((state) => { state.savedFilters.push({ id: PKM.helpers.uid('filter'), name: clean, filters: { ...filters }, createdAt: PKM.helpers.now(), updatedAt: PKM.helpers.now() }); }, { source: 'saved-filter' }); return true; }
  function rename(id, name) { const clean = PKM.validators.cleanText(name, 80); if (!clean) return false; PKM.state.update((state) => { const item = state.savedFilters.find((filter) => filter.id === id); if (item) { item.name = clean; item.updatedAt = PKM.helpers.now(); } }, { source: 'saved-filter' }); return true; }
  function remove(id) { PKM.state.update((state) => { state.savedFilters = state.savedFilters.filter((item) => item.id !== id); }, { source: 'saved-filter' }); }
  PKM.savedFilters = { save, rename, remove };
})(window.PKM = window.PKM || {});
