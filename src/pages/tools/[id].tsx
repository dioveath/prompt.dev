import Button from "@/ui/button";
import Container from "@/ui/container";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GetServerSideProps } from "next";
import Link from "next/link";

import SuperJSON from "superjson";
import { ToolExtended } from ".";
import Image from "next/image";
import { isValidID } from "@/helpers/isValidID";
import { toast } from "react-hot-toast";

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
  query($id: ID!) {
    tool(id: $id) {
      id
      title
      website
      avatar
      shortDescription
      description
      meUses
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
  mutation($id: ID!) {
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
}

export default function ToolPage({ tool }: ToolProps) {
  const { id, title, website, avatar, shortDescription, description, toolAuthors } = SuperJSON.parse<ToolExtended>(tool);  
  const { data, loading, error } = useQuery(toolQuery, { variables: { id: id } });
  const [updateMeOnToolUsers, { data: mutatedData, loading: mutateLoading, error: mutateError}] = useMutation(updateMeOnToolUsersMutation);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { meUses, toolUsers } = data.tool;

  const onToggleUseTool = async () => {
    try {
      await toast.promise(updateMeOnToolUsers({ variables: { id: id }}), 
        {
          loading: "Updating...",
          success: "Updated!",
          error: "Error updating",
        });
    } catch(e){
      console.log(e);
    }
  };

  return (
    <Container>
      <div>
        <h1 className="font-bold text-lg"> {title}</h1>
        <p className="text-md">{website}</p>
        <p className="text-md">{avatar}</p>
        <p className="text-md">{shortDescription}</p>
        <p className="text-md">{description}</p>

        <h2 className="font-semibold text-lg"> Authors </h2>
        <ul className="flex gap-2">
          { toolAuthors.map((usersOnTools: any) => {
            const author = usersOnTools.author;
            return (
              <li key={author.id} className="text-xs font-bold">
                <div className="w-10 h-10 overflow-clip rounded-full">
                  <Image src={author.avatar} alt={`${author.name} Profile`} width={200} height={200}/>
                </div>              
              </li>
            );
          })}     
        </ul>

        <h2 className="font-semibold text-lg">Users</h2>
        <ul className="flex gap-2">
          { toolUsers?.map((usersOnTools: any) => {
            const user = usersOnTools.user;
            return (
              <li key={user.id} className="text-xs font-bold">
                <div className="w-10 h-10 overflow-clip rounded-full">
                  <Image src={user.avatar} alt={`${user.name} Profile`} width={200} height={200}/>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <div>
          <label htmlFor="meToolUse"> Are you using this tool? </label>
          <Button onClick={onToggleUseTool}> { meUses ? "You're using this tool" : "Yes" } </Button>
        </div>
      </div>

    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params } = context;
    const id: string | undefined = params?.id?.toString();

    if(!isValidID(id))
        return {
            notFound: true,
        }

    const tool = await prisma.tool.findUnique({
        where: {
            id: id,
        },
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
            }
        },
    });

    if(!tool) 
        return {
            notFound: true,
        }

    return {
        props: {
            tool: SuperJSON.stringify(tool),
        }
    };

}
