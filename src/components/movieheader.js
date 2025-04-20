import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../actions/authActions";
import { BsFilm, BsSearch, BsInfoCircle, BsPerson } from 'react-icons/bs';

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
                <Navbar.Brand>
                    <BsFilm className="me-2" /> Movie Review App
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/movielist">
                            <Nav.Link disabled={!loggedIn}>
                                <BsFilm className="me-1" /> Movies
                            </Nav.Link>
                        </LinkContainer>
                        
                        <LinkContainer to="/search">
                            <Nav.Link disabled={!loggedIn}>
                                <BsSearch className="me-1" /> Search
                            </Nav.Link>
                        </LinkContainer>
                        
                        {selectedMovie && (
                            <LinkContainer to={'/movie/' + selectedMovie._id}>
                                <Nav.Link disabled={!loggedIn}>
                                    <BsInfoCircle className="me-1" /> Movie Detail
                                </Nav.Link>
                            </LinkContainer>
                        )}
                    </Nav>
                    <Nav>
                        <LinkContainer to="/signin">
                            <Nav.Link>
                                {loggedIn ? (
                                    <span>
                                        <BsPerson className="me-1" /> {username} {' '}
                                        <button className="btn btn-sm btn-outline-light ms-2" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </span>
                                ) : (
                                    <span>
                                        <BsPerson className="me-1" /> Login / Register
                                    </span>
                                )}
                            </Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MovieHeader;