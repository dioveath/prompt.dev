import { gql, useMutation, useQuery } from "@apollo/client";
import { GetServerSideProps } from "next";
import Link from "next/link";

import Navbar from "@/components/globals/navbar";
import { Avatar, Button, CardMedia, Chip, Container, Grid } from "@mui/material";
import { VscLinkExternal } from "react-icons/vsc";

import SuperJSON from "superjson";
import { ToolExtended } from ".";
import Image from "next/image";
import { isValidID } from "@/helpers/isValidID";
import { toast } from "react-hot-toast";
import { useUser } from "@auth0/nextjs-auth0/client";
import ClaimToolDialog from "@/sections/tools/claimtooldialog";
import { useState } from "react";
import SEOHead from "@/components/seo";
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from "react-share";
import Footer from "@/sections/footer";

const meQuery = gql`
  query {
    me {
      email
      name
      jobTitle
      email
      createdAt
      avatar
    }
  }
`;

const toolQuery = gql`
  query ($id: ID!) {
    tool(id: $id) {
      id
      title
      website
      avatar
      shortDescription
      description
      meUses
      category {
        id
        title
      }
      ais {
        id
        ai {
          id
          title
          avatar
        }
      }
      skills {
        id
        skill {
          title
          avatar
        }
      }
      toolAuthors {
        id
        author {
          id
          name
          avatar
        }
      }
      toolUsers {
        id
        user {
          id
          name
          avatar
        }
      }
      reviews {
        id
        content
        rating
        user {
          id
          name
          avatar
        }
      }
    }
  }
`;

const updateMeOnToolUsersMutation = gql`
  mutation ($id: ID!) {
    updateMeOnToolUsers(id: $id) {
      id
      title
      meUses
      toolUsers {
        id
        user {
          id
          name
          avatar
        }
      }
    }
  }
`;

type ToolProps = {
  tool: string;
};

const URL = "https://www.prompters.dev";

export default function ToolPage({ tool: toolJSON }: ToolProps) {
  const tool = SuperJSON.parse<ToolExtended>(toolJSON);
  const { id, title, website, avatar, shortDescription, description, toolAuthors } = tool;
  const { data, loading, error } = useQuery(toolQuery, { variables: { id: id } });
  const [updateMeOnToolUsers, { data: mutatedData, loading: mutateLoading, error: mutateError }] = useMutation(updateMeOnToolUsersMutation);
  const { user, error: userError, isLoading: userLoading } = useUser();

  const [claimDialogOpen, setClaimDialogOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { meUses, toolUsers } = data.tool;

  const onToggleUseTool = async () => {
    try {
      await toast.promise(updateMeOnToolUsers({ variables: { id: id } }), {
        loading: "Updating...",
        success: "Updated!",
        error: "Error updating",
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <SEOHead title={title} currentUrl={website} description={shortDescription || ""} image={avatar || "assets/artificial-intelligence.png"}/>
      <Navbar path="/tools" />
      <Container>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6}>
            <div className="text-4xl font-semibold my-5"> {title} </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-2">
                <Link href={website} target="_blank" className="flex items-center gap-2 font-bold">
                  <VscLinkExternal /> Visit now
                </Link>
                <div className="text-lg font-medium"> {shortDescription} </div>
                <div className="text-md"> {description} </div>
              </div>
            </div>
          </Grid>

          <Grid item sm={12} md={6} className="w-full">
            <div className="w-full flex justify-center items-center bg-gray-200/50">
              <CardMedia component="img" height="200" width="300" image={avatar || "/assets/artificial-intelligence.png"} alt="Tool Avatar" sx={{ objectFit: "cover" }} />
            </div>

            <div className="text-lg font-semibold mt-2 mb-1"> Category </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                {data.tool.category?.map((category: any) => {
                  return <Chip key={category.id} label={category.title} variant="outlined" color="primary" size="small" />;
                })}
              </div>
            </div>

            <div className="text-lg font-semibold mt-2 mb-1"> AIs </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                {data.tool.ais?.map((aisOnTools: any) => {
                  const ai = aisOnTools.ai;
                  return <Chip key={ai.id} label={ai.title} variant="outlined" color="primary" size="small" />;
                })}
              </div>
            </div>

            <div className="text-lg font-semibold mt-2 mb-1"> Skills </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                {data.tool.skills?.map((skillsOnTools: any) => {
                  const skill = skillsOnTools.skill;
                  return <Chip key={skill.id} label={skill.title} variant="outlined" color="primary" size="small" />;
                })}
              </div>
            </div>

            <div className="text-lg font-semibold mt-2 mb-1"> Authors </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                {toolAuthors.map((usersOnTools: any) => {
                  const author = usersOnTools.author;
                  return (
                    <div key={author.id} className="text-xs font-bold">
                      <Avatar src={author.avatar} alt={`${author.name} Profile`} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-lg font-semibold mt-2 mb-1"> Users </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                {toolUsers?.map((usersOnTools: any) => {
                  const user = usersOnTools.user;
                  return (
                    <div key={user.id} className="text-xs font-bold">
                      <Avatar src={user.avatar} alt={`${user.name} Profile`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </Grid>
        </Grid>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="meToolUse" className="mr-2"> Are you using this tool? </label>
            { !user && <Button href="/api/auth/login" variant="outlined"> Yes </Button> }
            { user && <Button onClick={onToggleUseTool}> {meUses ? "You're using this tool, Stop Using" : "Yes"} </Button> }
          </div>
          <div>
            { !toolAuthors.length && !user && <Button href="/api/auth/login" variant="contained">Sign In to Claim your tool</Button> }
            { !toolAuthors.length && user && <Button onClick={() => setClaimDialogOpen(true)} variant="contained">Claim Your Tool</Button> }
            <ClaimToolDialog open={claimDialogOpen} setOpen={setClaimDialogOpen} tool={tool}/>
          </div>

          <div>
            <FacebookShareButton url={`${URL}/tools/${id}`} quote={title} hashtag={`#${title}`}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={`${URL}/tools/${id}`} title={title} hashtags={[`#${title}`]}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>            
          </div>

          <div>
            <Button href="/tools" variant="outlined"> Back to Tools </Button>
          </div>
        </div>
      </Container>
      <Footer/>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const id: string | undefined = params?.id?.toString();

  if (!isValidID(id))
    return {
      notFound: true,
    };

  const tool = await prisma.tool.findUnique({
    where: {
      id: id,
    },
    include: {
      toolAuthors: {
        include: {
          author: true,
        },
      },
      toolUsers: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!tool)
    return {
      notFound: true,
    };

  await prisma.tool.update({
    where: { id: id },
    data: {
      views: { increment: 1 },
    },
  });

  return {
    props: {
      tool: SuperJSON.stringify(tool),
    },
  };
};
