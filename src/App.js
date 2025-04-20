import React from 'react';
import './App.css';
import MovieHeader from './components/movieheader';
import MovieList from './components/movielist';
import Movie from './components/movie';
import MovieSearch from './components/MovieSearch';
import Authentication from './components/authentication';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './stores/store';
import { Container } from 'react-bootstrap';

// Route guard for protected routes (v6 version)
// It now accepts children and returns JSX directly
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  // Get the current location to redirect back after login
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /signin page, but save the current location they were
    // trying to go to in the state. This allows us to send them back after login.
    // Use 'replace' to avoid adding the redirected route to history
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  // If authenticated, render the child component passed to it
  return children;
};

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <HashRouter>
          <div>
            <MovieHeader />
            <Container className="mt-4">
              {/* Replace Switch with Routes */}
              <Routes>
                {/* Use element prop instead of component/render */}
                {/* Wrap protected components with the ProtectedRoute component */}

                {/* Public route / Default route - careful with logic here */}
                {/* If '/' should also be protected, wrap it too. If it's a public landing */}
                {/* page before login, it might be different. Assuming '/' is protected like /movielist */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MovieList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/movielist"
                    element={
                        <ProtectedRoute>
                            <MovieList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/movie/:movieId"
                    element={
                        <ProtectedRoute>
                            <Movie />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/search"
                    element={
                        <ProtectedRoute>
                            <MovieSearch />
                        </ProtectedRoute>
                    }
                />
                {/* Public route */}
                <Route path="/signin" element={<Authentication />} />

                {/* Optional: Add a catch-all route for 404 Not Found */}
                <Route path="*" element={<Navigate to="/" replace />} /> {/* Or a dedicated 404 component */}

              </Routes>
            </Container>
          </div>
        </HashRouter>
      </Provider>
    </div>
  );
}

export default App;