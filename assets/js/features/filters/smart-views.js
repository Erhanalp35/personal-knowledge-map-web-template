(function (PKM) {
  function apply(id, nodes = PKM.state.allNodes()) {
    const now = Date.now(); const week = now - 7 * 86400000;
    const connectionIds = new Set(PKM.state.get().maps.flatMap((map) => map.connections.flatMap((item) => [item.sourceId, item.targetId])));
    const views = {
      attention: (node) => node.importance === 'High' && node.status !== 'Mastered',
      priority: (node) => node.importance === 'High',
      due: (node) => node.nextReviewAt && new Date(node.nextReviewAt).getTime() <= now,
      mastered: (node) => node.status === 'Mastered' && new Date(node.updatedAt).getTime() >= week,
      unconnected: (node) => !connectionIds.has(node.id)
    };
    return id && views[id] ? nodes.filter(views[id]) : nodes;
  }
  PKM.smartViews = { apply };
})(window.PKM = window.PKM || {});
