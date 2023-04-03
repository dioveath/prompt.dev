import { builder } from "../builder";

builder.prismaObject("AIsOnTools", {
    fields: (t) => ({
        id: t.exposeID("id"),
        aiId: t.exposeID("aiId"),
        toolId: t.exposeID("toolId"),
        tool: t.relation("tool", { type: "Tool" }),
        ai: t.relation("ai", { type: "AI" }),
        createdAt: t.expose("createdAt", { type: "String" }),
        updatedAt: t.expose("updatedAt", { type: "String" }),
    }),
});