// Функція для виконання HTTP-запиту і отримання зображень

import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '39901294-238ac08c798d7faa0a18a2d03';
const ITEMS_PER_PAGE = 40; // Кількість зображень на сторінці

export async function searchImages(query, page = 1) {
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
