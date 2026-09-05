(function (PKM) {
  PKM.constants = Object.freeze({
    STORAGE_KEY: 'pkm_app_state_v2',
    LEGACY_STORAGE_KEY: 'pkm_app_state_v1',
    VERSION: 2,
    APP_VERSION: '2.0.0',
    ACTIVITY_LIMIT: 100,
    HISTORY_LIMIT: 50,
    BACKUP_LIMIT: 5,
    WORLD_MIN_WIDTH: 2400,
    WORLD_MIN_HEIGHT: 1600,
    WORLD_MAX_WIDTH: 12000,
    WORLD_MAX_HEIGHT: 10000,
    NODE_CARD_WIDTH: 236,
    NODE_CARD_HEIGHT: 240,
    GROUP_HEADER_SPACE: 112,
    GROUP_EDGE_PADDING: 28,
    STATUS: ['Not Started', 'Learning', 'Reviewing', 'Mastered'],
    IMPORTANCE: ['Low', 'Medium', 'High'],
    RELATIONSHIPS: ['Related To', 'Depends On', 'Part Of', 'Leads To', 'Similar To'],
    NAV_ITEMS: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'knowledge-map', label: 'Knowledge Map', icon: 'map' },
      { id: 'all-topics', label: 'All Topics', icon: 'topics' },
      { id: 'favorites', label: 'Favorites', icon: 'star' },
      { id: 'recently-updated', label: 'Recently Updated', icon: 'clock' },
      { id: 'recent-activity', label: 'Recent Activity', icon: 'activity' },
      { id: 'review', label: 'Review', icon: 'review' },
      { id: 'settings', label: 'Settings', icon: 'settings' }
    ]
  });
})(window.PKM = window.PKM || {});
