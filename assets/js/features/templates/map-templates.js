(function (PKM) {
  const templates = [
    { id: 'blank', name: 'Blank Map', description: 'Start with an empty canvas.', nodes: [], connections: [] },
    { id: 'web-development', name: 'Web Development', description: 'A practical path through frontend foundations.', titles: ['HTML', 'CSS', 'JavaScript', 'Browser APIs', 'Accessibility', 'Testing'] },
    { id: 'study-plan', name: 'Study Plan', description: 'Organize a subject from overview to review.', titles: ['Overview', 'Core Concepts', 'Practice', 'Weak Areas', 'Revision', 'Assessment'] },
    { id: 'research-map', name: 'Research Map', description: 'Connect a question to sources, evidence, and findings.', titles: ['Research Question', 'Key Sources', 'Evidence', 'Counterpoints', 'Findings', 'Next Questions'] },
    { id: 'language-learning', name: 'Language Learning', description: 'Track vocabulary, grammar, listening, and speaking.', titles: ['Vocabulary', 'Grammar', 'Listening', 'Speaking', 'Reading', 'Writing'] },
    { id: 'project-learning', name: 'Project Learning', description: 'Learn by building milestones and reflecting on results.', titles: ['Goal', 'Requirements', 'Core Skills', 'Milestone 1', 'Milestone 2', 'Retrospective'] }
  ];
  function build(id, stamp) {
    const template = templates.find((item) => item.id === id) || templates[0]; if (!template.titles) return { nodes: [], connections: [], groups: [] };
    const nodes = template.titles.map((title, index) => ({ id: PKM.helpers.uid('node'), title, description: '', category: template.name, tags: [], status: 'Not Started', importance: index < 2 ? 'High' : 'Medium', notes: '', favorite: false, groupId: '', x: 150 + (index % 3) * 330, y: 150 + Math.floor(index / 3) * 230, lastReviewedAt: '', reviewCount: 0, nextReviewAt: '', reviewPriority: 'Normal', createdAt: stamp, updatedAt: stamp }));
    const connections = nodes.slice(1).map((node, index) => ({ id: PKM.helpers.uid('connection'), sourceId: nodes[index].id, targetId: node.id, type: 'Leads To', label: '', createdAt: stamp, updatedAt: stamp }));
    return { nodes, connections, groups: [] };
  }
  function apply(mapId, templateId) { const template = build(templateId, PKM.helpers.now()); if (!template.nodes.length) return false; PKM.state.update((state) => { const map = state.maps.find((item) => item.id === mapId); if (!map || map.nodes.length) return; Object.assign(map, template, { updatedAt: PKM.helpers.now() }); PKM.categories.syncDraft(state); PKM.tags.syncDraft(state); }, { source: 'template', historyLabel: 'Apply map template' }); return true; }
  PKM.mapTemplates = { all: () => templates.map(({ titles, ...item }) => ({ ...item })), build, apply };
})(window.PKM = window.PKM || {});
