import { builder } from "../builder";


builder.prismaObject("ToolsOnPosts", {
    fields: (t) => ({
        id: t.exposeID("id"),
        tool: t.relation("tool", { type: "Tool" as any }),
        post: t.relation("post", { type: "Post" as any }),
        createdAt: t.string({ resolve: (root) => root.createdAt.getTime().toString() }),
        updatedAt: t.string({ resolve: (root) => root.updatedAt.getTime().toString() }),
    }),
});
