import { builder } from "../builder";

builder.prismaObject('AICategory', {
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        ais: t.relation('ais', { type: 'AI' }),
        createdAt: t.expose('createdAt', { type: 'String' }),
        updatedAt: t.expose('updatedAt', { type: 'String' }),
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