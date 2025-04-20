import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../actions/authActions";
import { BsFilm, BsSearch, BsInfoCircle, BsPerson } from 'react-icons/bs';
import { Link } from 'react-router-dom'; // Import Link directly

const MovieHeader = () => {
    const dispatch = useDispatch();
    const loggedIn = useSelector(state => state.auth.loggedIn);
    const username = useSelector(state => state.auth.username);
    const selectedMovie = useSelector(state => state.movie.selectedMovie);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container>
                {/* ... Navbar.Brand ... */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Use Nav.Link with 'as={Link}' */}
                        <Nav.Link
                            as={Link}
                            to="/movielist"
                            disabled={!loggedIn}
                            className="nav-link" // Add Bootstrap class if needed
                             style={loggedIn ? {} : { pointerEvents: 'none', color: 'rgba(255, 255, 255, 0.55)' }} // Manual disable styling
                        >
                            <BsFilm className="me-1" /> Movies
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/search"
                            disabled={!loggedIn}
                            className="nav-link"
                             style={loggedIn ? {} : { pointerEvents: 'none', color: 'rgba(255, 255, 255, 0.55)' }}
                        >
                            <BsSearch className="me-1" /> Search
                        </Nav.Link>

                        {selectedMovie && (
                             <Nav.Link
                                as={Link}
                                to={'/movie/' + selectedMovie._id}
                                disabled={!loggedIn}
                                className="nav-link"
                                 style={loggedIn ? {} : { pointerEvents: 'none', color: 'rgba(255, 255, 255, 0.55)' }}
                            >
                                <BsInfoCircle className="me-1" /> Movie Detail
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                         {/* Login/Logout link needs careful handling */}
                         {/* If logged out, it's a link to /signin */}
                         {!loggedIn && (
                             <Nav.Link as={Link} to="/signin" className="nav-link">
                                 <BsPerson className="me-1" /> Login / Register
                             </Nav.Link>
                         )}
                         {/* If logged in, it's not really a link, just displays info and a button */}
                         {loggedIn && (
                            <Nav.Link as="span"> {/* Use span or div if not a link */}
                                <span>
                                    <BsPerson className="me-1" /> {username} {' '}
                                    <button className="btn btn-sm btn-outline-light ms-2" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </span>
                            </Nav.Link>
                         )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MovieHeader;