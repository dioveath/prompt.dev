import slugify from "slugify";
import { builder } from "../builder";

builder.prismaObject("Post", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    content: t.exposeString("content", { nullable: true }),
    author: t.relation("author", { type: "User" }),
    votes: t.exposeInt("votes"),
    slug: t.exposeString("slug"),
    published: t.exposeBoolean("published"),
    skills: t.relation("skills", { type: "SkillsOnPosts" }),
    ais: t.relation("ais", { type: "AIsOnPosts" }),
    comments: t.relation("comments", { type: "Comment" }),
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

builder.queryField("post", (t) =>
  t.prismaField({
    type: "Post",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_query, _parent, args, _ctx, _info) => {
      const { id } = args;
      if (id === undefined) throw new Error("No id provided");
      const post =  await prisma.post.findUnique({ 
        where: { id: id.toString() },
        include: {
          comments: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              author: true,
              parent: true,
            },
          },          
        }        
      });

      return post;
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
      slug: t.arg.string({ required: false}),
      skills: t.arg.idList(),
      ais: t.arg.idList(),
    },
    resolve: async (_query, _parent, args, ctx, _info) => {
      const { user } = await ctx;
      if (!user) throw new Error("Not authenticated");

      const { title, content, slug, published, skills, ais } = args;

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!dbUser) throw new Error("User not found");
      const generatedSlug = slug || slugify(title, { lower: true, strict: true });

      const found = await prisma.post.findUnique({ where: { slug: generatedSlug } });
      if(found) throw new Error("Slug already exists"); 

      return await prisma.post.create({
        data: {
          title,
          content,
          slug: generatedSlug,
          published,
          authorId: dbUser.id,
          skills: !skills || skills.length === 0 ? undefined : {
            createMany: {
              data: skills.map((skillId) => ({ skillId })),
            },
          },
          ais: !ais || ais.length === 0 ? undefined : {
            createMany: {
              data: ais?.map((aiId) => ({ aiId })),
            },
          }
        },
      });
    },
  })
);


builder.mutationField("updatePost", (t) =>
  t.prismaField({
    type: "Post",
    args: {
      id: t.arg.id({ required: true }),
      title: t.arg.string(),
      content: t.arg.string(),
      votes: t.arg.int(),
      published: t.arg.boolean(),
      skills: t.arg.idList(),
      ais: t.arg.idList(),
    },
    resolve: async (_query, _parent, args, ctx, _info) => {
      const { user } = await ctx;
      if (!user) throw new Error("Not authenticated");

      const { id, title, content, votes, published, skills, ais } = args;
      if (id === undefined) throw new Error("No id provided");

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if(dbUser?.id !== (await prisma.post.findUnique({ where: { id: id.toString() } }))?.authorId) 
        throw new Error("Not authorized");

      return await prisma.post.update({
        where: { id: id.toString() },
        data: {
          title: title || undefined,
          content: content || undefined,
          votes: votes || undefined,
          published: published || undefined,
          skills: !skills || skills.length === 0 ? undefined : {
            createMany: {
              data: skills.map((skillId) => ({ skillId })),
            },
          },
          ais: !ais || ais.length === 0 ? undefined : {
            createMany: {
              data: ais?.map((aiId) => ({ aiId })),
            },
          }
        },
      });
    }
  })
);

builder.mutationField("updatePostVote", (t) =>
  t.prismaField({
    type: "Post",
    args: {
      id: t.arg.id({ required: true }),
      votes: t.arg.int({ required: true }),
    },
    resolve: async (_query, _parent, args, ctx, _info) => {
      const { user } = await ctx;
      if (!user) throw new Error("Not authenticated");

      const { id, votes } = args;
      if (id === undefined) throw new Error("No id provided");

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if(!dbUser) throw new Error("User not found");

      return await prisma.post.update({
        where: { id: id.toString() },
        data: {
          votes: typeof votes === 'number' ? votes : undefined,
        },
      });
    }
  })
);