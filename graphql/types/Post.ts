import slugify from "slugify";
import { builder } from "../builder";

builder.prismaObject("Post", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    content: t.exposeString("content", { nullable: true }),
    author: t.relation("author", { type: "User" }),
    votes: t.relation("votes", { type: "VotesOnPosts" }),
    votesCount: t.relationCount("votes"),
    meVoted: t.boolean({
      select: {
        votes: true
      },
      resolve: async (parent, _args, ctx, _info) => {
        const { user } = await ctx;
        if (!user) return false;
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!dbUser) return false;
        const votes = await prisma.votesOnPosts.findMany({
          where: {
            postId: parent.id,
            userId: dbUser.id
          }
        });
        return votes.length > 0;
      }
    }),
    slug: t.exposeString("slug"),
    published: t.exposeBoolean("published"),
    skills: t.relation("skills", { type: "SkillsOnPosts" }),
    ais: t.relation("ais", { type: "AIsOnPosts" }),
    tools: t.relation("tools", { type: "ToolsOnPosts" }),
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
          _count: { select: { votes: true } },
          comments: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              author: true,
              parent: true,
              votes: true,
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
      tools: t.arg.idList(),
    },
    resolve: async (_query, _parent, args, ctx, _info) => {
      const { user } = await ctx;
      if (!user) throw new Error("Not authenticated");

      const { title, content, slug, published, skills, ais, tools } = args;

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
              data: skills.map((skillId) => ({ skillId: skillId.toString() })),
            },
          },
          ais: !ais || ais.length === 0 ? undefined : {
            createMany: {
              data: ais?.map((aiId) => ({ aiId: aiId.toString() })),
            },
          },
          tools: !tools || tools.length === 0 ? undefined : {
            createMany: {
              data: tools?.map((toolId) => ({ toolId: toolId.toString() })),
            }
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
      published: t.arg.boolean(),
      skills: t.arg.idList(),
      ais: t.arg.idList(),
      slug: t.arg.string(),
      tools: t.arg.idList(),
    },
    resolve: async (_query, _parent, args, ctx, _info) => {
      const { user } = await ctx;
      if (!user) throw new Error("Not authenticated");

      let { id, title, content, published, skills, ais, tools } = args;
      if (id === undefined) throw new Error("No id provided");

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      const post : any = await prisma.post.findUnique({ where: { id: id.toString() }, include: { skills: true, ais: true, tools: true } });
      if(!post) throw new Error("Post not found");
      if(dbUser?.id !== post?.authorId) throw new Error("Not authorized");

      const { skills: oldSkills, ais: oldAis, tools: oldTools } = post;

      const newSkills = skills?.filter((skillId) => !oldSkills?.some((skill: any) => skill.skillId === skillId.toString())) || [];
      const newAis = ais?.filter((aiId) => !oldAis?.some((ai: any) => ai.aiId === aiId.toString())) || [];
      const newTools = tools?.filter((toolId) => !oldTools?.some((tool: any) => tool.toolId === toolId.toString())) || [];

      return await prisma.post.update({
        where: { id: id.toString() },
        data: {
          title: title || undefined,
          content: content || undefined,
          published: published || undefined,
          skills: !skills || skills.length === 0 ? undefined : {
            createMany: {
              data: newSkills.map((skillId) => ({ skillId: skillId.toString() })),
            }
          },
          ais: !ais || ais.length === 0 ? undefined : {
            createMany: {
              data: newAis.map((aiId) => ({ aiId: aiId.toString() })),
            }
          },
          tools: !tools || tools.length === 0 ? undefined : {
            createMany: {
              data: newTools.map((toolId) => ({ toolId: toolId.toString() })),
            }
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
    },
    resolve: async (_query, _parent, args, ctx, _info) => {
      const { user } = await ctx;
      if (!user) throw new Error("Not authenticated");

      const { id } = args;
      if (id === undefined) throw new Error("No id provided");

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if(!dbUser) throw new Error("User not found");

      const voteOnPost = await prisma.votesOnPosts.findFirst({
        where: { postId: id.toString(), userId: dbUser?.id },
      });

      if(voteOnPost) {
        return await prisma.post.update({
          where: { id: id.toString() },
          data: {
            votes: {
              deleteMany: {
                id: voteOnPost.id,
              }
            }
          },
          include: {
            _count: { select: { votes: true } },
          }
        });
      }

      return await prisma.post.update({
        where: { id: id.toString() },
        data: {
          votes: {
            create: [{
              userId: dbUser?.id,
            }]
          }
        },
        include: {
          _count: { select: { votes: true } },
        }
      });
    }
  })
);