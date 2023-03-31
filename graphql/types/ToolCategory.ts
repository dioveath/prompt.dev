import { builder } from '../builder';

builder.prismaObject('ToolCategory', {
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        tools: t.relation('tools'),
        createdAt: t.expose('createdAt', { type: 'String' }),
        updatedAt: t.expose('updatedAt', { type: 'String' }),
    })
});