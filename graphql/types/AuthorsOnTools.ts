import { builder } from "../builder";

builder.prismaObject("AuthorsOnTools", {
    fields: (t) => ({
        id: t.exposeID("id"),
        tool: t.relation("tool", { type: "Tool" }),
        author: t.relation("author", { type: "User" }),
        createdAt: t.expose("createdAt", { type: "String" }),
        updatedAt: t.expose("updatedAt", { type: "String" }),
    })
});