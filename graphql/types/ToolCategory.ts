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

builder.queryField('toolCategories', (t) => 
    t.prismaField({
        type: ['ToolCategory'],
        resolve: (query, _parent, _args, _ctx, _info) => {
            return prisma.toolCategory.findMany({ ...query });
        }
    })
);

builder.mutationField('createToolCategory', (t) =>
    t.prismaField({
        type: 'ToolCategory',
        args: {
            title: t.arg.string({ required: true }),
        },
        resolve: async (_query, _parent, args, ctx, _info) => {
            const { title } = args;
            const { user } = await ctx;

            if (!user) throw new Error('Not authenticated');

            return await prisma.toolCategory.create({
                data: {
                    title,
                }
            });
        }
    })
);
