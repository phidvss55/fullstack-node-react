import jwtDecode, { JwtPayload } from "jwt-decode";

const JWTManager = () => {
  const LOGOUT_EVENT_NAME = 'jwt-logout';
  let inMemoryToken: string | null = null;
  let refreshTokenTimeoutId: number | null = null;
  let userId: number | null = null;

  const getToken = () => inMemoryToken;

  const setToken = (accessToken: string) => {
    inMemoryToken = accessToken;
    // Decode and set countdown to refresh
    const decoded = jwtDecode<JwtPayload & { userId: number }>(accessToken);
    // Parse to number
    setRefreshTokenTimeout((decoded.exp as number) - (decoded.iat as number))

    userId = decoded.userId;
    
    return true;
  }

  const getUserId = () => userId;

  const abortRefreshToken = () => {
    if (refreshTokenTimeoutId) window.clearTimeout(refreshTokenTimeoutId);
  }

  const clearToken = () => {
    inMemoryToken = null;
    abortRefreshToken();
    window.localStorage.setItem(LOGOUT_EVENT_NAME, Date.now().toString())

    return true;
  }

  // To logout all tabs (nullify inmemorytoken)
  window.addEventListener('storage', event => {
    if (event.key === LOGOUT_EVENT_NAME) {
      inMemoryToken = null;
    }
  })

  const getRefreshToken = async () => {
    try {
      const res = await fetch('http://localhost:4000/refresh-token', {
        credentials: 'include',
      });
      const data = (await res.json()) as { success: boolean, accessToken: string };
      setToken(data.accessToken)

      return true;
    } catch (error) {
      console.log('UNAUTHENTICATED', error)
      clearToken();

      return false
    }
    
  }

  const setRefreshTokenTimeout = (seconds: number) => {
    refreshTokenTimeoutId = window.setTimeout(getRefreshToken, seconds * 1000 - 5000);
  }

  return { getToken, setToken, clearToken, getRefreshToken, getUserId };
}

export default JWTManager();