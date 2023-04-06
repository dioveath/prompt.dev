import { builder } from "../builder";

builder.prismaObject("AuthorsOnTools", {
    fields: (t) => ({
        id: t.exposeID("id"),
        tool: t.relation("tool", { type: "Tool" as any }),
        author: t.relation("author", { type: "User" as any }),
        createdAt: t.string({ resolve: (root) => root.createdAt.getTime().toString() }),
        updatedAt: t.string({ resolve: (root) => root.updatedAt.getTime().toString() }),
    })
});