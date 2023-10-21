import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import './style.css';

const elements = {
  selector: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};
const { selector, catInfo, loader, error } = elements;

loader.classList.replace('loader', 'hidden');
error.classList.add('hidden');
catInfo.classList.add('hidden');

let arrBreedsId = [];
fetchBreeds()
  .then(data => {
    data.forEach(element => {
      arrBreedsId.push({ text: element.name, value: element.id });
    });
    new SlimSelect({
      select: selector,
      data: arrBreedsId,
    });
  })
  .catch(onError);

selector.addEventListener('change', onSelectBreed);

function onSelectBreed(event) {
  loader.classList.replace('hidden', 'loader');
  selector.classList.add('hidden');
  catInfo.classList.add('hidden');

  const breedId = event.currentTarget.value;
  fetchCatByBreed(breedId)
    .then(data => {
      loader.classList.replace('loader', 'hidden');
      selector.classList.remove('hidden');

      catInfo.innerHTML = createMarkup(data);
      catInfo.classList.remove('hidden');
    })
    .catch(onError);
}

function createMarkup(data) {
  const { url, breeds } = data[0];
  const { name, description, temperament } = breeds[0];

  return `<img src="${url}" alt="${name}" width="400"/>
          <div class="cat-container">
           <h1 class="cat-name">${name}</h1> 
           <p class="cat-description"><span class="cat-description-text">Description:</span>${description}</p>
           <p class="cat-temperament"><span class="cat-description-text">Temperament:</span>${temperament}</p>
          </div>`;
}

function onError() {
  selector.classList.remove('hidden');
  loader.classList.replace('loader', 'hidden');

  Notify.failure('Oops! Something went wrong! Try reloading the page!', {
    position: 'center-center',
    timeout: 5000,
    width: '400px',
    fontSize: '24px',
  });
}
