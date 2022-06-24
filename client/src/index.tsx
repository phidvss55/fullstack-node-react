import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import JWTManager from './utils/jwt';
import AuthContextProvider from './context/AuthContext';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
})

const authLink = setContext((_, { headers }) => {
  // const token = localStorage.getItem('token');
  const token = JWTManager.getToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
});

// create new request to server by apollo client
const client = new ApolloClient({
  // uri: 'http://localhost:4000/graphql',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
}) 

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // wrap the root element with ApolloProvider
  <ApolloProvider client={client}>
    <AuthContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AuthContextProvider>
  </ApolloProvider>
);
