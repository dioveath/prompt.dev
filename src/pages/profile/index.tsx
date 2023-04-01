import Button from "@/ui/button";
import Container from "@/ui/container";
import { gql, useQuery } from "@apollo/client";
import { Post } from "@prisma/client";
import Link from "next/link";

const meQuery = gql`
  query {
    me {
      email
      name
      jobTitle
      email
      createdAt
      avatar
      posts {
        id
        title
        votesCount
      }
    }
  }
`;

export default function Profile() {
  const { data, loading, error } = useQuery(meQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container>
      <div>
        <h1 className="font-bold text-lg">Profile</h1>
        <p className="text-md font-semibold">{data.me.name}</p>
        <p>{data.me.jobTitle}</p>
        <p>{data.me.email}</p>
      </div>

      <div>
        <h1 className="font-bold text-lg">Posts</h1>
        {data.me.posts.map((post: Post & { votesCount: number }) => (
          <div key={post.id} className="max-w-md w-full shadow-xl rounded-md my-4 px-4">
            <Link href={`/posts/mutate/${post.id}`} className="">
              <p className="text-lg">{post.title}</p>
              <p className="text-sm">{post.votesCount} votes</p>
            </Link>
          </div>
        ))}
      </div>    

      <Link href="/posts/create">
        <Button> Create new Post </Button>
      </Link>
    </Container>
  );
}