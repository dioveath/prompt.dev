import { builder } from "../builder";

builder.prismaObject('VotesOnPosts', {
    fields: (t) => ({
        id: t.exposeID('id'),
        postId: t.exposeID('postId'),
        post: t.relation('post', { type: 'Post' as any }),
        userId: t.exposeID('userId'),
        user: t.relation('user', { type: 'User' as any }),
        value: t.exposeInt('value'),
        createdAt: t.string({ resolve: (root) => root.createdAt.getTime().toString() }),
        updatedAt: t.string({ resolve: (root) => root.updatedAt.getTime().toString() }),
    }),
});