import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token"); // get authentication token from local storage
  return {
    // return headers to context so httpLink can read
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // Set up client to execute `authLink` middleware before making request to GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}> // wrap entire app in ApolloProvider component and pass in client as a prop to make it available to all components
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={SearchBooks} />
            <Route exact path="/saved" component={SavedBooks} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
