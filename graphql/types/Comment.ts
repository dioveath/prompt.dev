import { builder } from "../builder";

builder.prismaObject("Comment", {
    fields: (t) => ({
        id: t.exposeID("id"),
        content: t.exposeString("content"),
        post: t.relation("post", { type: "Post" }),        
        author: t.relation("author", { type: "User" }),
        votes: t.exposeInt("votes"),
        replies: t.relation("replies", { type: "Comment" }),
        createdAt: t.expose("createdAt", { type: "String" }),
        updatedAt: t.expose("updatedAt", { type: "String" }),
    }),
});

builder.queryField("comments", (t) =>
    t.prismaField({
        type: ["Comment"],
        args: {
            postId: t.arg.id({ required: true }),
        },
        resolve: async (query, _parent, args, _ctx, _info) => {
            const { postId } = args;
            if (postId === undefined) throw new Error("No postId provided");
            return await prisma.comment.findMany({
                ...query,
                where: {
                    postId: postId.toString(),
                },
            });
        },
    })
);


builder.mutationField("createComment", (t) =>
    t.prismaField({
        type: "Comment",
        args: {
            content: t.arg.string({ required: true }),
            postId: t.arg.id({ required: true }),
            parentId: t.arg.id({ required: false }),
        },
        resolve: async (_query, _parent, args, ctx, _info) => {
            const { user } = await ctx;
            if (!user) throw new Error("Not authenticated");

            const { content, postId, parentId } = args;
            const dbUser = await prisma.user.findUnique({
                where: { email: user.email },
            });

            if (!dbUser) throw new Error("User not found");

            return await prisma.comment.create({
                data: {
                    content,
                    authorId: dbUser.id,
                    postId: postId?.toString() || undefined,
                    parentId: parentId?.toString() || undefined,
                }
            });
        }
    })
);