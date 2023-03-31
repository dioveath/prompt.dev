import { builder } from "../builder";

builder.prismaObject("Tool", {
    fields: (t) => ({
        id: t.exposeID("id"),
        title: t.exposeString("title"),
        shortDescription: t.exposeString("shortDescription", { nullable: true }),
        description: t.exposeString("description", { nullable: true }),
        avatar: t.exposeString("avatar", { nullable: true }),
        website: t.exposeString("website"),
        category: t.expose("category", { type: "ToolCategory", nullable: true }),
        reviews: t.relation("reviews"),
        toolAuthors: t.relation("toolAuthors"),
        toolUsers: t.relation("toolUsers"),

        published: t.exposeBoolean("published"),
        lastReleased: t.expose("lastReleased", { type: "String", nullable: true }),
        createdAt: t.expose("createdAt", { type: "String" }),
        updatedAt: t.expose("updatedAt", { type: "String" }),
    })
});

builder.queryField("tools", (t) =>
    t.prismaField({
        type: ["Tool"],
        resolve: (query, _parent, _args, _ctx, _info) => {
            return prisma.tool.findMany({ ...query });
        }
    })
);

builder.mutationField("createTool", (t) =>
    t.prismaField({
        type: "Tool",
        args: {
            title: t.arg.string({ required: true }),
            shortDescription: t.arg.string({ required: false }),
            description: t.arg.string({ required: false }),
            avatar: t.arg.string({ required: false }),
            website: t.arg.string({ required: true }),
        },
        resolve: async (_query, _parent, args, _ctx, _info) => {
            const { user } =  await _ctx;
            const { title, shortDescription, description, avatar, website } = args;

            const dbUser = await prisma.user.findUnique({
                where: { email: user?.email },
            });

            if (!dbUser) throw new Error("User not found");

            return await prisma.tool.create({
                data: {
                    title,
                    shortDescription,
                    description,
                    avatar,
                    website,
                    toolAuthors: {
                        create: {
                            userId: dbUser.id,
                        }
                    }
                }
            });
        }
    })
);