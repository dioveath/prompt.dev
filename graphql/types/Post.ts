import { builder } from "../builder";

builder.prismaObject("Post", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    content: t.exposeString("content", { nullable: true }),
    author: t.relation("author", { type: "User" }),
    votes: t.exposeInt("votes"),
    published: t.exposeBoolean("published"),
    skills: t.relation("skills", { type: "SkillsOnPosts" }),
    ais: t.relation("ais", { type: "AIsOnPosts" }),
    createdAt: t.expose("createdAt", { type: "String" }),
    updatedAt: t.expose("updatedAt", { type: "String" }),
  }),
});

builder.queryField("posts", (t) =>
  t.prismaField({
    type: ["Post"],
    resolve: async (query, _parent, _args, _ctx, _info) => {
      return await prisma.post.findMany({ ...query });
    },
  })
);

builder.mutationField("createPost", (t) =>
  t.prismaField({
    type: "Post",
    args: {
      title: t.arg.string({ required: true }),
      content: t.arg.string({ required: true }),
      published: t.arg.boolean({ defaultValue: false, required: true }),
      skills: t.arg.idList(),
      ais: t.arg.idList(),
    },
    resolve: async (_query, _parent, args, ctx, _info) => {
      const { user } = ctx;
      if (!user) throw new Error("Not authenticated");

      const { title, content, published, skills, ais } = args;
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!dbUser) throw new Error("User not found");

      return await prisma.post.create({
        data: {
          title,
          content,
          published,
          authorId: dbUser.id,
        },
      });
    },
  })
);