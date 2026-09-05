(function (PKM) {
  function calculate(nodes = []) {
    const counts = Object.fromEntries(PKM.constants.STATUS.map((status) => [status, 0]));
    nodes.forEach((node) => { if (counts[node.status] !== undefined) counts[node.status] += 1; });
    return { total: nodes.length, counts, percentage: nodes.length ? Math.round((counts.Mastered / nodes.length) * 100) : 0 };
  }
  PKM.progress = { calculate };
})(window.PKM = window.PKM || {});
