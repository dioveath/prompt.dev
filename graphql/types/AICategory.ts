import { builder } from "../builder";

builder.prismaObject('AICategory', {
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        ais: t.relation('ais', { type: 'AI' as any }),
        createdAt: t.string({ resolve: (root) => root.createdAt.getTime().toString() }),
        updatedAt: t.string({ resolve: (root) => root.updatedAt.getTime().toString() }),
    }),
});

builder.mutationField('createAICategory', (t) =>
    t.prismaField({
        type: 'AICategory',
        args: {
            title: t.arg.string({ required: true }),
        },
        resolve: async (_query, _parent, args, _ctx, _info) => {
            const { title } = args;
            return await prisma.aICategory.create({
                data: {
                    title,
                },
            });
        },
    })
);