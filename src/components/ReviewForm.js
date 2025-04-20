import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitReview } from '../actions/movieActions';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { BsStarFill, BsStar } from 'react-icons/bs';

const ReviewForm = ({ movieId }) => {
    const dispatch = useDispatch();
    const selectedMovie = useSelector(state => state.movie.selectedMovie);
    const loggedIn = useSelector(state => state.auth.loggedIn);
    const reviewSaved = useSelector(state => state.movie.reviewSaved);
    
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(5);
    const [errorMessage, setErrorMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    
    useEffect(() => {
        // Reset form when a new movie is selected
        if (selectedMovie && selectedMovie._id) {
            setReview('');
            setRating(5);
            setErrorMessage('');
            setSubmitted(false);
        }
    }, [selectedMovie]);
    
    useEffect(() => {
        // Show success message when review is saved
        if (reviewSaved) {
            setReview('');
            setRating(5);
            setSubmitted(true);
            
            // Clear success message after 3 seconds
            const timer = setTimeout(() => {
                setSubmitted(false);
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [reviewSaved]);
    
    const handleReviewChange = (e) => {
        setReview(e.target.value);
    };
    
    const handleRatingChange = (e) => {
        setRating(parseInt(e.target.value));
    };
    
    const renderStars = () => {
        let stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars.push(<BsStarFill key={i} />);
            } else {
                stars.push(<BsStar key={i} />);
            }
        }
        return stars;
    };
    
    const handleSubmitReview = () => {
        if (!review.trim()) {
            setErrorMessage('Please enter a review comment');
            return;
        }
        
        if (!selectedMovie) {
            setErrorMessage('No movie selected');
            return;
        }
        
        const reviewData = {
            movieId: selectedMovie._id,
            review: review,
            rating: rating
        };
        
        dispatch(submitReview(reviewData));
    };
    
    return (
        <Card>
            <Card.Header>Submit Your Review</Card.Header>
            <Card.Body>
                {errorMessage && 
                    <Alert variant="danger">{errorMessage}</Alert>
                }
                
                {submitted && 
                    <Alert variant="success">Your review has been submitted!</Alert>
                }
                
                <Form>
                    <Form.Group controlId="reviewText">
                        <Form.Label>Your Review</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            value={review}
                            onChange={handleReviewChange}
                            placeholder="Share your thoughts about this movie..."
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="rating" className="mt-3">
                        <Form.Label>
                            Rating: {rating} stars {' '}
                            {renderStars()}
                        </Form.Label>
                        <Form.Control 
                            type="range" 
                            min="0" 
                            max="5" 
                            step="1"
                            value={rating}
                            onChange={handleRatingChange}
                        />
                    </Form.Group>
                    
                    <Button 
                        variant="primary" 
                        onClick={handleSubmitReview}
                        className="mt-3"
                        disabled={!loggedIn || !selectedMovie}
                    >
                        Submit Review
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ReviewForm;