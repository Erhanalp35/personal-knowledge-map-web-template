(function (PKM) {
  const cleanText = (value, max = 5000) => String(value || '').trim().slice(0, max);
  const mapName = (value, maps = [], currentId = null) => {
    const name = cleanText(value, 80);
    if (!name) return { valid: false, message: 'Map name is required.' };
    if (maps.some((map) => map.id !== currentId && map.name.toLowerCase() === name.toLowerCase())) return { valid: false, message: 'A map with this name already exists.' };
    return { valid: true, value: name };
  };
  const node = (values) => {
    const title = cleanText(values.title, 100);
    if (!title) return { valid: false, message: 'Title is required.' };
    const status = PKM.constants.STATUS.includes(values.status) ? values.status : 'Not Started';
    const importance = PKM.constants.IMPORTANCE.includes(values.importance) ? values.importance : 'Medium';
    return { valid: true, value: { title, description: cleanText(values.description, 500), category: cleanText(values.category, 60), tags: PKM.helpers.normalizeTags(values.tags).slice(0, 20), status, importance, notes: cleanText(values.notes, 10000), groupId: cleanText(values.groupId, 100) } };
  };
  const group = (values) => {
    const name = cleanText(values.name, 80);
    if (!name) return { valid: false, message: 'Group name is required.' };
    const accent = /^#[0-9a-f]{6}$/i.test(values.accent || '') ? values.accent : '#2563eb';
    return { valid: true, value: { name, description: cleanText(values.description, 300), accent } };
  };
  const importedState = (data) => {
    if (!data || typeof data !== 'object') return { valid: false, message: 'The file does not contain an application state.' };
    const payload = data.data && typeof data.data === 'object' ? data.data : data;
    if (![1, 2].includes(Number(payload.version))) return { valid: false, message: 'Only Knowledge Atlas version 1 or 2 data can be imported.' };
    if (!Array.isArray(payload.maps)) return { valid: false, message: 'The backup is missing its maps list.' };
    return { valid: true };
  };
  PKM.validators = { cleanText, mapName, node, group, importedState };
})(window.PKM = window.PKM || {});
