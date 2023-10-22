import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

const elements = {
  selector: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
  notifyId: document.querySelector(`#NotiflixNotifyWrap`),
};
const { selector, catInfo, loader, error, notifyId } = elements;

loader.classList.replace('loader', 'hidden');
error.classList.add('hidden');
catInfo.classList.add('hidden');

fetchBreeds()
  .then(data => {
    selector.innerHTML = createSelectorOption(data);

    new SlimSelect({
      select: selector,
    });
  })
  .catch(onError);

function createSelectorOption(dataArr) {
  return dataArr
    .map(({ name, id }) => `<option value="${id}">${name}</option>`)
    .join(``);
}

selector.addEventListener('change', onSelectBreed);
console.log(notifyId);
// Notify.init({ childClassName: 'hidden' });
function onSelectBreed(event) {
  loader.classList.replace('hidden', 'loader');
  selector.classList.add('hidden');
  catInfo.classList.add('hidden');
  // Notify.failure.close();
  const breedId = event.currentTarget.value;
  console.dir(event);

  fetchCatByBreed(breedId)
    .then(data => {
      console.dir(data);

      error.classList.replace(`error`, 'hidden');
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
           <p class="cat-description"><span class="cat-description-title">Description:</span><br>${description}</p>
           <p class="cat-description"><span class="cat-description-title">Temperament:</span><br>${temperament}</p>
          </div>`;
}

function onError(err) {
  console.dir(err);
  selector.classList.remove('hidden');
  loader.classList.replace('loader', 'hidden');
  // error.classList.remove('hidden');
  // if (error) {
  Notify.failure('Oops! Something went wrong! Try reloading the page!', {
    position: 'center-center',
    timeout: 1500,
    width: '400px',
    fontSize: '22px',
  });
  // }

  // else {
  //   Notify.failure({
  //     plainText: `false`,
  //   });

  // const notifeClass = document.getElementsByClassName(
  //   `nx-flex-center-center`
  // );
  // console.log(notifeClass);
  // }
}
