import { useUsersQuery } from "../generated/graphql";

function Home() {
  const {data, loading} = useUsersQuery({ fetchPolicy: "no-cache" });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {data!.users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  )
}

export default Home