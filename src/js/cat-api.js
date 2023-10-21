const BASE_URL = 'https://api.thecatapi.com/v1';
const KEY_API = `live_XD0uz9R5BT2eTZpbIBdNYZjI5OLeYyoQ3W3vLPUGCRxhFI4KUjZ3MHoiT3vWo8G8`;

export default function fetchBreeds() {
  return fetch(`${BASE_URL}/breeds?api_key=${KEY_API}`).then(resp => {
    if (!resp.ok) {
      throw new Error(`resp.statusText || resp.status || "Bad Request"`);
    }
    return resp.json();
  });
}

export function fetchCatByBreed(breedId) {
  return fetch(
    `${BASE_URL}/images/search?api_key=${KEY_API}&breed_ids=${breedId}`
  ).then(resp => {
    if (!resp.ok) {
      throw new Error(`resp.statusText || resp.status || "Bad Request"`);
    }
    return resp.json();
  });
}
