(function (PKM) {
  const { STORAGE_KEY, LEGACY_STORAGE_KEY, VERSION, BACKUP_LIMIT } = PKM.constants;
  const { uid, now } = PKM.helpers;
  const WINDOW_STATE_PREFIX = 'KNOWLEDGE_ATLAS_STATE_V2:';
  const LEGACY_WINDOW_PREFIX = 'KNOWLEDGE_ATLAS_STATE:';

  const baseSettings = () => ({
    theme: 'light', gridEnabled: true, minimapEnabled: true, defaultZoom: 1,
    connectionLabels: true, autoFitOnOpen: false, animations: true, reduceMotion: false,
    highContrast: false, compactDensity: false, sidebarCollapsed: false,
    restoreLastPage: true, defaultMapId: '', sessionSize: 5,
    reviewIntervals: { Learning: 1, Reviewing: 3, Mastered: 7 }, automaticBackups: true
  });
  const blankState = () => ({
    version: VERSION, initialized: true, maps: [], activeMapId: '', activity: [],
    settings: baseSettings(), categories: [], tags: [], savedFilters: [], backups: []
  });

  function demoState() {
    const stamp = now();
    const mapId = uid('map');
    const groupIds = { foundations: uid('group'), browser: uid('group'), quality: uid('group') };
    const groups = [
      { id: groupIds.foundations, name: 'Foundations', description: 'Core browser languages', accent: '#2563eb', collapsed: false, x: 70, y: 90, createdAt: stamp, updatedAt: stamp },
      { id: groupIds.browser, name: 'Browser APIs', description: 'How pages behave and persist', accent: '#7c3aed', collapsed: false, x: 750, y: 70, createdAt: stamp, updatedAt: stamp },
      { id: groupIds.quality, name: 'Quality', description: 'Inclusive, adaptable interfaces', accent: '#0f8a6a', collapsed: false, x: 360, y: 20, createdAt: stamp, updatedAt: stamp }
    ];
    const definitions = [
      ['HTML', 'The semantic structure of web documents.', 'Web Foundations', ['markup', 'semantic'], 'Mastered', 'High', 120, 150, groupIds.foundations],
      ['CSS', 'Presentation, layout, and responsive styling.', 'Web Foundations', ['styles', 'layout'], 'Learning', 'High', 120, 390, groupIds.foundations],
      ['JavaScript', 'The programming language of the web.', 'Programming', ['language', 'frontend'], 'Learning', 'High', 500, 250, ''],
      ['DOM', 'The browser representation of a document.', 'Browser APIs', ['javascript', 'browser'], 'Reviewing', 'High', 850, 120, groupIds.browser],
      ['Events', 'Signals produced by user and browser actions.', 'Browser APIs', ['javascript', 'interaction'], 'Learning', 'Medium', 1180, 210, groupIds.browser],
      ['Fetch API', 'Promise-based HTTP requests in the browser.', 'Browser APIs', ['network', 'async'], 'Not Started', 'Medium', 850, 430, groupIds.browser],
      ['Local Storage', 'Persistent key-value storage in the browser.', 'Browser APIs', ['storage', 'offline'], 'Mastered', 'Medium', 1190, 470, groupIds.browser],
      ['Accessibility', 'Inclusive interfaces that work for more people.', 'Quality', ['a11y', 'semantic'], 'Reviewing', 'High', 430, 40, groupIds.quality],
      ['Responsive Design', 'Layouts that adapt to the available space.', 'Quality', ['mobile', 'layout'], 'Learning', 'High', 430, 540, groupIds.quality]
    ];
    const tomorrow = new Date(Date.now() + 86400000).toISOString();
    const nodes = definitions.map(([title, description, category, tags, status, importance, x, y, groupId], index) => ({
      id: uid('node'), title, description, category, tags, status, importance, notes: '',
      favorite: ['JavaScript', 'Accessibility'].includes(title), groupId, x, y,
      lastReviewedAt: index % 3 === 0 ? stamp : '', reviewCount: index % 3 === 0 ? 1 : 0,
      nextReviewAt: status === 'Not Started' ? '' : tomorrow, reviewPriority: importance === 'High' ? 'High' : 'Normal',
      createdAt: stamp, updatedAt: stamp
    }));
    const byTitle = Object.fromEntries(nodes.map((node) => [node.title, node.id]));
    const pairs = [['HTML', 'Accessibility', 'Leads To'], ['CSS', 'Responsive Design', 'Leads To'], ['JavaScript', 'DOM', 'Leads To'], ['DOM', 'Events', 'Leads To'], ['JavaScript', 'Fetch API', 'Related To'], ['JavaScript', 'Local Storage', 'Related To']];
    const connections = pairs.map(([source, target, type]) => ({ id: uid('connection'), sourceId: byTitle[source], targetId: byTitle[target], type, label: '', createdAt: stamp, updatedAt: stamp }));
    return {
      version: VERSION, initialized: true,
      maps: [{ id: mapId, name: 'Web Development', description: 'Core concepts for building accessible, responsive web experiences.', createdAt: stamp, updatedAt: stamp, nodes, connections, groups, settings: {} }],
      activeMapId: mapId,
      activity: [{ id: uid('activity'), type: 'app.started', message: 'Web Development sample map created', mapId, nodeId: '', groupId: '', createdAt: stamp }],
      settings: { ...baseSettings(), defaultMapId: mapId },
      categories: [...new Set(nodes.map((node) => node.category))], tags: [...new Set(nodes.flatMap((node) => node.tags))], savedFilters: [], backups: []
    };
  }

  const safeString = (value, fallback = '') => typeof value === 'string' ? value : fallback;
  const safeDate = (value, fallback = '') => value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).toISOString() : fallback;
  const safeNumber = (value, fallback = 0, min = -Infinity, max = Infinity) => Math.min(max, Math.max(min, Number.isFinite(Number(value)) ? Number(value) : fallback));
  function sanitizeGroup(group) {
    if (!group || typeof group !== 'object' || !safeString(group.name).trim()) return null;
    return {
      id: safeString(group.id) || uid('group'), name: safeString(group.name).trim().slice(0, 80),
      description: safeString(group.description).slice(0, 300), accent: /^#[0-9a-f]{6}$/i.test(group.accent || '') ? group.accent : '#2563eb',
      collapsed: group.collapsed === true, x: safeNumber(group.x, 80, 0, PKM.constants.WORLD_MAX_WIDTH - 300), y: safeNumber(group.y, 80, 0, PKM.constants.WORLD_MAX_HEIGHT - 200),
      createdAt: safeDate(group.createdAt, now()), updatedAt: safeDate(group.updatedAt, now())
    };
  }
  function sanitizeNode(node, groupIds = new Set()) {
    if (!node || typeof node !== 'object') return null;
    const title = safeString(node.title).trim(); if (!title) return null;
    const groupId = groupIds.has(node.groupId) ? node.groupId : '';
    return {
      id: safeString(node.id) || uid('node'), title: title.slice(0, 100), description: safeString(node.description).slice(0, 500),
      category: safeString(node.category).slice(0, 60), tags: PKM.helpers.normalizeTags(node.tags).slice(0, 20),
      status: PKM.constants.STATUS.includes(node.status) ? node.status : 'Not Started', importance: PKM.constants.IMPORTANCE.includes(node.importance) ? node.importance : 'Medium',
      notes: safeString(node.notes).slice(0, 10000), favorite: Boolean(node.favorite), groupId,
      x: safeNumber(node.x, 100, 0, PKM.constants.WORLD_MAX_WIDTH - 260), y: safeNumber(node.y, 100, 0, PKM.constants.WORLD_MAX_HEIGHT - 180),
      lastReviewedAt: safeDate(node.lastReviewedAt), reviewCount: Math.floor(safeNumber(node.reviewCount, 0, 0, 100000)),
      nextReviewAt: safeDate(node.nextReviewAt), reviewPriority: ['Low', 'Normal', 'High'].includes(node.reviewPriority) ? node.reviewPriority : 'Normal',
      createdAt: safeDate(node.createdAt, now()), updatedAt: safeDate(node.updatedAt, now())
    };
  }
  function sanitizeMap(map) {
    if (!map || typeof map !== 'object' || !safeString(map.name).trim()) return null;
    const groupIds = new Set(); const groupAliases = new Map();
    const groups = (Array.isArray(map.groups) ? map.groups : []).flatMap((source) => {
      const group = sanitizeGroup(source); if (!group) return [];
      const sourceId = safeString(source.id); if (groupIds.has(group.id)) group.id = uid('group');
      groupIds.add(group.id); if (sourceId && !groupAliases.has(sourceId)) groupAliases.set(sourceId, group.id); return [group];
    });
    const nodeIds = new Set(); const nodeAliases = new Map();
    const nodes = (Array.isArray(map.nodes) ? map.nodes : []).flatMap((source) => {
      if (!source || typeof source !== 'object') return [];
      const sourceId = safeString(source.id); const node = sanitizeNode({ ...source, groupId: groupAliases.get(source.groupId) || '' }, groupIds); if (!node) return [];
      if (nodeIds.has(node.id)) node.id = uid('node'); nodeIds.add(node.id); if (sourceId && !nodeAliases.has(sourceId)) nodeAliases.set(sourceId, node.id); return [node];
    });
    groups.forEach((group) => {
      const members = nodes.filter((node) => node.groupId === group.id); if (!members.length) return;
      const minY = Math.min(...members.map((node) => node.y)); const shift = Math.max(0, PKM.constants.GROUP_HEADER_SPACE - minY);
      if (shift) members.forEach((node) => { node.y = Math.min(PKM.constants.WORLD_MAX_HEIGHT - PKM.constants.NODE_CARD_HEIGHT, node.y + shift); });
    });
    const connectionIds = new Set(); const connectionKeys = new Set();
    const connections = (Array.isArray(map.connections) ? map.connections : []).flatMap((connection) => {
      if (!connection || typeof connection !== 'object') return [];
      const sourceId = nodeAliases.get(connection.sourceId), targetId = nodeAliases.get(connection.targetId);
      if (!sourceId || !targetId || sourceId === targetId) return [];
      const type = PKM.constants.RELATIONSHIPS.includes(connection.type) ? connection.type : 'Related To';
      const label = safeString(connection.label).trim().slice(0, 80); const key = `${sourceId}|${targetId}|${type}`;
      if (connectionKeys.has(key)) return []; connectionKeys.add(key);
      let id = safeString(connection.id) || uid('connection'); if (connectionIds.has(id)) id = uid('connection'); connectionIds.add(id);
      return [{ id, sourceId, targetId, type, label, createdAt: safeDate(connection.createdAt, now()), updatedAt: safeDate(connection.updatedAt, now()) }];
    });
    return {
      id: safeString(map.id) || uid('map'), name: safeString(map.name).trim().slice(0, 80), description: safeString(map.description).slice(0, 300),
      createdAt: safeDate(map.createdAt, now()), updatedAt: safeDate(map.updatedAt, now()), nodes, connections, groups,
      settings: map.settings && typeof map.settings === 'object' ? { ...map.settings } : {}
    };
  }
  function sanitizeSettings(raw) {
    const settings = { ...baseSettings(), ...(raw && typeof raw === 'object' ? raw : {}) };
    if (!['light', 'dark', 'system'].includes(settings.theme)) settings.theme = 'light';
    settings.defaultZoom = safeNumber(settings.defaultZoom, 1, .5, 2);
    ['gridEnabled', 'minimapEnabled', 'connectionLabels', 'autoFitOnOpen', 'animations', 'reduceMotion', 'highContrast', 'compactDensity', 'sidebarCollapsed', 'restoreLastPage', 'automaticBackups'].forEach((key) => { settings[key] = settings[key] === true || (baseSettings()[key] === true && settings[key] !== false); });
    settings.defaultMapId = safeString(settings.defaultMapId); settings.sessionSize = Math.floor(safeNumber(settings.sessionSize, 5, 1, 20));
    const intervals = settings.reviewIntervals && typeof settings.reviewIntervals === 'object' ? settings.reviewIntervals : {};
    settings.reviewIntervals = { Learning: Math.floor(safeNumber(intervals.Learning, 1, 1, 30)), Reviewing: Math.floor(safeNumber(intervals.Reviewing, 3, 1, 60)), Mastered: Math.floor(safeNumber(intervals.Mastered, 7, 1, 365)) };
    return settings;
  }
  function sanitizeCore(raw, includeBackups = true) {
    const fallback = blankState(); if (!raw || typeof raw !== 'object') return fallback;
    const mapIds = new Set();
    const maps = (Array.isArray(raw.maps) ? raw.maps : []).flatMap((source) => { const map = sanitizeMap(source); if (!map) return []; if (mapIds.has(map.id)) map.id = uid('map'); mapIds.add(map.id); return [map]; });
    const globalGroupIds = new Set(), globalNodeIds = new Set(), globalConnectionIds = new Set();
    maps.forEach((map) => {
      map.groups.forEach((group) => { if (!globalGroupIds.has(group.id)) { globalGroupIds.add(group.id); return; } const previous = group.id; group.id = uid('group'); globalGroupIds.add(group.id); map.nodes.forEach((node) => { if (node.groupId === previous) node.groupId = group.id; }); });
      map.nodes.forEach((node) => { if (!globalNodeIds.has(node.id)) { globalNodeIds.add(node.id); return; } const previous = node.id; node.id = uid('node'); globalNodeIds.add(node.id); map.connections.forEach((connection) => { if (connection.sourceId === previous) connection.sourceId = node.id; if (connection.targetId === previous) connection.targetId = node.id; }); });
      map.connections.forEach((connection) => { if (globalConnectionIds.has(connection.id)) connection.id = uid('connection'); globalConnectionIds.add(connection.id); });
    });
    const settings = sanitizeSettings(raw.settings);
    const activeMapId = maps.some((map) => map.id === raw.activeMapId) ? raw.activeMapId : (maps.find((map) => map.id === settings.defaultMapId)?.id || maps[0]?.id || '');
    if (!maps.some((map) => map.id === settings.defaultMapId)) settings.defaultMapId = activeMapId;
    if (!PKM.constants.NAV_ITEMS.some((item) => item.id === settings.lastPage)) settings.lastPage = 'dashboard';
    const state = {
      version: VERSION, initialized: true, maps, activeMapId,
      activity: (Array.isArray(raw.activity) ? raw.activity : []).filter((item) => item && typeof item.message === 'string').slice(0, PKM.constants.ACTIVITY_LIMIT).map((item) => ({ id: safeString(item.id) || uid('activity'), type: safeString(item.type, 'activity'), message: item.message.slice(0, 200), mapId: safeString(item.mapId), nodeId: safeString(item.nodeId), groupId: safeString(item.groupId), createdAt: safeDate(item.createdAt, now()) })),
      settings,
      categories: [...new Set((Array.isArray(raw.categories) ? raw.categories : []).filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim().slice(0, 60)))],
      tags: PKM.helpers.normalizeTags(Array.isArray(raw.tags) ? raw.tags : []),
      savedFilters: [],
      backups: []
    };
    if (includeBackups) state.backups = (Array.isArray(raw.backups) ? raw.backups : []).filter((item) => item && item.data && typeof item.data === 'object').slice(0, BACKUP_LIMIT).map((item) => ({ id: safeString(item.id) || uid('backup'), reason: safeString(item.reason, 'Manual backup').slice(0, 100), createdAt: safeDate(item.createdAt, now()), data: sanitizeCore(item.data, false) }));
    state.categories = [...new Set([...state.categories, ...maps.flatMap((map) => map.nodes.map((node) => node.category))].filter(Boolean))];
    state.tags = [...new Set([...state.tags, ...maps.flatMap((map) => map.nodes.flatMap((node) => node.tags))])];
    const filterIds = new Set();
    state.savedFilters = (Array.isArray(raw.savedFilters) ? raw.savedFilters : []).filter((item) => item && safeString(item.name).trim()).slice(0, 30).map((item) => {
      const source = item.filters && typeof item.filters === 'object' ? item.filters : {};
      let id = safeString(item.id) || uid('filter'); if (filterIds.has(id)) id = uid('filter'); filterIds.add(id);
      const filters = {
        query: safeString(source.query).slice(0, 100), mapId: maps.some((map) => map.id === source.mapId) ? source.mapId : '',
        status: PKM.constants.STATUS.includes(source.status) ? source.status : '', category: state.categories.includes(source.category) ? source.category : '',
        tag: state.tags.includes(source.tag) ? source.tag : '', importance: PKM.constants.IMPORTANCE.includes(source.importance) ? source.importance : '', favorite: source.favorite === true,
        reviewState: ['unscheduled', 'overdue', 'today', 'upcoming'].includes(source.reviewState) ? source.reviewState : '',
        sort: ['updated-desc', 'updated-asc', 'alpha-asc', 'alpha-desc', 'status', 'importance'].includes(source.sort) ? source.sort : 'updated-desc',
        smart: ['attention', 'priority', 'due', 'mastered', 'unconnected'].includes(source.smart) ? source.smart : ''
      };
      return { id, name: safeString(item.name).trim().slice(0, 80), filters, createdAt: safeDate(item.createdAt, now()), updatedAt: safeDate(item.updatedAt, now()) };
    });
    return state;
  }
  const sanitize = (raw) => sanitizeCore(raw, true);
  function load() {
    if (location.protocol === 'file:' && (window.name.startsWith(WINDOW_STATE_PREFIX) || window.name.startsWith(LEGACY_WINDOW_PREFIX))) {
      const prefix = window.name.startsWith(WINDOW_STATE_PREFIX) ? WINDOW_STATE_PREFIX : LEGACY_WINDOW_PREFIX;
      try { return sanitize(JSON.parse(window.name.slice(prefix.length))); } catch (error) { console.warn('The file-navigation state was malformed; browser storage will be used.', error); }
    }
    let raw; let fromLegacy = false;
    try { raw = localStorage.getItem(STORAGE_KEY); if (raw === null) { raw = localStorage.getItem(LEGACY_STORAGE_KEY); fromLegacy = raw !== null; } }
    catch (error) { console.warn('Local storage is unavailable.', error); return demoState(); }
    if (raw === null) return demoState();
    try { const state = sanitize(JSON.parse(raw)); if (fromLegacy) save(state); return state; }
    catch (error) { console.warn('Saved application data was malformed; safe defaults were restored.', error); return blankState(); }
  }
  function save(state) {
    const value = JSON.stringify(sanitize(state)); if (location.protocol === 'file:') window.name = `${WINDOW_STATE_PREFIX}${value}`;
    try { localStorage.setItem(STORAGE_KEY, value); return true; } catch (error) { console.error('Unable to save application data.', error); return false; }
  }
  PKM.storage = { load, save, sanitize, blankState, demoState, baseSettings };
})(window.PKM = window.PKM || {});
