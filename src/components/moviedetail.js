import React, { useEffect } from 'react';
import { fetchMovie } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Row, Col, Container, Table } from 'react-bootstrap';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ReviewForm from './ReviewForm';

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams();
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading);
  const error = useSelector(state => state.movie.error);

  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  // Generate star rating display
  const renderStars = (rating) => {
    let stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 0; i < 5; i++) {
      if (i < roundedRating) {
        stars.push(<BsStarFill key={i} />);
      } else {
        stars.push(<BsStar key={i} />);
      }
    }
    return stars;
  };

  const DetailInfo = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (error) {
      return <div>Error: {error}</div>;
    }
    
    if (!selectedMovie) {
      return <div>No movie data available.</div>;
    }

    return (
      <Container>
        <Row>
          <Col md={8}>
            <Card className="bg-dark text-dark p-4 rounded">
              <Card.Header>Movie Detail</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Image 
                      className="img-fluid" 
                      src={selectedMovie.imageUrl || 'https://via.placeholder.com/300x450'} 
                      alt={selectedMovie.title}
                      thumbnail
                    />
                  </Col>
                  <Col md={8}>
                    <ListGroup>
                      <ListGroupItem>
                        <h3>{selectedMovie.title}</h3>
                      </ListGroupItem>
                      <ListGroupItem>
                        <strong>Release Date:</strong> {selectedMovie.releaseDate}
                      </ListGroupItem>
                      <ListGroupItem>
                        <strong>Genre:</strong> {selectedMovie.genre}
                      </ListGroupItem>
                      <ListGroupItem>
                        <strong>Average Rating:</strong> {' '}
                        {renderStars(selectedMovie.avgRating || 0)} ({selectedMovie.avgRating ? selectedMovie.avgRating.toFixed(1) : '0.0'})
                      </ListGroupItem>
                      <ListGroupItem>
                        <strong>Cast:</strong>
                        <ul className="list-unstyled">
                          {selectedMovie.actors && selectedMovie.actors.map((actor, i) => (
                            <li key={i}>
                              <strong>{actor.actorName}</strong> as {actor.characterName}
                            </li>
                          ))}
                        </ul>
                      </ListGroupItem>
                    </ListGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            <Card className="mt-4">
              <Card.Header>Reviews</Card.Header>
              <Card.Body>
                {selectedMovie.reviews && selectedMovie.reviews.length > 0 ? (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Review</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMovie.reviews.map((review, i) => (
                        <tr key={i}>
                          <td>{review.username}</td>
                          <td>{review.review}</td>
                          <td>
                            {renderStars(review.rating)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No reviews yet. Be the first to review!</p>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <ReviewForm movieId={movieId} />
          </Col>
        </Row>
      </Container>
    );
  };

  return <DetailInfo />;
};

export default MovieDetail;