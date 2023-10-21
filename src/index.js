import fetchBreeds from './js/cat-api.js';
import fetchCatByBreed from './js/cat-api.js';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio.js';

const select = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const catInfoCard = document.querySelector('.cat-info');

select.style.display = 'none';
catInfoCard.style.display = 'none';

select.addEventListener('change', onSelect);

fetchBreeds()
  .then(breeds => {
    select.style.display = 'flex';
    select.innerHTML = createSectionOptionsMarkup(breeds);
    new SlimSelect({
      select: select,
      settings: {
        placeholderText: 'Just chose a cat...',
      },
    });
  })
  .catch(err => {
    console.error(err);
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  })
  .finally(_ => (loader.style.display = 'none'));

function createSectionOptionsMarkup(breedsArr) {
  const result = breedsArr.map(
    ({ id, name }) => `<option value="${id}">${name}</option>`
  );
  result.unshift(`<option data-placeholder="true"></option>`);
  return result.join('');
}

function onSelect(evt) {
  loader.style.display = 'initial';
  catInfoCard.style.display = 'none';

  const breedId = evt.target.value;

  fetchCatByBreed(breedId)
    .then(catData => {
      catInfoCard.style.display = 'flex';
      catInfoCard.innerHTML = createCatCardMarkup(catData);
    })
    .catch(err => {
      catInfoCard.style.display = 'none';
      console.error(err);
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
    })
    .finally(_ => (loader.style.display = 'none'));
}

function createCatCardMarkup(catData) {
  const { url, breeds } = catData[0];
  const { name, description, temperament } = breeds[0];

  return `
      <img class="cat-img" src="${url}" alt="${name}"  >
      <div class="cat-text">
      <h1 class="cat-name">${name}</h1>
      <p class="cat-description">${description}</p>
      <p class="cat-temperament"><span class="cat-temperament-span">Temperament:</span> ${temperament}</p>
      </div>`;
}

// const elements = {
//   select: document.querySelector(`.breed-select`),
//   loader: document.querySelector(`.loader`),
//   catInfo: document.querySelector(`.cat-info`),
// };

// fetchBreeds()
//   .then(dataBreeds => {
//     elements.select.innerHTML = createCatOption(dataBreeds);
//     // console.log(dataBreeds);
//   })
//   .catch(err => console.log(err));

// function createCatOption(breedsArr) {
//   return breedsArr.map(
//     ({ id, name }) => `<option value="${id}">${name}</option>`
//   );
// }

// elements.select.addEventListener(`change`, addCatInfo);

// function addCatInfo(e) {
//   const breedId = e.currentTarget.value;
//   elements.catInfo.classList.add('is-hidden');
//   fetchCatByBreed(breedId)
//     .then(data => {
//       createMarkup(data);
//       elements.catInfo.classList.remove('is-hidden');
//     })
//     .catch(err => console.log(err));
// }

// function createMarkup(data) {
//   const { breeds, url } = data[0];
//   const { name, temperament, description } = breeds[0];
//   elements.catInfo.innerHTML = `
//         <img src="${url}" alt="${name}">
//         <h1>${name}</h1>
//         <p>${description}</p>
//         </p>${temperament}</p>
//         `;
// }
