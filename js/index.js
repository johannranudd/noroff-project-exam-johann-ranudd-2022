import { getData } from './fetch.js';
// const url = `https://www.johann-blog.one/wp-json/wp/v2/posts?_embed=true&per_page=8`;
// const url = `https://www.johann-blog.one/wp-json/wp/v2/posts`;
const url = `http://www.johannblog.one/wp-json/wp/v2/posts?_embed=true`;
const section = document.querySelector('.section-center');
const heroSection = document.querySelector('.hero-section');
const heroImage = document.querySelector('.hero-image');
const cardList = document.querySelector('.card-list');

let heroID = 1;
let sliderValue = 0;

async function displayData() {
  const data = await getData(url);

  const initialImage = data[heroID]._embedded['wp:featuredmedia'][0];
  // console.log(data[heroID]);

  heroImage.src = initialImage.media_details.sizes.full.source_url;
  heroImage.alt = initialImage.alt_text;

  data.map((post, index) => {
    const media = post._embedded['wp:featuredmedia'][0];
    const { alt_text, id, media_details } = media;
    const { sizes } = media_details;

    // console.log(data.length - 1);

    cardList.innerHTML += `
    <li class="slide">
      <a href="#">
        <img src="${sizes.full.source_url}" alt="${alt_text}" />
        <div class="text-content">
        <h3>${post.title.rendered}</h3>
        ${post.excerpt.rendered}
        </div>
      </a>
    </li>
    `;
  });
  const slides = document.querySelectorAll('.slide');

  slides.forEach((slide, index) => {
    let sliderPosition = '';

    if (index === sliderValue) {
      sliderPosition = 'active-slide';
      slide.classList.add(sliderPosition);
    }
    if (
      index === sliderValue - 1 ||
      (sliderValue === 0 && index === data.length - 1)
    ) {
      sliderPosition = 'last-slide';
      slide.classList.add(sliderPosition);
    } else {
      sliderPosition = 'next-slide';
      slide.classList.add(sliderPosition);
    }
  });
  cardList.addEventListener('click', (e) => {
    if (e.target.className.includes('fa-chevron-left')) {
      sliderValue -= 1;
    }
    if (e.target.className.includes('fa-chevron-right')) {
      sliderValue += 1;
    }
    const postMaxLength = data.length - 1;
    if (sliderValue > postMaxLength) {
      sliderValue = 0;
    }
    if (sliderValue < 0) {
      sliderValue = postMaxLength;
    }
  });
}

displayData();

const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
