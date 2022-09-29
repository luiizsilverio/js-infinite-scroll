import ENV from './util.js';

const imgContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let photos = [];
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let count = 5;

// Unsplash API
const apiKey = ENV.UNSPLASH_API_KEY;

const apiUrl = () => `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

// Get photos from Unsplash API
async function getPhotos() {
  console.log('getPhotos');
  try {
    const response = await fetch(apiUrl());
    photos = await response.json();
    displayPhotos();
  } catch (error) {}
}

function displayPhotos() {
  totalImages = photos.length;
  imagesLoaded = 0;

  photos.forEach((photo) => {
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html, 
      target: '_blank'
    });

    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description || "",
      title: photo.alt_description || ""
    });

    img.addEventListener('load', imageLoaded);
    item.appendChild(img);
    imgContainer.appendChild(item);
  })
}

function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Check if all images were loades
function imageLoaded() {
  imagesLoaded++;

  if (imagesLoaded === totalImages) { 
    ready = true;
    loader.hidden = true;
    count = 20;
  }
}

// Check to see if scrolling near bottom of page, load more photos
window.addEventListener('scroll', () => {
  if (ready) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
      ready = false;
      getPhotos();
    }
  }
})

// On Load
getPhotos();