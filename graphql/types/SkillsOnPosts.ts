import { builder } from "../builder";

builder.prismaObject('SkillsOnPosts', {
    fields: (t) => ({
        id: t.exposeID('id'),
        skillId: t.exposeID('skillId'),
        postId: t.exposeID('postId'),
        post: t.relation('post', { type: 'Post' }),
        skill: t.relation('skill', { type: 'Skill' }),
        createdAt: t.expose('createdAt', { type: 'String' }),
        updatedAt: t.expose('updatedAt', { type: 'String' }),
    }),
});