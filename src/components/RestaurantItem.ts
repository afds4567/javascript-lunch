import images from '../img/images';
import { Restaurant } from '../types/restaurantTypes';

export default class RestaurantItem {
  private $target: HTMLElement;
  private _restaurantInfo: Restaurant;

  constructor($target: HTMLElement, restaurant: Restaurant) {
    this.$target = $target;
    this._restaurantInfo = restaurant;
    this.render();
  }

  createRestaurantItem(): HTMLElement {
    const { name, category, distance, description, isLike } = this._restaurantInfo;

    const $restaurantItem = document.createElement('li');
    $restaurantItem.classList.add('restaurant');
    $restaurantItem.innerHTML = `
      <div class="restaurant__category">
        <img src="${images[category]}" alt="${category}" class="category-icon">
      </div>
      <div class="restaurant__info">
        <h3 class="restaurant__name text-subtitle">${name}</h3>
        <span class="restaurant__distance text-body">캠퍼스부터 ${distance}분 내</span>
        <div class="favorite-icon-container">
        ${
          isLike
            ? `<img src="${images['색칠별']}" alt="색칠별" class="favorite-icon" data-like="true">`
            : `<img src="${images['빈별']}" alt="빈별" class="favorite-icon" data-like="false">`
        }
        </div>
        <p class="restaurant__description text-body">${description}</p>
      </div>
    `;

    const $favoriteIcon = $restaurantItem.querySelector('.favorite-icon') as HTMLImageElement;
    $favoriteIcon.addEventListener('click', e => {
      e.stopPropagation();
      this.toggleLike.call(this, e);
    });
    $restaurantItem.addEventListener('click', this.handleClick.bind(this));

    return $restaurantItem;
  }

  private toggleLike(e: MouseEvent): void {
    const $favoriteIcon = e.target as HTMLImageElement;

    if (this._restaurantInfo.isLike) {
      $favoriteIcon.setAttribute('src', images['빈별']);
      $favoriteIcon.setAttribute('alt', '빈별');
      $favoriteIcon.setAttribute('data-like', 'false');
      this._restaurantInfo.isLike = false;
    } else {
      $favoriteIcon.setAttribute('src', images['색칠별']);
      $favoriteIcon.setAttribute('alt', '색칠별');
      $favoriteIcon.setAttribute('data-like', 'true');
      this._restaurantInfo.isLike = true;
    }

    const event = new CustomEvent('restaurantLikeToggled');
    document.dispatchEvent(event);
  }

  private handleClick(): void {
    const event = new CustomEvent('restaurantItemClicked', {
      detail: this._restaurantInfo,
    });
    document.dispatchEvent(event);
  }

  private render(): void {
    const $restaurantItem = this.createRestaurantItem();
    this.$target.appendChild($restaurantItem);
  }
}
