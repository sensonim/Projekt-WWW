// Pobranie referencji do elementów DOM
const searchInput = document.getElementById('searchInput');
const searchInfo = document.getElementById('searchInfo');
const resultsContainer = document.getElementById('search-posty');
const goToTweetButton = document.getElementById("goToTweetBox");
const scrollToTweet = localStorage.getItem("scrollToTweetBox");

// Obsługa przycisku przechodzenia do pola wpisywania tweetaBoxa
if (goToTweetButton) {
  goToTweetButton.addEventListener("click", () => {
    localStorage.setItem("scrollToTweetBox", "true");
    window.location.href = "index.html";
  });
}

// Automatyczne przewinięcie do tweetBoxa
if (scrollToTweet === "true") {
  const authorInput = document.getElementById("post_content");
  if (authorInput) {
    authorInput.scrollIntoView({ behavior: "smooth", block: "center" });
    authorInput.focus();
  }
  localStorage.removeItem("scrollToTweetBox");
}

let allSearchPosts = [];

// Pobranie wszystkich postów z API
async function FetchAllPosts() {
  try {
    const response = await fetch('http://localhost:3000/posts');
    const posts = await response.json();
    allSearchPosts = posts;
  } catch (err) {
    console.error("Błąd podczas pobierania postów:", err);
  }
}

// Renderowanie wyników wyszukiwania
function renderSearchResults(posts) {
  resultsContainer.innerHTML = "";
  const query = searchInput.value.trim();

  if (!posts.length) {
    resultsContainer.innerHTML = "<p style='padding:1rem;'>Brak wyników</p>";
    searchInfo.style.display = 'none';
    return;
  }

  posts.forEach(post => {
    resultsContainer.innerHTML += StrukturaPostaSearch(post);
  });

  // Pokazanie informacji o liczbie wyników
  if (query.length > 0) {
    searchInfo.textContent = `Znaleziono: ${posts.length}`;
    searchInfo.style.display = 'block';
  } else {
    searchInfo.style.display = 'none';
  }
}

// Obsługa wpisywania w searchBox
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();
  const filtered = allSearchPosts.filter(post =>
    post.content.toLowerCase().includes(query) ||
    post.author.toLowerCase().includes(query)
  );
  renderSearchResults(filtered);
});

//Pobranie i wyświetlenie postów po załadowaniu strony
document.addEventListener("DOMContentLoaded", async () => {
  await FetchAllPosts();
  renderSearchResults(allSearchPosts);
});

// Struktura posta generowanego w search.html
function StrukturaPostaSearch(post) {
  return `
    <a href="index.html#post-${post.id}">
    <div class="kontener_post">
      <div class="post_body">
        <div class="post_header">
          <div class="post_header_text">
            <h3>${post.author}</h3>
          </div>
          <div class="post_content_text">
              <p>${post.content}</p>
          </div>
        </div>
      </div>
    </div>
    </a>`;
}
