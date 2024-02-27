import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultView from './views/resultView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
// import 'core-js/stable';
// import { async } from 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const getRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    resultView.update(model.loadSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    searchView.toggleWindow(false);
    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controlSearchResults = async parent => {
  try {
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    parent.classList.remove('search-open');
    model.state.isSearchOpen = false;
    resultView.render(model.loadSearchResultsPage(1));
    paginationView.render(model.state.search);
  } catch (err) {}
};

const controlPagination = goto => {
  resultView.render(model.loadSearchResultsPage(goto));
  paginationView.render(model.state.search);
};

const controlServings = serving => {
  model.updateServings(serving);

  recipeView.update(model.state.recipe);
};

const controlBookmark = () => {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlLoadBookmarks = () => {
  model.loadBookmarks();
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async recipe => {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(recipe);

    bookmarksView.render(model.state.bookmarks);

    addRecipeView.renderMessage();

    window.location.hash = model.state.recipe.id;
  } catch (err) {
    addRecipeView.renderError(err);
  }
};

const controlSearch = (parent, button) => {
  if (!model.state.isSearchOpen) {
    let actionEvent;
    model.state.isSearchOpen = true;
    document.removeEventListener('click', actionEvent);
    parent.classList.add('search-open');
    console.log(model.state.isSearchOpen);
    actionEvent = e => {
      if (
        !e.target.closest('.search') &&
        !e.target.closest('.nav .search__btn')
      ) {
        model.state.isSearchOpen = false;
        console.log(model.state.isSearchOpen);
        parent.classList.remove('search-open');
        document.removeEventListener('click', actionEvent);
      }
    };
    document.addEventListener('click', actionEvent);
  }
};

const init = () => {
  recipeView.addHandlerRender(getRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  bookmarksView.addHandlerRender(controlLoadBookmarks);
  searchView.addSearchHandler(controlSearchResults);
  searchView.addSearchButtonHandler(controlSearch);
  paginationView.addPaginationHandler(controlPagination);
  addRecipeView.addHandlerSubmit(controlAddRecipe);
  console.log('Welcome to Forkify!');
};
init();
