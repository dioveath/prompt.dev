import { builder } from "../builder";

builder.prismaObject('AIsOnPosts', {
    fields: (t) => ({
        id: t.exposeID('id'),
        aiId: t.exposeID('aiId'),
        postId: t.exposeID('postId'),
        post: t.relation('post', { type: 'Post' }),
        ai: t.relation('ai', { type: 'AI' }),
        createdAt: t.expose('createdAt', { type: 'String' }),
        updatedAt: t.expose('updatedAt', { type: 'String' }),
    }),
});
