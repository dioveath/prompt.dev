import { builder } from "../builder";

builder.prismaObject('Post', {
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        content: t.exposeString('content', { nullable: true }),
        votes: t.exposeInt('votes'),
        published: t.exposeBoolean('published'),
        skills: t.relation('skills', { type: 'SkillsOnPosts' }),
        ais: t.relation('ais', { type: 'AIsOnPosts' }),
        createdAt: t.expose('createdAt', { type: 'String' }),
        updatedAt: t.expose('updatedAt', { type: 'String' }),
    }),
});