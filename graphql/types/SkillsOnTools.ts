import { builder } from "../builder";

builder.prismaObject("SkillsOnTools", {
    fields: (t) => ({
        id: t.exposeID("id"),
        skillId: t.exposeID("skillId"),
        toolId: t.exposeID("toolId"),
        tool: t.relation("tool", { type: "Tool" as any }),
        skill: t.relation("skill", { type: "Skill" as any }),
        createdAt: t.string({ resolve: (root) => root.createdAt.getTime().toString() }),
        updatedAt: t.string({ resolve: (root) => root.updatedAt.getTime().toString() }),
    }),
});