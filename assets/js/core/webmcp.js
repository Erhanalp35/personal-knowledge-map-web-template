(function (PKM) {
  const context = document.modelContext;
  if (!context?.registerTool || window.__knowledgeAtlasToolsRegistered) return;
  window.__knowledgeAtlasToolsRegistered = true;
  const lifecycle = new AbortController();
  Promise.resolve(context.registerTool({
    name: 'create_knowledge_topic',
    title: 'Create knowledge topic',
    description: 'Create a topic in an existing Knowledge Atlas map and persist it in the same local application state used by the visible interface.',
    inputSchema: { type: 'object', properties: { mapId: { type: 'string' }, title: { type: 'string', minLength: 1, maxLength: 100 }, description: { type: 'string', maxLength: 500 }, category: { type: 'string', maxLength: 60 }, tags: { type: 'array', items: { type: 'string' }, maxItems: 20 }, status: { type: 'string', enum: PKM.constants.STATUS }, importance: { type: 'string', enum: PKM.constants.IMPORTANCE }, notes: { type: 'string', maxLength: 10000 } }, required: ['title'], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || typeof input.title !== 'string' || !input.title.trim()) throw new Error('A non-empty title is required.');
      const mapId = input.mapId || PKM.state.get().activeMapId;
      if (!PKM.state.mapById(mapId)) throw new Error('The requested map does not exist.');
      const result = PKM.nodes.create(mapId, { title: input.title, description: input.description || '', category: input.category || '', tags: input.tags || [], status: input.status || 'Not Started', importance: input.importance || 'Medium', notes: input.notes || '' });
      if (!result.valid) throw new Error(result.message);
      return { mapId, nodeId: result.value.id, title: result.value.title, status: result.value.status };
    }
  }, { signal: lifecycle.signal })).catch((error) => console.warn('Knowledge Atlas tool registration was unavailable.', error));
})(window.PKM = window.PKM || {});
