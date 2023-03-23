import { builder } from "../builder";

builder.prismaObject('Skill', {
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        posts: t.relation('posts', { type: 'SkillsOnPosts' }),
        createdAt: t.expose('createdAt', { type: 'String' }),
        updatedAt: t.expose('updatedAt', { type: 'String' }),
    }),
});

builder.queryField('skills', (t) =>
    t.prismaField({
        type: ['Skill'],
        resolve: async (query, _parent, _args, _ctx, _info) => {
            return await prisma.skill.findMany({ ...query });
        },
    })
);

builder.mutationField('createSkill', (t) =>
    t.prismaField({
        type: 'Skill',
        args: {
            title: t.arg.string({ required: true }),
        },
        resolve: async (_query, _parent, args, ctx, _info) => {
            const { title } = args;
            const { user } = await ctx;

            if (!user) throw new Error('Not authenticated');

            return await prisma.skill.create({
                data: {
                    title,
                },
            });
        },
    })
);