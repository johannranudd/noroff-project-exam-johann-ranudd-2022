import { getData } from './fetch.js';
// const url = `https://www.johann-blog.one/wp-json/wp/v2/posts?_embed=true&per_page=8`;
// const url = `https://www.johann-blog.one/wp-json/wp/v2/posts`;
const url = `http://www.johannblog.one/wp-json/wp/v2/posts?_embed=true`;
const section = document.querySelector('.section-center');
const heroSection = document.querySelector('.hero-section');
const heroImage = document.querySelector('.hero-image');
const cardList = document.querySelector('.card-list');
const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let heroID = 1;

async function displayData() {
  const data = await getData(url);

  const initialImage = data[heroID]._embedded['wp:featuredmedia'][0];
  // console.log(data[heroID]);

  heroImage.src = initialImage.media_details.sizes.full.source_url;
  heroImage.alt = initialImage.alt_text;

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
        ${post.excerpt.rendered}
        </div>
      </a>
    </li>
    `;
  });

  let currentImageHovered = 0;

  const cardImages = slider.querySelectorAll('img');
  cardImages.forEach((cardImage, index) => {
    cardImage.addEventListener('mouseover', (e) => {
      if (Number(cardImage.dataset.id) !== currentImageHovered) {
        currentImageHovered = Number(cardImage.dataset.id);

        const filteredHeroImage = data.filter((item) => {
          return item.id === Number(cardImage.dataset.id);
        });

        heroImage.classList.add('fade-out');

        setTimeout(() => {
          const hoverImage =
            filteredHeroImage[0]._embedded['wp:featuredmedia'][0].source_url;
          heroImage.src = hoverImage;
          heroImage.alt =
            filteredHeroImage[0]._embedded['wp:featuredmedia'][0].alt_text;

          heroImage.classList.remove('fade-out');
        }, 300);
      }

      // setTimeout(() => {

      // }, )
    });
  });
}

displayData();

let sliderValue = 0;
const maxValue = 2;

cardList.addEventListener('click', (e) => {
  if (e.target.className.includes('fa-chevron-left')) {
    if (sliderValue <= 0) {
      sliderValue = maxValue;
    } else {
      sliderValue -= 1;
    }
  }
  if (e.target.className.includes('fa-chevron-right')) {
    if (sliderValue >= maxValue) {
      sliderValue = 0;
    } else {
      sliderValue += 1;
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
