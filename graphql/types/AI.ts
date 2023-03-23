import { builder } from "../builder";

builder.prismaObject('AI', {
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        posts: t.relation('posts', { type: 'AIsOnPosts' }),
        createdAt: t.expose('createdAt', { type: 'String' }),
        updatedAt: t.expose('updatedAt', { type: 'String' }),
    }),
});

builder.queryField('ais', (t) =>
    t.prismaField({
        type: ['AI'],
        resolve: async (query, _parent, _args, _ctx, _info) => {
            return await prisma.aI.findMany({ ...query });
        },
    })
);