import { builder } from "../builder";

builder.prismaObject('SkillsOnPosts', {
    fields: (t) => ({
        id: t.exposeID('id'),
        skillId: t.exposeID('skillId'),
        postId: t.exposeID('postId'),
        post: t.relation('post', { type: 'Post' as any}),
        skill: t.relation('skill', { type: 'Skill' as any}),
        createdAt: t.string({ resolve: (root) => root.createdAt.getTime().toString() }),
        updatedAt: t.string({ resolve: (root) => root.updatedAt.getTime().toString() }),
    }),
});