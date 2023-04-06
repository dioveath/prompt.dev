import { builder } from "../builder";

builder.prismaObject("AIsOnTools", {
    fields: (t) => ({
        id: t.exposeID("id"),
        aiId: t.exposeID("aiId"),
        toolId: t.exposeID("toolId"),
        tool: t.relation("tool", { type: "Tool" as any}),
        ai: t.relation("ai", { type: "AI" as any}),
        createdAt: t.string({ resolve: (root) => root.createdAt.getTime().toString() }),
        updatedAt: t.string({ resolve: (root) => root.updatedAt.getTime().toString() }),
    }),
});