import { builder } from "../builder";

builder.prismaObject("SkillsOnTools", {
    fields: (t) => ({
        id: t.exposeID("id"),
        skillId: t.exposeID("skillId"),
        toolId: t.exposeID("toolId"),
        tool: t.relation("tool", { type: "Tool" }),
        skill: t.relation("skill", { type: "Skill" }),
        createdAt: t.expose("createdAt", { type: "String" }),
        updatedAt: t.expose("updatedAt", { type: "String" }),
    }),
});