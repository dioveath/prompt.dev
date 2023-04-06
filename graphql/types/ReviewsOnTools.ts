import { builder } from "../builder";

builder.prismaObject("ReviewsOnTools", {
    fields: (t) => ({
        id: t.exposeID("id"),
        tool: t.relation("tool", { type: "Tool" as any}),
        user: t.relation("user", { type: "User" as any}),
        rating: t.exposeInt("rating"),
        content: t.exposeString("content"),
        createdAt: t.string({ resolve: (root) => root.createdAt.getTime().toString() }),
        updatedAt: t.string({ resolve: (root) => root.updatedAt.getTime().toString() }),
    })
});