
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import App from './App';

const client = new ApolloClient({
  uri: 'https://countries.trevorblades.com/graphql', // GraphQL endpoint
  cache: new InMemoryCache(),
});

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
} else {
  console.error("Element with id 'root' not found in the DOM.");
}


