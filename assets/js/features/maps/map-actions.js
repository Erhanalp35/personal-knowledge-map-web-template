(function (PKM) {
  const form = (map = {}, includeTemplate = false) => `<form class="form-stack" id="map-form"><label class="field"><span>Map name <em>Required</em></span><input name="name" maxlength="80" value="${PKM.helpers.escapeHtml(map.name || '')}" required autofocus placeholder="e.g. Mathematics"></label><label class="field"><span>Description</span><textarea name="description" maxlength="300" rows="3" placeholder="What are you learning in this map?">${PKM.helpers.escapeHtml(map.description || '')}</textarea></label>${includeTemplate ? `<label class="field"><span>Starter template</span><select name="template">${PKM.mapTemplates.all().map((item) => `<option value="${item.id}">${PKM.helpers.escapeHtml(item.name)} — ${PKM.helpers.escapeHtml(item.description)}</option>`).join('')}</select></label>` : ''}<p class="form-error" role="alert"></p></form>`;
  function values(modal) { const data = new FormData(modal.querySelector('form')); return Object.fromEntries(data); }
  function showError(modal, message) { modal.querySelector('.form-error').textContent = message; }
  function create() {
    PKM.modal.open({ eyebrow: 'Knowledge maps', title: 'Create a new map', body: form({}, true), confirmLabel: 'Create map', onConfirm: (modal) => { const result = PKM.maps.create(values(modal)); if (!result.valid) { showError(modal, result.message); return false; } PKM.toast.show('Map created'); if (PKM.router.currentView() !== 'knowledge-map') PKM.router.openMap(result.value.id); return true; } });
  }
  function rename(id) {
    const map = PKM.state.mapById(id); if (!map) return;
    PKM.modal.open({ eyebrow: 'Map details', title: 'Rename map', body: form(map), confirmLabel: 'Save changes', onConfirm: (modal) => { const result = PKM.maps.rename(id, values(modal)); if (!result.valid) { showError(modal, result.message); return false; } PKM.toast.show('Map updated'); return true; } });
  }
  function duplicate(id) { const map = PKM.maps.duplicate(id); if (map) PKM.toast.show('Map duplicated'); }
  function remove(id) {
    const map = PKM.state.mapById(id); if (!map) return;
    PKM.modal.confirm({ title: 'Delete this map?', message: `“${map.name}” and all of its topics and connections will be permanently removed.`, confirmLabel: 'Delete map', danger: true, onConfirm: () => { PKM.maps.remove(id); PKM.toast.show('Map deleted'); return true; } });
  }
  PKM.mapActions = { create, rename, duplicate, remove };
})(window.PKM = window.PKM || {});
