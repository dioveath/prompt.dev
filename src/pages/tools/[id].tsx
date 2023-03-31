import Button from "@/ui/button";
import Container from "@/ui/container";
import { gql, useQuery } from "@apollo/client";
import { GetServerSideProps } from "next";
import Link from "next/link";

import SuperJSON from "superjson";
import { ToolExtended } from ".";
import Image from "next/image";
import { isValidID } from "@/helpers/isValidID";

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

type ToolProps = {
    tool: string;
}

export default function ToolPage({ tool }: ToolProps) {
  const { data, loading, error } = useQuery(meQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { title, website, avatar, shortDescription, description, toolAuthors, toolUsers } = SuperJSON.parse<ToolExtended>(tool);

  return (
    <Container>
      <div>
        <h1 className="font-bold text-lg"> {title}</h1>
        <p className="text-md">{website}</p>
        <p className="text-md">{avatar}</p>
        <p className="text-md">{shortDescription}</p>
        <p className="text-md">{description}</p>
        <ul className="">
          { toolAuthors.map((usersOnTools: any) => {
            const author = usersOnTools.user;
            return (
              <li key={author.id} className="text-xs font-bold">
                {author.name}
              </li>
            );
          })}     
        </ul>

        <h2 className="font-semibold text-lg">Users</h2>
        <ul className="flex gap-2">
          { toolUsers.map((usersOnTools: any) => {
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
                user: true
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
