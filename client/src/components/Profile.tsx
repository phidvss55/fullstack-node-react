import { useHelloQuery } from "../generated/graphql"

function Profile() {
  const { data, error, loading } = useHelloQuery({ fetchPolicy: 'no-cache' });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <div>
      <h3>{data?.hello} </h3>
    </div>
  )
}

export default Profile