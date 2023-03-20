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