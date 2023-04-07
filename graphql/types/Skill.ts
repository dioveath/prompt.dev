import { builder } from "../builder";
import prisma from "../../lib/prisma";

builder.prismaObject('Skill', {
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        avatar: t.exposeString('avatar', { nullable: true }),
        posts: t.relation('posts', { type: 'SkillsOnPosts' as any}),
        createdAt: t.string({ resolve: (root) => root.createdAt.getTime().toString() }),
        updatedAt: t.string({ resolve: (root) => root.updatedAt.getTime().toString() }),
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

builder.mutationField('deleteSkill', (t) =>
    t.prismaField({
        type: 'Skill',
        args: {
            id: t.arg.id({ required: true }),
        },
        resolve: async (_query, _parent, args, ctx, _info) => {
            const { id } = args;
            const { user } = await ctx;

            if (!user) throw new Error('Not authenticated');

            return await prisma.skill.delete({
                where: {
                    id,
                },
            });
        },
    })
);
