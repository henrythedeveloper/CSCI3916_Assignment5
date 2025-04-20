import actionTypes from '../constants/actionTypes';
const env = process.env;

// Action creators
function moviesFetched(movies) {
    return {
        type: actionTypes.FETCH_MOVIES,
        movies: movies
    }
}

function movieFetched(movie) {
    return {
        type: actionTypes.FETCH_MOVIE,
        selectedMovie: movie
    }
}

function movieSet(movie) {
    return {
        type: actionTypes.SET_MOVIE,
        selectedMovie: movie
    }
}

function reviewSaved() {
    return {
        type: actionTypes.REVIEW_SAVED
    }
}

function fetchMovieBegin() {
    return {
        type: actionTypes.FETCH_MOVIE_BEGIN
    }
}

function fetchMovieError(error) {
    return {
        type: actionTypes.FETCH_MOVIE_ERROR,
        error: error
    }
}

// Action functions
export function setMovie(movie) {
    return dispatch => {
        dispatch(movieSet(movie));
    }
}

export function fetchMovie(movieId) {
    return dispatch => {
        dispatch(fetchMovieBegin());
        
        return fetch(`${env.REACT_APP_API_URL}/movies/${movieId}?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            dispatch(movieFetched(res));
        }).catch((error) => {
            dispatch(fetchMovieError(error.message));
            console.log(error);
        });
    }
}

export function fetchMovies() {
    return dispatch => {
        dispatch(fetchMovieBegin());
        
        return fetch(`${env.REACT_APP_API_URL}/movies?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            dispatch(moviesFetched(res));
        }).catch((error) => {
            dispatch(fetchMovieError(error.message));
            console.log(error);
        });
    }
}

export function submitReview(review) {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(review),
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()
        }).then((res) => {
            dispatch(reviewSaved());
            // Fetch the movie again to get updated reviews
            dispatch(fetchMovie(review.movieId));
        }).catch((error) => {
            console.log(error);
        });
    }
}