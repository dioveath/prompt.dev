import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import prisma from "../lib/prisma";
import { createContext } from "./context";

export const builder = new SchemaBuilder<{ 
    PrismaTypes: PrismaTypes,
    Context: ReturnType<typeof createContext>
 }>({
    plugins: [PrismaPlugin],
    prisma: { client: prisma }
});

builder.queryType({
    fields: (t) => ({
        ok: t.boolean({
            resolve: () => true
        }),
        me: t.prismaField({
            type: "User",
            resolve: async (query, root, args, ctx, info) => {
                const { user } = await ctx;
                if(!user) throw new Error("Not authenticated");

                return prisma.user.findUnique({
                    where: {
                        email: user.email
                    }
                })
            }
        })        
    })
});



builder.mutationType({}) 