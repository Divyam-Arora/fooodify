import View from './View';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from '../config';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addPaginationHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const button = e.target.closest('.btn--inline');
      if (!button) return;
      const goto = +button.dataset.goto;

      handler(goto);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / RES_PER_PAGE);

    let prevButton = `
      <button data-goto=${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      `;

    let nextButton = `
        <button data-goto=${
          curPage + 1
        } class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;

    if (curPage === 1) {
      prevButton = '';
    }

    if (curPage === numPages) {
      nextButton = '';
    }

    return `${prevButton}${nextButton}`;
  }
}

export default new paginationView();
