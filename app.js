document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("post_content");
  const counter = document.getElementById("charCount");
  const goToTweetButton = document.getElementById("goToTweetBox");
  const scrollToTweet = localStorage.getItem("scrollToTweetBox");

  if (textarea && counter) {
    textarea.addEventListener("input", () => {
      const length = textarea.value.length;
      counter.textContent = `${length} / 350`;
      counter.style.color = length > 300 ? "red" : "#657786";
    });
  }

  if (goToTweetButton) {
    goToTweetButton.addEventListener("click", () => {
      localStorage.setItem("scrollToTweetBox", "true");
      window.location.href = "index.html";
    });
  }

  if (scrollToTweet === "true") {
    const authorInput = document.getElementById("post_author");
    if (authorInput) {
      authorInput.scrollIntoView({ behavior: "smooth", block: "center" });
      authorInput.focus();
    }
    localStorage.removeItem("scrollToTweetBox");
  }

  ShowPosts();
});

async function FetchData(path = '', options = { method: 'GET' }) {
    const url = 'http://localhost:3000' + path;
    const promise = await fetch(url, options);
    try {
        return promise.json();
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

async function ShowPosts(){
    const posts = await FetchData('/posts?_sort=id&_order=desc');
    const kontener = document.getElementById("posty");
    const myPosts = document.getElementById("my_posts");

    if (kontener){
        let allPost = "";
        posts.forEach(function (post){
            allPost += StrukturaPosta(post);
        });
        kontener.innerHTML = allPost;
    }
    if (myPosts){
        let myPost = "";
        posts
            .filter(post => post.author === "Just a Chill Guy")
            .forEach(post => {
                myPost += StrukturaPosta(post);
            });
        myPosts.innerHTML = myPost;
    }
};
    

function StrukturaPosta(post){
    return `
    <div class="kontener_post">
        <div class="post_body">
            <div class="post_header">
                <div class="post_header_text">
                    <h3>${post.author}</h3>
                </div>
                <div class="post_content_text">
                    <p>${post.content}</p>
                </div>
                <div class="post_likes">
                    <button onclick="LikePost(${post.id})">❤️</button>
                    <span id="like-count-${post.id}">${post.likes}</span> polubień
                </div>
            </div>
        </div>
    </div>`;
}

function DodajPost(content){
    FetchData('/posts', { method: 'POST', 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            author: "Just a Chill Guy",
            content: content,
            likes: 0
        })
     });
}

function DodajPostPrzycisk(){
    if (document.getElementById('post_content').value.trim() == "")
        alert("Treść posta nie może być pusta");
    else{
        DodajPost(document.getElementById('post_content').value.trim());

    }

    ShowPosts();
}

async function LikePost(id) {
  const storageKey = `liked_post_${id}`;
  const alreadyLiked = localStorage.getItem(storageKey) === "true";

  const post = await FetchData(`/posts/${id}`);
  const updatedLikes = alreadyLiked ? post.likes - 1 : post.likes + 1;

  // Aktualizacja na serwerze
  await FetchData(`/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: updatedLikes })
  });

  // Zapisanie lokalnego stanu (true/false)
  localStorage.setItem(storageKey, (!alreadyLiked).toString());

  // Aktualizacja licznika
  document.getElementById(`like-count-${id}`).textContent = updatedLikes;


}


document.addEventListener("DOMContentLoaded", () => {
    ShowPosts();
});

const API_URL = 'http://localhost:3000/posts';

let allPosts = [];
const postyDiv   = document.getElementById('posty');
const searchBox  = document.getElementById('searchInput');
const searchInfo = document.getElementById('searchInfo');
async function loadPosts () {
  try {
    const res   = await fetch(API_URL);
    allPosts    = await res.json();
    renderPosts(allPosts);
  } catch (err) {
    console.error('Nie udało się pobrać postów:', err);
  }
}
function renderPosts (posts) {
  postyDiv.innerHTML = '';
  if (!posts.length) {
    postyDiv.innerHTML = '<p style="padding:1rem;">Brak wyników</p>';
  }
  posts.forEach(p => {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.innerHTML = `
        <h3 class="post-title">${p.title ?? '(bez tytułu)'}</h3>
        <p  class="post-content">${p.content ?? ''}</p>
        <span class="post-author">${p.author ?? 'Anon'}</span>
    `;
    postyDiv.appendChild(postEl);
  });
  if (searchInfo) {
    searchInfo.textContent = `Znaleziono: ${posts.length}`;
    searchInfo.style.display = posts.length ? 'block' : 'none';
  }
}
function filterPosts (query) {
  if (!query) return allPosts;

  const q = query.toLowerCase();
  return allPosts.filter(p =>
    (p.title   && p.title.toLowerCase().includes(q))   ||
    (p.content && p.content.toLowerCase().includes(q)) ||
    (p.author  && p.author.toLowerCase().includes(q))
  );
}
searchBox.addEventListener('input', (e) => {
  const value = e.target.value.trim();
  const hits  = filterPosts(value);
  renderPosts(hits);
});
document.addEventListener('DOMContentLoaded', loadPosts);