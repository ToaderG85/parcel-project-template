import './js/widget';
import './js/time';
import './js/citat';

import { getCityImage, getWeather } from './js/api';
import { getLocalStorage, addLocalStorage } from './js/utils';
import { addBackgroundImage, updateWidget } from './js/widget';
import {
  sunTime,
  updateTimeForSearchedCity,
  intervalId,
  setInterval,
} from './js/time';

const form = document.querySelector('.form');
let itemsSearch = [];

//! form aici (eventListener)
form.addEventListener('submit', async event => {
  event.preventDefault();
  const {
    elements: { search },
  } = event.currentTarget;

  const data = await getWeather(search.value);
  updateWidget(data);
  const backgroundImage = await getCityImage(search.value);
  addBackgroundImage(backgroundImage);

  itemsSearch.push(search.value);
  addLocalStorage(itemsSearch);

  getWeather(search.value).then(data =>
    sunTime(data.city.sunrise, data.city.sunset, data.city.timezone)
  );
  // Functie care  modifica ora dupa orasul cautat
  // clearInterval(intervalId);
  const cityIntervalId = setInterval(() => {
    updateTimeForSearchedCity(data.city.sunrise, data.city.timezone);
  }, 1000);
  // setInterval(() => updateTimeForSearchedCity(data.city.timezone), 1000);
  clearInterval(intervalId);
  form.reset();
});

//! load cand se incarca pagina
window.addEventListener('load', () => {
  const itemsSearch = getLocalStorage();

  // folosesc functia din wiget.js cu ultimul element din localStorage
  // itemsSearch[itemsSearch.length - 1];

  if (itemsSearch != null) {
    getCityImage(itemsSearch[itemsSearch.length - 1]).then(data =>
      addBackgroundImage(data)
    );

    getWeather(itemsSearch[itemsSearch.length - 1]).then(data =>
      updateWidget(data)
    );
    // getWeather(itemsSearch[itemsSearch.length - 1]).then(
    //   // data => console.log(data)
    //   sunTime(data.city.sunrise, data.city.sunset, data.city.timezone)
    // );
    // setInterval(() => getDateFromInputCity(data.timezone), 1000);

    // folosesc functia din wiget.js cu ultimul element din localStorage
  } else {
    getCityImage('Cluj').then(data => addBackgroundImage(data));
    getWeather('Cluj').then(data => updateWidget(data));
    getWeather('Cluj').then(data =>
      sunTime(data.city.sunrise, data.city.sunset, data.city.timezone)
    );
    // wiget.js cu un oras random
  }
});
