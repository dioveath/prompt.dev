import { builder } from "../builder";
import prisma from "../../lib/prisma";

builder.prismaObject("UsersOnTools", {
    fields: (t) => ({
        id: t.exposeID("id"),
        usedTool: t.relation("usedTool", { type: "Tool" as any }),
        user: t.relation("user", { type: "User" as any }),
        createdAt: t.string({ resolve: (root) => root.createdAt.getTime().toString() }),
        updatedAt: t.string({ resolve: (root) => root.updatedAt.getTime().toString() }),
    })
});