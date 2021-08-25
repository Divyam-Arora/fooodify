import { API_URL } from './config';
import { ajax } from './helpers';
import { RES_PER_PAGE } from './config';
import { KEY } from './config';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const getRecipeObject = data => {
  const { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async id => {
  try {
    const data = await ajax(`${API_URL}${id}?key=${KEY}`);

    state.recipe = getRecipeObject(data);

    state.recipe.bookmarked = state.bookmarks.some(
      recipe => recipe.id === state.recipe.id
    )
      ? true
      : false;
  } catch (err) {
    throw new Error(err);
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;
    const data = await ajax(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        imageUrl: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const loadSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;

  return state.search.results.slice(start, end);
};

export const updateServings = serving => {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * serving) / state.recipe.servings;
  });

  state.recipe.servings = serving;
};

export const addBookmark = recipe => {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  storeBookmarks();
};

export const removeBookmark = id => {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);

  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  storeBookmarks();
};

export const storeBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const loadBookmarks = () => {
  state.bookmarks = JSON.parse(localStorage.getItem('bookmarks') ?? '[]');
};

export const uploadRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        entry => entry[0].startsWith('ingredient') && entry[1].trim().length > 0
      )
      .map(entry => {
        const ingArr = entry[1].split(',').map(ing => ing.trim());

        if (ingArr.length !== 3) {
          throw new Error('Wrong Format Input');
        }

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
    };

    const data = await ajax(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = getRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
