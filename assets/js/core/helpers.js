(function (PKM) {
  const glyphs = {
    dashboard: '<path d="M4 4h6v6H4zM14 4h6v4h-6zM14 12h6v8h-6zM4 14h6v6H4z"/>',
    map: '<circle cx="6" cy="7" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="15" cy="18" r="2"/><path d="m8 7 8-1M7.5 8.5 14 16M17.5 8l-2 8"/>',
    topics: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    activity: '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20.5 15.7A9 9 0 0 1 8.3 3.5 9 9 0 1 0 20.5 15.7Z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
    copy: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/>',
    zoomIn: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4M10.5 7.5v6M7.5 10.5h6"/>',
    zoomOut: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4M7.5 10.5h6"/>',
    fit: '<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5"/>',
    reset: '<path d="M4 4v6h6M5.5 17.5A8 8 0 1 0 6 6l-2 4"/>',
    grid: '<path d="M4 4h16v16H4zM4 10h16M4 16h16M10 4v16M16 4v16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
    arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>'
    ,group: '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M7 9h6"/>'
    ,undo: '<path d="M9 7 4 12l5 5"/><path d="M5 12h8a6 6 0 0 1 6 6"/>'
    ,redo: '<path d="m15 7 5 5-5 5"/><path d="M19 12h-8a6 6 0 0 0-6 6"/>'
    ,focus: '<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5"/><circle cx="12" cy="12" r="3"/>'
    ,layout: '<path d="M4 5h6v5H4zM14 5h6v5h-6zM4 14h6v5H4zM14 14h6v5h-6z"/>'
    ,minimap: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h4v3H7zM14 13h3v2h-3z"/>'
    ,review: '<path d="M4 5h12a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3Z"/><path d="M8 9h7M8 13h5"/>'
    ,command: '<path d="M8 9V7a3 3 0 1 0-3 3h14a3 3 0 1 0-3-3v10a3 3 0 1 0 3-3H5a3 3 0 1 0 3 3Z"/>'
    ,keyboard: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h7"/>'
    ,backup: '<path d="M4 7v13h16V7l-3-3H7Z"/><path d="M8 4v6h8V4M8 16h8"/>'
    ,check: '<path d="m5 12 4 4L19 6"/>'
  };

  const icon = (name, label) => `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${glyphs[name] || glyphs.topics}</svg>${label ? `<span>${escapeHtml(label)}</span>` : ''}`;
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const uid = (prefix = 'id') => `${prefix}_${globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`}`;
  const now = () => new Date().toISOString();
  const normalizeTags = (value) => [...new Set((Array.isArray(value) ? value : String(value || '').split(',')).map((tag) => String(tag).trim().replace(/\s+/g, ' ')).filter(Boolean))];
  const formatDate = (iso, options = {}) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return 'Unknown date';
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: options.short ? undefined : 'numeric' }).format(date);
  };
  const formatRelative = (iso) => {
    const value = new Date(iso).getTime();
    if (Number.isNaN(value)) return 'Unknown';
    const seconds = Math.round((value - Date.now()) / 1000);
    const ranges = [[31536000, 'year'], [2592000, 'month'], [604800, 'week'], [86400, 'day'], [3600, 'hour'], [60, 'minute']];
    const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    for (const [unitSeconds, unit] of ranges) if (Math.abs(seconds) >= unitSeconds) return formatter.format(Math.round(seconds / unitSeconds), unit);
    return 'just now';
  };
  const debounce = (fn, delay = 180) => { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; };
  const clone = (value) => typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
  const dateValue = (iso) => {
    const date = new Date(iso); if (Number.isNaN(date.getTime())) return '';
    const pad = (value) => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };
  const dayStart = (value = Date.now()) => { const date = new Date(value); date.setHours(0, 0, 0, 0); return date; };
  const isTyping = (target) => ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName) || target?.isContentEditable;
  const statusSlug = (status) => String(status || 'Not Started').toLowerCase().replace(/\s+/g, '-');
  const statusBadge = (status) => `<span class="badge badge--status badge--${statusSlug(status)}"><span class="badge__mark" aria-hidden="true"></span>${escapeHtml(status)}</span>`;
  const importanceBadge = (importance) => `<span class="badge badge--importance badge--${String(importance).toLowerCase()}">${escapeHtml(importance)}</span>`;
  const tagsHtml = (tags, limit = 3) => {
    const visible = (tags || []).slice(0, limit);
    return `${visible.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}${(tags || []).length > limit ? `<span class="tag tag--more">+${tags.length - limit}</span>` : ''}`;
  };

  PKM.helpers = { icon, escapeHtml, uid, now, normalizeTags, formatDate, formatRelative, debounce, clone, dateValue, dayStart, isTyping, statusSlug, statusBadge, importanceBadge, tagsHtml };
})(window.PKM = window.PKM || {});
