import { builder } from "../builder";
import prisma from "../../lib/prisma";

builder.prismaObject('AIsOnPosts', {
    fields: (t) => ({
        id: t.exposeID('id'),
        aiId: t.exposeID('aiId'),
        postId: t.exposeID('postId'),
        post: t.relation('post', { type: 'Post' as any }),
        ai: t.relation('ai', { type: 'AI' as any}),
        createdAt: t.string({ resolve: (root) => root.createdAt.getTime().toString() }),
        updatedAt: t.string({ resolve: (root) => root.updatedAt.getTime().toString() }),
    }),
});
