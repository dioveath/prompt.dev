import { builder } from "../builder";

builder.prismaObject("UsersOnTools", {
    fields: (t) => ({
        id: t.exposeID("id"),
        authoredTool: t.relation("authoredTool", { type: "Tool" }),
        usedTool: t.relation("usedTool", { type: "Tool" }),
        user: t.relation("user", { type: "User" }),
        createdAt: t.expose("createdAt", { type: "String" }),
        updatedAt: t.expose("updatedAt", { type: "String" }),
    })
});