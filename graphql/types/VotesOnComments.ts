import { builder } from "../builder";
import prisma from "../../lib/prisma";

builder.prismaObject('VotesOnComments', {
    fields: (t) => ({
        id: t.exposeID('id'),
        commentId: t.exposeID('commentId'),
        comment: t.relation('comment', { type: 'Comment' as any}),
        userId: t.exposeID('userId'),
        user: t.relation('user', { type: 'User' as any }),
        value: t.exposeInt('value'),
        createdAt: t.string({ resolve: (root) => root.createdAt.getTime().toString() }),
        updatedAt: t.string({ resolve: (root) => root.updatedAt.getTime().toString() }),
    }),
});