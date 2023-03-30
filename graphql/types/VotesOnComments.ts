import { builder } from "../builder";

builder.prismaObject('VotesOnComments', {
    fields: (t) => ({
        id: t.exposeID('id'),
        commentId: t.exposeID('commentId'),
        comment: t.relation('comment', { type: 'Comment' }),
        userId: t.exposeID('userId'),
        user: t.relation('user', { type: 'User' }),
        value: t.exposeInt('value'),
        createdAt: t.expose('createdAt', { type: 'String' }),
        updatedAt: t.expose('updatedAt', { type: 'String' }),
    }),
});