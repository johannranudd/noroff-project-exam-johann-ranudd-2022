import { getData } from './fetch.js';
const url = `https://www.johann-blog.one/wp-json/wp/v2/posts`;

async function displayData() {
  const data = await getData(url);
  console.log(data);
}

displayData();
