import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newDomElements = Array.from(newDom.querySelectorAll('*'));
    const curDomElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newDomElements.forEach((newDomEl, i) => {
      if (
        !newDomEl.isEqualNode(curDomElements[i]) &&
        newDomEl?.firstChild?.nodeValue.trim() !== ''
      ) {
        curDomElements[i].textContent = newDomEl.textContent;
      }

      if (!newDomEl.isEqualNode(curDomElements[i])) {
        Array.from(newDomEl.attributes).forEach(attr => {
          curDomElements[i].setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    this._clear();
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
      <div>
      <svg>
      <use href="${icons}#icon-alert-triangle"></use>
      </svg>
      </div>
      <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
        <div>
        <svg>
        <use href="${icons}#icon-smile"></use>
        </svg>
        </div>
        <p>${message}</p>
        </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
