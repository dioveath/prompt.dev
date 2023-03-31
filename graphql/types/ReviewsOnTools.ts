import { builder } from "../builder";

builder.prismaObject("ReviewsOnTools", {
    fields: (t) => ({
        id: t.exposeID("id"),
        tool: t.relation("tool", { type: "Tool" }),
        user: t.relation("user", { type: "User" }),
        rating: t.exposeInt("rating"),
        content: t.exposeString("content"),
        createdAt: t.expose("createdAt", { type: "String" }),
        updatedAt: t.expose("updatedAt", { type: "String" }),
    })
});