import { state } from '../model';

class SearchView {
  #parentElement = document.querySelector('.search');
  #searchButton = document.querySelector('.nav .search__btn');
  #searchWindow = document.querySelector('.search-results');
  #searchWindowButton = document.querySelector(
    '.search-results .search-window__btn'
  );

  constructor() {
    // super();
    this._addHandlerWindow();
  }

  _addHandlerWindow() {
    this.#searchWindowButton.addEventListener('click', e => {
      this.toggleWindow();
    });
  }

  getQuery() {
    const query = this.#parentElement.querySelector('.search__field').value;
    this.#clear();
    return query;
  }

  #clear() {
    this.#parentElement.querySelector('.search__field').value = '';
  }

  addSearchHandler(handler) {
    this.#parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler(this.#parentElement);
      this.toggleWindow(true);
    });
  }

  addSearchButtonHandler(handler) {
    this.#searchButton.addEventListener('click', e => {
      e.preventDefault();
      handler(this.#parentElement, this.#searchButton);
    });
  }

  addSearchWindowHandler(handler) {
    this.#searchWindowButton.addEventListener('click', e => {
      e.preventDefault();
      handler(this.#searchWindow, this.#searchWindowButton);
    });
  }

  toggleWindow(toOpen = null) {
    if (
      this.#searchWindowButton.classList.contains('search-window__btn-hide') &&
      state.search.query
    ) {
      this.#searchWindowButton.classList.remove('search-window__btn-hide');
    }
    if (toOpen == null) {
      if (state.search.query)
        this.#searchWindow.classList.toggle('search-results-open');
      document.body.classList.toggle('body--no-scroll');
    } else {
      if (toOpen) {
        this.#searchWindow.classList.add('search-results-open');
        document.body.classList.add('body--no-scroll');
      } else {
        this.#searchWindow.classList.remove('search-results-open');
        document.body.classList.remove('body--no-scroll');
      }
    }
  }
}

export default new SearchView();
