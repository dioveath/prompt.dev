import { PrismaFieldResolver } from "@pothos/plugin-prisma";
import PrismaTypes from "@pothos/plugin-prisma/generated";
import { builder } from "../builder";

builder.prismaObject('User', {
    fields: (t) => ({
        id: t.exposeID('id'),
        email: t.exposeString('email'),
        name: t.exposeString('name', { nullable: true }),
        avatar: t.exposeString('avatar', { nullable: true }),
        jobTitle: t.exposeString('jobTitle', { nullable: true }),
        posts: t.relation('posts'),
        createdAt: t.expose('createdAt', { type: 'String' }),
        updatedAt: t.expose('updatedAt', { type: 'String' }),
    })
});


builder.queryField('users', (t) => 
    t.prismaField({
        type: ['User'],
        resolve: async (query, _parent, _args, _ctx, _info) => {
            const users = await prisma.user.findMany({ ...query });
            return users;
        }
    })
);