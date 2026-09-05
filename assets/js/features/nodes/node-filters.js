(function (PKM) {
  function apply(nodes, filters = {}) {
    const query = String(filters.query || '').trim().toLowerCase();
    const today = PKM.helpers.dayStart().getTime(), tomorrow = today + 86400000;
    return nodes.filter((node) => {
      const searchable = [node.title, node.description, node.category, node.notes, node.mapName, ...(node.tags || [])].join(' ').toLowerCase();
      const reviewTime = node.nextReviewAt ? new Date(node.nextReviewAt).getTime() : NaN;
      const reviewMatch = !filters.reviewState || (filters.reviewState === 'unscheduled' && !node.nextReviewAt) || (filters.reviewState === 'overdue' && Number.isFinite(reviewTime) && reviewTime < today) || (filters.reviewState === 'today' && Number.isFinite(reviewTime) && reviewTime >= today && reviewTime < tomorrow) || (filters.reviewState === 'upcoming' && Number.isFinite(reviewTime) && reviewTime >= tomorrow);
      return (!query || searchable.includes(query)) && (!filters.mapId || node.mapId === filters.mapId) && (!filters.status || node.status === filters.status) && (!filters.category || node.category === filters.category) && (!filters.tag || node.tags.includes(filters.tag)) && (!filters.importance || node.importance === filters.importance) && (!filters.favorite || node.favorite) && reviewMatch;
    });
  }
  function sort(nodes, sortBy = 'updated-desc') {
    const copy = [...nodes];
    const statusIndex = Object.fromEntries(PKM.constants.STATUS.map((status, index) => [status, index]));
    const importanceIndex = { High: 0, Medium: 1, Low: 2 };
    const sorters = {
      'updated-desc': (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt), 'updated-asc': (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      'alpha-asc': (a, b) => a.title.localeCompare(b.title), 'alpha-desc': (a, b) => b.title.localeCompare(a.title),
      status: (a, b) => statusIndex[a.status] - statusIndex[b.status], importance: (a, b) => importanceIndex[a.importance] - importanceIndex[b.importance]
    };
    return copy.sort(sorters[sortBy] || sorters['updated-desc']);
  }
  PKM.nodeFilters = { apply, sort };
})(window.PKM = window.PKM || {});
