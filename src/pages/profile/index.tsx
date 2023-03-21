import Button from "@/ui/button";
import Container from "@/ui/container";
import { gql, useQuery } from "@apollo/client";
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

      <Link href="/posts/create">
        <Button> Create new Post </Button>
      </Link>
    </Container>
  );
}
