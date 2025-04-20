import React from 'react';
import './App.css';
import MovieHeader from './components/movieheader';
import MovieList from './components/movielist';
import Movie from './components/movie';
import MovieSearch from './components/MovieSearch';
import Authentication from './components/authentication';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './stores/store';
import { Container } from 'react-bootstrap';

// Route guard for protected routes
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
        )
      }
    />
  );
};

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <HashRouter>
          <div>
            <MovieHeader />
            <Container className="mt-4">
              <Switch>
                <Route exact path="/" component={MovieList} />
                <ProtectedRoute exact path="/movielist" component={MovieList} />
                <ProtectedRoute exact path="/movie/:movieId" component={Movie} />
                <ProtectedRoute exact path="/search" component={MovieSearch} />
                <Route path="/signin" component={Authentication} />
              </Switch>
            </Container>
          </div>
        </HashRouter>
      </Provider>
    </div>
  );
}

export default App;