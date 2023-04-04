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
        skills: t.relation("skills"),
        ais: t.relation("ais"),
        toolAuthors: t.relation("toolAuthors", { type: "AuthorsOnTools" }),
        toolUsers: t.relation("toolUsers", { type: "UsersOnTools" }),
        meUses: t.boolean({
            select: {
                toolUsers: true
            },
            resolve: async (parent, _args, ctx, _info) => {
                const { user } = await ctx;
                if(!user) return false;
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });
                if (!dbUser) return false;
                const toolUsers = await prisma.usersOnTools.findMany({
                    where: {
                        toolId: parent.id,
                        userId: dbUser.id
                    }
                });
                return toolUsers.length > 0;
            }
        }),
        views: t.exposeInt("views"),
        published: t.exposeBoolean("published"),
        lastReleased: t.expose("lastReleased", { type: "String", nullable: true }),
        createdAt: t.expose("createdAt", { type: "String" }),
        updatedAt: t.expose("updatedAt", { type: "String" }),
    })
});

builder.queryField("tools", (t) =>
    t.prismaConnection({
        type: "Tool",
        cursor: "id",
        args: {
            category: t.arg.id({ required: false }),
            search: t.arg.string({ required: false }),
            skills: t.arg.idList({ required: false }),
            ais: t.arg.idList({ required: false }),
            authors: t.arg.idList({ required: false }),
            published: t.arg.boolean({ required: false }),
            orderBy: t.arg.string({ required: false }),
            order: t.arg.string({ required: false }),
        },
        resolve: (query: any, _parent, args, _ctx, _info) => {
            const { category, search, skills, ais, authors, published, orderBy, order } = args;

            if (category) {
                query.where = {
                    ...query.where,
                    category: { id: category }
                }
            }

            if (search) {
                query.where = {
                    ...query.where,
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { shortDescription: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                        { website: { contains: search, mode: 'insensitive' } },
                    ]
                }
            }

            if (skills && skills.length > 0) {
                console.log(skills);
                query.where = {
                    ...query.where,
                    skills: { 
                        some: { skillId: { in: skills }} 
                    } 
                }
            }

            if (ais && ais.length > 0) {
                query.where = {
                    ...query.where,
                    ais: { some: { id: { in: ais } } }
                }
            }

            if(orderBy) {
                query.orderBy = {
                    [orderBy]: order ? order : "desc"
                }
            }

            console.log(query);

            return prisma.tool.findMany({ ...query });
        }
    })
);

builder.queryField("tool", (t) =>
    t.prismaField({
        type: "Tool",
        args: {
            id: t.arg.id({ required: true }),
        },
        resolve: async (_query, _parent, args, _ctx, _info) => {
            const { id } = args;
            if (id === undefined) throw new Error("No id provided");
            const tool = await prisma.tool.findUnique({
                where: { id: id.toString() },
                include: {
                    toolAuthors: { 
                        include: {
                            author: true
                        }
                    },
                    toolUsers: {
                        include: {
                            user: true
                        }
                    },
                    reviews: {
                        include: {
                            user: true
                        }
                    }
                }
            });
            if (!tool) throw new Error("Tool not found");
            return tool;
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
                            authorId: dbUser.id,
                        }
                    }
                }
            });
        }
    })
);

builder.mutationField("updateTool", (t) =>
    t.prismaField({
        type: "Tool",
        args: {
            id: t.arg.id({ required: true }),
            title: t.arg.string({ required: false }),
            description: t.arg.string({ required: false }),            
            shortDescription: t.arg.string({ required: false }),
            avatar: t.arg.string({ required: false }),
            website: t.arg.string({ required: false }),
            category: t.arg.id({ required: false }),
            ais: t.arg.idList({ required: false }),
            skills: t.arg.idList({ required: false }),
        },
        resolve: async (_query, _parent, args, _ctx, _info) => {
            const { user } =  await _ctx;
            const { id, title, shortDescription, description, avatar, website, category, ais, skills } = args;

            const dbUser = await prisma.user.findUnique({
                where: { email: user?.email },
            });

            if (!dbUser) throw new Error("User not found");

            const tool : any = await prisma.tool.findUnique({
                where: { id: id.toString() },
                include: {
                    toolAuthors: true,
                    ais: true,
                    skills: true,
                }
            });

            const { ais: oldAis, skills: oldSkills } = tool;
            const newAis = ais?.filter(id => !oldAis.some((oldAi: any) => oldAi.aiId === id)) || [];
            const newSkills = skills?.filter(id => !oldSkills.some((oldSkill: any) => oldSkill.skillId === id)) || [];

            if (!tool) throw new Error("Tool not found");
            const isAuthor = tool.toolAuthors.some((toolAuthor: any) => toolAuthor.authorId === dbUser.id);
            if (!isAuthor) throw new Error("User is not author of this tool");

            return await prisma.tool.update({
                where: { id: id.toString() },
                data: {
                    title: title?.toString(),
                    shortDescription,
                    description,
                    avatar,
                    website: website?.toString(),
                    categoryId: category?.toString(),
                    ais: !newAis || newAis.length === 0 ? undefined : {
                        createMany: { data: newAis?.map(id => ({ aiId: id.toString() })) },
                    },
                    skills: !skills || skills.length === 0 ? undefined : {
                        createMany: { data: newSkills?.map(id => ({ skillId: id.toString() })) },
                    }
                },
                include: {
                    category: true,
                    ais: { include: { ai: true } },
                    skills: { include: { skill: true } },
                }
            });
        }
    })
);


builder.mutationField("deleteTool", (t) =>
    t.prismaField({
        type: "Tool",
        args: {
            id: t.arg.id({ required: true }),
        },
        resolve: async (_query, _parent, args, _ctx, _info) => {
            const { user } =  await _ctx;
            const { id } = args;

            const dbUser = await prisma.user.findUnique({
                where: { email: user?.email },
            });

            if (!dbUser) throw new Error("User not found");

            const tool = await prisma.tool.findUnique({
                where: { id: id.toString() },
                include: {
                    toolAuthors: true,
                }
            });

            if (!tool) throw new Error("Tool not found");
            
            const isAuthor = tool.toolAuthors.some((toolAuthor: any) => toolAuthor.authorId === dbUser.id);
            if (!isAuthor) { throw new Error("User is not author of this tool"); }

            return await prisma.tool.delete({
                where: { id: id.toString() },
            });
        }
    })
);


builder.mutationField("updateMeOnToolUsers", (t) =>
    t.prismaField({
        type: "Tool",
        args: {
            id: t.arg.id({ required: true }),
        },
        resolve: async (_query, _parent, args, _ctx, _info) => {
            const { user } =  await _ctx;
            const { id } = args;

            const dbUser = await prisma.user.findUnique({
                where: { email: user?.email },
            });
            if (!dbUser) throw new Error("User not found");

            const tool = await prisma.tool.findUnique({
                where: { id: id.toString() },
                include: { toolUsers: true }
            });

            if (!tool) throw new Error("Tool not found");
            const oldToolUsers = tool.toolUsers;
            const isUser = oldToolUsers.some(toolUser => toolUser.userId === dbUser.id);

            if (isUser) {
                await prisma.usersOnTools.deleteMany({
                    where: {
                        userId: dbUser.id,
                        toolId: id.toString(),
                    }
                });                
            }

            return await prisma.tool.update({
                where: { id: id.toString() },
                data: {
                    toolUsers: !isUser ? { create: { userId: dbUser.id } } : undefined,
                },
                include: {
                    toolUsers: {
                        include: {
                            user: true
                        }
                    },
                    toolAuthors: {
                        include: {
                            author: true
                        }
                    },
                    reviews: {
                        include: {
                            user: true
                        }
                    }
                }
            });
        }
    })
);
