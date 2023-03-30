import { builder } from "../builder";

builder.prismaObject('AI', {
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        description: t.exposeString('description'),
        avatar: t.exposeString('avatar', { nullable: true }),
        company: t.exposeString('company', { nullable: true }),
        website: t.exposeString('website'),
        posts: t.relation('posts', { type: 'Post' }),
        category: t.relation('category', { type: 'AICategory' }),
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

builder.mutationField('createAI', (t) =>
    t.prismaField({
        type: 'AI',
        args: {
            title: t.arg.string({ required: true }),
            description: t.arg.string({ required: true }),
            company: t.arg.string({ required: false }),
            website: t.arg.string({ required: true }),
            categoryId: t.arg.id({ required: false }),
        },
        resolve: async (_query, _parent, args, ctx, _info) => {
            const { user } = await ctx;
            if (!user) throw new Error('Not authenticated');

            console.log(args);

            const { title, description, company, website, categoryId } = args;
            const dbUser = await prisma.user.findUnique({
                where: { email: user.email },
            });

            if (!dbUser) throw new Error('User not found');

            return await prisma.aI.create({
                data: {
                    title,
                    description,
                    company,
                    website,
                    categoryId
                },
            });
        }
    })
);