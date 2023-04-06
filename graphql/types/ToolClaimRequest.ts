import { builder } from "../builder";


builder.prismaObject("ToolClaimRequest", {
    fields: (t) => ({
        id: t.exposeID("id"),
        tool: t.relation("tool", { type: "Tool" as any }),
        user: t.relation("user", { type: "User" as any }),
        message: t.exposeString("message"),
        createdAt: t.string({ resolve: (root) => root.createdAt.getTime().toString() }),
        updatedAt: t.string({ resolve: (root) => root.updatedAt.getTime().toString() }),
    })
});

builder.mutationField("createToolClaimRequest", (t) =>
    t.prismaField({
        type: "ToolClaimRequest",
        args: {
            toolId: t.arg.id({ required: true }),
            message: t.arg.string({ required: true }),
        },
        resolve: async (_query, _parent, args,  ctx, _info) => {
            const { user } = await ctx;            
            if (!user) throw new Error("Not authenticated");
            const { toolId, message } = args;
            
            const dbUser = await prisma.user.findUnique({
                where: { email: user.email },
            });
            if (!dbUser) throw new Error("User not found");

            const prevClaimRequest = await prisma.toolClaimRequest.findFirst({
                where: {
                    toolId: toolId?.toString(),
                    userId: dbUser.id
                }
            });

            if(prevClaimRequest) throw new Error("You already have a claim request for this tool");

            const toolClaimRequest = await prisma.toolClaimRequest.create({
                data: {
                    tool: { connect: { id: toolId?.toString() } },
                    user: { connect: { id: dbUser.id } },
                    message
                }
            });
    
            return toolClaimRequest;
        }
    })
);
