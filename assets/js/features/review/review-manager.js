(function (PKM) {
  const intervals = () => PKM.state.get().settings.reviewIntervals;
  function nextDate(status, from = Date.now()) { if (status === 'Not Started') return ''; const days = intervals()[status] || 1; return new Date(new Date(from).getTime() + days * 86400000).toISOString(); }
  function buckets(nodes = PKM.state.allNodes()) {
    const today = PKM.helpers.dayStart().getTime(); const tomorrow = today + 86400000;
    const result = { overdue: [], today: [], upcoming: [] };
    nodes.forEach((node) => { if (!node.nextReviewAt) return; const time = new Date(node.nextReviewAt).getTime(); if (Number.isNaN(time)) return; if (time < today) result.overdue.push(node); else if (time < tomorrow) result.today.push(node); else result.upcoming.push(node); });
    Object.values(result).forEach((list) => list.sort((a, b) => new Date(a.nextReviewAt) - new Date(b.nextReviewAt))); return result;
  }
  function update(mapId, nodeId, values, label) { PKM.state.update((state) => { const map = state.maps.find((item) => item.id === mapId); const node = map?.nodes.find((item) => item.id === nodeId); if (!node) return; Object.assign(node, values, { updatedAt: PKM.helpers.now() }); map.updatedAt = node.updatedAt; PKM.activity.addToDraft(state, 'review.changed', `${label} “${node.title}”`, { mapId, nodeId }); }, { source: 'review', historyLabel: label }); }
  function markReviewed(mapId, nodeId, status) { const node = PKM.state.nodeById(mapId, nodeId); if (!node) return; const nextStatus = PKM.constants.STATUS.includes(status) ? status : node.status; const stamp = PKM.helpers.now(); update(mapId, nodeId, { status: nextStatus, lastReviewedAt: stamp, reviewCount: (node.reviewCount || 0) + 1, nextReviewAt: nextDate(nextStatus, stamp) }, 'Review topic'); }
  function snooze(mapId, nodeId, days = 1) { update(mapId, nodeId, { nextReviewAt: new Date(Date.now() + Math.max(1, Number(days) || 1) * 86400000).toISOString() }, 'Snooze review'); }
  function schedule(mapId, nodeId, iso, priority) { update(mapId, nodeId, { nextReviewAt: iso ? new Date(`${iso}T12:00:00`).toISOString() : '', reviewPriority: ['Low', 'Normal', 'High'].includes(priority) ? priority : 'Normal' }, 'Update review schedule'); }
  const due = () => { const value = buckets(); return [...value.overdue, ...value.today]; };
  PKM.review = { nextDate, buckets, markReviewed, snooze, schedule, due };
})(window.PKM = window.PKM || {});
