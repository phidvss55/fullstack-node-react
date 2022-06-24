import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useLoginMutation } from "../generated/graphql";
import JWTManager from '../utils/jwt';

function Login() {
  const {setIsAuthenticated} = useAuthContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [login, _] = useLoginMutation();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await login({ variables: { loginInput: { username, password } } });
    if (res.data?.login.success) {
      JWTManager.setToken(res.data.login.accessToken as string);
      setIsAuthenticated(true);
      navigate("/");
    } else {
      setError(res.data?.login.message || 'Invalid username or password');
    }
  }
  
  return (
    <div>
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      <form style={{marginTop: '1rem'}} onSubmit={onSubmit}>
        <div>
          <label htmlFor="">Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="">Password</label>
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login