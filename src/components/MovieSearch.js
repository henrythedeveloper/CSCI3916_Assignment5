import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies, setMovie } from '../actions/movieActions';
import { Form, Button, Card, ListGroup, Row, Col, Accordion, Spinner, Alert } from 'react-bootstrap';
import { BsStarFill, BsStar, BsSearch } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';

const MovieSearch = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchResults = useSelector(state => state.movie.searchResults);
    const searching = useSelector(state => state.movie.searching);
    const searchError = useSelector(state => state.movie.searchError);
    const loggedIn = useSelector(state => state.auth.loggedIn);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'accordion'
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setHasSearched(true);
            dispatch(searchMovies(searchTerm));
        }
    };
    
    const handleMovieSelect = (movie) => {
        dispatch(setMovie(movie));
        navigate(`/movie/${movie._id}`);
    };
    
    // Generate star rating display
    const renderStars = (rating) => {
        let stars = [];
        const roundedRating = Math.round(rating || 0);
        for (let i = 0; i < 5; i++) {
            if (i < roundedRating) {
                stars.push(<BsStarFill key={i} className="text-warning" />);
            } else {
                stars.push(<BsStar key={i} />);
            }
        }
        return stars;
    };
    
    // Grid view of search results
    const GridView = () => (
        <Row>
            {searchResults.map(movie => (
                <Col key={movie._id} md={4} className="mb-4">
                    <Card>
                        <Card.Img 
                            variant="top" 
                            src={movie.imageUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
                            alt={movie.title}
                            style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => handleMovieSelect(movie)}
                        />
                        <Card.Body>
                            <Card.Title>
                                <Link 
                                    to={`/movie/${movie._id}`}
                                    onClick={() => handleMovieSelect(movie)}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {movie.title}
                                </Link>
                            </Card.Title>
                            <Card.Text>
                                <div>{movie.releaseDate} • {movie.genre}</div>
                                <div>
                                    {renderStars(movie.avgRating)} {' '}
                                    ({movie.avgRating ? movie.avgRating.toFixed(1) : '0.0'})
                                </div>
                                <div className="mt-2">
                                    <small>
                                        <strong>Cast:</strong> {movie.actors && movie.actors.map(actor => actor.actorName).join(', ')}
                                    </small>
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
    
    // Accordion view of search results

    const AccordionView = () => (
        // Keep the main Accordion component
        <Accordion defaultActiveKey={searchResults.length > 0 ? "0" : null}> {/* Optionally only open first if results exist */}
            {searchResults.map((movie, index) => (
                <Accordion.Item key={movie._id} eventKey={index.toString()}>
                    <Accordion.Header>
                        {/* Use flex utilities for better control */}
                        <div className="d-flex align-items-center w-100">
                            {/* Image Container: Prevent shrinking */}
                            <div className="flex-shrink-0 me-3">
                                <Image
                                    src={movie.imageUrl || 'https://via.placeholder.com/80x120?text=No+Image'}
                                    alt={movie.title}
                                    style={{ width: '80px', height: '120px', objectFit: 'cover' }}
                                    rounded // Add rounded corners to the image
                                />
                            </div>
                            {/* Text Container: Allow growing */}
                            <div className="flex-grow-1">
                                {/* Bolder title */}
                                <h5 className="mb-1 fw-bold">{movie.title} <span className="fw-normal">({movie.releaseDate})</span></h5>
                                {/* Smaller rating text */}
                                <div>
                                    <small className="text-warning"> {/* Apply color directly to stars wrapper */}
                                        {renderStars(movie.avgRating)}
                                    </small>
                                    {' '}
                                    <small className="text-muted"> {/* Muted text for rating value */}
                                        ({movie.avgRating ? movie.avgRating.toFixed(1) : 'N/A'})
                                    </small>
                                </div>
                            </div>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body>
                        <Row>
                            {/* Left Column: Details */}
                            <Col md={8}>
                                <h6 className="text-muted">Genre:</h6>
                                <p className="mb-3">{movie.genre}</p> {/* Use paragraph for better spacing */}

                                <h6 className="text-muted">Cast:</h6>
                                {/* Remove bullet points and default padding */}
                                <ul className="list-unstyled ps-0 mb-3">
                                    {movie.actors && movie.actors.length > 0 ? movie.actors.map((actor, i) => (
                                        <li key={i} className="mb-1"> {/* Add small margin bottom to list items */}
                                            <strong>{actor.actorName}</strong> as {actor.characterName}
                                        </li>
                                    )) : (
                                        <li>No cast information available.</li>
                                    )}
                                </ul>

                                <h6 className="text-muted">Reviews:</h6>
                                <p>{movie.reviews ? movie.reviews.length : 0}</p>
                            </Col>

                            {/* Right Column: Button */}
                            <Col md={4} className="d-flex flex-column align-items-center justify-content-center mt-3 mt-md-0">
                                {/* Center button vertically and horizontally within the column */}
                                <Button
                                    variant="primary"
                                    onClick={() => handleMovieSelect(movie)}
                                    className="w-75" // Make button slightly less wide if desired
                                >
                                    View Details
                                </Button>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
    
    return (
        <div>
            <Card className="mb-4">
                <Card.Header>
                    <h4>Movie Search</h4>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSearch}>
                        <Row className="align-items-center">
                            <Col sm={8}>
                                <Form.Group className="mb-3" controlId="searchTerm">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by movie title or actor name"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Button variant="primary" type="submit" className="mb-3 w-100">
                                    <BsSearch className="me-2" /> Search
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    
                    <div className="d-flex justify-content-end mb-3">
                        <div className="btn-group">
                            <Button 
                                variant={viewMode === 'grid' ? 'primary' : 'outline-primary'} 
                                onClick={() => setViewMode('grid')}
                            >
                                Grid View
                            </Button>
                            <Button 
                                variant={viewMode === 'accordion' ? 'primary' : 'outline-primary'} 
                                onClick={() => setViewMode('accordion')}
                            >
                                Accordion View
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
            
            {searching && (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}
            
            {searchError && (
                <Alert variant="danger">
                    Error searching for movies: {searchError}
                </Alert>
            )}
            
            {hasSearched && !searching && searchResults.length === 0 && (
                <Alert variant="info">
                    No movies found matching "{searchTerm}"
                </Alert>
            )}
            
            {searchResults.length > 0 && (
                <Card>
                    <Card.Header>
                        <h4>Search Results ({searchResults.length} movies found)</h4>
                    </Card.Header>
                    <Card.Body>
                        {viewMode === 'grid' ? <GridView /> : <AccordionView />}
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default MovieSearch;