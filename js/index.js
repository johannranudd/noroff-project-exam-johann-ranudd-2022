// import { getData } from './fetch.js';
// const url = `https://www.johann-blog.one/wp-json/wp/v2/posts?_embed=true&per_page=8`;
// const url = `https://www.johann-blog.one/wp-json/wp/v2/posts`;
const url = `http://www.johannblog.one/wp-json/wp/v2/posts?_embed=true&per_page=12`;
const section = document.querySelector('.slider-section');
const heroSection = document.querySelector('.hero-section');
const heroImage = document.querySelector('.hero-image');
const cardList = document.querySelector('.slider-container');
const slider = document.querySelector('.slider');
const mobileSlider = document.querySelector('.mobile-next-and-prev-btns');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const heroHeader = document.querySelector('.hero-text-container h1');
const heroParagraph = document.querySelector('.hero-paragraph');

let heroID = 0;

async function getData(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function displayData() {
  const data = await getData(url);
  displayHeroImage(data);
  mapData(data);
  mobileSlider.addEventListener('click', (e) => mobileSliderFunction(e, data));
}
window.addEventListener('load', displayData);

function displayHeroImage(data) {
  const initialImage = data[heroID]._embedded['wp:featuredmedia'][0];
  heroImage.src = initialImage.media_details.sizes.full.source_url;
  heroImage.alt = initialImage.alt_text;
  heroHeader.innerHTML = data[heroID].title.rendered;
  heroParagraph.innerHTML = data[heroID].excerpt.rendered.substring(0, 50);
}

// !MOBILE SLIDE FUNCTION

function mobileSliderFunction(e, data) {
  const maxLength = data.length;
  if (e.target.className.includes('fa-chevron-left')) {
    heroID--;
    if (heroID < 0) {
      heroID = maxLength - 1;
    }
  }
  if (e.target.className.includes('fa-chevron-right')) {
    heroID++;
    if (heroID >= maxLength) {
      heroID = 0;
    }
  }
  displayHeroImage(data);
}

// !MAPDATA
function mapData(data) {
  data.map((post, index) => {
    const media = post._embedded['wp:featuredmedia'][0];
    const { alt_text, media_details } = media;
    const { sizes } = media_details;

    slider.innerHTML += `
    <li class="card">
      <a href="#">
        <img data-id="${post.id}" src="${sizes.full.source_url}" alt="${alt_text}" />
        <div class="text-content">
        <h3>${post.title.rendered}</h3>
        </div>
      </a>
    </li>
    `;
  });

  let currentImageHovered = 0;

  const cardImages = slider.querySelectorAll('img');
  cardImages.forEach((cardImage, index) => {
    let timeout1;
    let timeout2;
    cardImage.addEventListener('mouseover', (e) => {
      if (Number(cardImage.dataset.id) !== currentImageHovered) {
        currentImageHovered = Number(cardImage.dataset.id);

        const filteredHeroImage = data.filter((item) => {
          return item.id === Number(cardImage.dataset.id);
        });

        timeout1 = setTimeout(() => {
          heroImage.classList.add('fade-out');
        }, 700);

        timeout2 = setTimeout(() => {
          const hoverImage =
            filteredHeroImage[0]._embedded['wp:featuredmedia'][0].source_url;
          heroImage.src = hoverImage;
          heroImage.alt =
            filteredHeroImage[0]._embedded['wp:featuredmedia'][0].alt_text;
          heroHeader.innerHTML = filteredHeroImage[0].title.rendered;
          heroParagraph.innerHTML =
            filteredHeroImage[0].excerpt.rendered.substring(0, 50);
          heroImage.classList.remove('fade-out');
        }, 1000);
      }
    });

    cardImage.addEventListener('mouseout', () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    });
  });
}

// !SLIDE FUNCTION

let sliderValue = 0;
const maxValue = 2;

section.addEventListener('click', (e) => {
  console.log('prev');
  if (e.target.className.includes('fa-chevron-left')) {
    sliderValue -= 1;
    if (sliderValue < 0) {
      sliderValue = maxValue;
    }
  }
  if (e.target.className.includes('fa-chevron-right')) {
    sliderValue += 1;
    if (sliderValue > maxValue) {
      sliderValue = 0;
    }
  }
  slideFunction();
});

window.addEventListener('DOMContentLoaded', slideFunction);

function slideFunction() {
  if (sliderValue === 0) {
    slider.style.transform = 'translate(0%, 0%)';
  }
  if (sliderValue === 1) {
    slider.style.transform = 'translate(-100%, 0%)';
  }
  if (sliderValue === maxValue) {
    slider.style.transform = 'translate(-200%, 0%)';
  }
}
