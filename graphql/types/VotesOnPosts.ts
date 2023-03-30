import { builder } from "../builder";

builder.prismaObject('VotesOnPosts', {
    fields: (t) => ({
        id: t.exposeID('id'),
        postId: t.exposeID('postId'),
        post: t.relation('post', { type: 'Post' }),
        userId: t.exposeID('userId'),
        user: t.relation('user', { type: 'User' }),
        value: t.exposeInt('value'),
        createdAt: t.expose('createdAt', { type: 'String' }),
        updatedAt: t.expose('updatedAt', { type: 'String' }),
    }),
});