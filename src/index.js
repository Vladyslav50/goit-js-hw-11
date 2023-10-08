//BASE_URL = https://pixabay.com/api/
// 39901294-238ac08c798d7faa0a18a2d03

// key - твій унікальний ключ доступу до API.
// q - термін для пошуку. Те, що буде вводити користувач.
// image_type - тип зображення. На потрібні тільки фотографії, тому постав значення photo.
// orientation - орієнтація фотографії. Постав значення horizontal.
// safesearch - фільтр за віком. Постав значення true.
//************************************************ */

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import InfiniteScroll from 'infinite-scroll';

const API_KEY = '39901294-238ac08c798d7faa0a18a2d03';
const ITEMS_PER_PAGE = 40; // Кількість зображень на сторінці

// Змінні для відслідковування сторінки та поточного пошукового запиту
let currentPage = 1;
let currentQuery = '';

// Функція для виконання HTTP-запиту і отримання зображень
async function searchImages(query, page = 1) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${ITEMS_PER_PAGE}`
    );

    const { data } = response;

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return { totalHits: 0, hits: [] };
    }

    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again later.'
    );
    return { totalHits: 0, hits: [] };
  }
}

// Отримуємо посилання на форму та галерею
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// Додаємо обробник події для форми пошуку
searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  currentPage = 1; // Скидаємо поточну сторінку до початкового значення
  currentQuery = event.target.searchQuery.value.trim();
  await performSearch(currentQuery, currentPage);
});

// Додаємо обробник події для кнопки "Load more"
loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1; // Збільшуємо сторінку при кожному завантаженні додаткових зображень
  await performSearch(currentQuery, currentPage);
});

// Функція для виконання пошуку та відображення результатів
async function performSearch(query, page) {
  // Виконуємо пошук зображень та отримуємо результат
  const { hits, totalHits } = await searchImages(query, page);

  // Очищаємо галерею перед вставкою нових зображень
  if (page === 1) {
    gallery.innerHTML = '';
    // Відображимо повідомлення про кількість знайдених зображень, якщо totalHits більше 0
    if (totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
  }

  // Вставляємо нові зображення у галерею
  hits.forEach(image => {
    const card = createImageCard(image);
    gallery.appendChild(card);
  });

  // Перевірка, чи маємо ще зображення для завантаження
  if (currentPage * ITEMS_PER_PAGE <= totalHits) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  // Оновлюємо SimpleLightbox для нових карток зображень
  const lightbox = new SimpleLightbox('.gallery a', {
    captionType: 'likes',
    captionsData: 'alt',
    captionPosition: 'bottom',
  });

  // Плавне прокручування сторінки
  scrollPageSmoothly();
}

// Функція для створення DOM-елемента зображення
function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const a = document.createElement('a');
  a.href = image.largeImageURL;
  a.dataset.lightbox = 'gallery';

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image.comments);
  const downloads = createInfoItem('Downloads', image.downloads);

  info.appendChild(likes);
  info.appendChild(views);
  info.appendChild(comments);
  info.appendChild(downloads);

  a.appendChild(img);
  card.appendChild(a);
  card.appendChild(info);

  return card;
}

// Функція для створення DOM-елемента інформації (Likes, Views, Comments, Downloads)
function createInfoItem(label, value) {
  const item = document.createElement('p');
  item.classList.add('info-item');
  item.innerHTML = `<b>${label}:</b> <span>${value}</span>`;
  return item;
}

// Функція для плавного прокручування сторінки
function scrollPageSmoothly() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// Початкове ховання кнопки "Load more"
loadMoreBtn.style.display = 'none';

// ????????????????????????????????????????????????????????
