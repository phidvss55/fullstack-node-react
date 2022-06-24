import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../generated/graphql";

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [register, _] = useRegisterMutation();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await register({ variables: { registerInput: {username, password} } });
    navigate("/");
  }

  return (
    <div>
      <form style={{marginTop: '1rem'}} onSubmit={onSubmit}>
        <div>
          <label htmlFor="">Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="">Password</label>
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register