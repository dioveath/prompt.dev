import { builder } from "../builder";


builder.prismaObject("ToolsOnPosts", {
    fields: (t) => ({
        id: t.exposeID("id"),
        tool: t.relation("tool", { type: "Tool" }),
        post: t.relation("post", { type: "Post" }),
        createdAt: t.expose("createdAt", { type: "String" }),
        updatedAt: t.expose("updatedAt", { type: "String" }),
    }),
});
