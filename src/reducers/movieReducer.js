import constants from '../constants/actionTypes'

let initialState = {
    movies: [],
    selectedMovie: null,
    reviewSaved: false,
    loading: false,
    error: null,
    searchResults: [],
    searching: false,
    searchError: null
}

const movieReducer = (state = initialState, action) => {
    let updated = Object.assign({}, state);

    switch(action.type) {
        case constants.FETCH_MOVIE_BEGIN:
            updated.loading = true;
            updated.error = null;
            return updated;
            
        case constants.FETCH_MOVIES:
            updated.movies = action.movies;
            updated.loading = false;
            if (action.movies.length > 0) {
                updated.selectedMovie = action.movies[0];
            }
            return updated;
            
        case constants.SET_MOVIE:
            updated.selectedMovie = action.selectedMovie;
            updated.loading = false;
            return updated;
            
        case constants.FETCH_MOVIE:
            updated.selectedMovie = action.selectedMovie;
            updated.loading = false;
            updated.reviewSaved = false;
            return updated;
            
        case constants.FETCH_MOVIE_ERROR:
            updated.loading = false;
            updated.error = action.error;
            return updated;
            
        case constants.REVIEW_SAVED:
            updated.reviewSaved = true;
            return updated;
            
        // Search actions
        case constants.SEARCH_MOVIES_BEGIN:
            updated.searching = true;
            updated.searchError = null;
            return updated;
            
        case constants.SEARCH_MOVIES_SUCCESS:
            updated.searchResults = action.searchResults;
            updated.searching = false;
            return updated;
            
        case constants.SEARCH_MOVIES_ERROR:
            updated.searching = false;
            updated.searchError = action.error;
            return updated;
            
        default:
            return state;
    }
}

export default movieReducer;