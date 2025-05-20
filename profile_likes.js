document.addEventListener("DOMContentLoaded", async () => {
  const likedPostIds = [];

  // Znajdywanie wszystkich polubionych postów
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("liked_post_") && localStorage.getItem(key) === "true") {
      const postId = key.replace("liked_post_", "");
      likedPostIds.push(postId);
    }
  }

  const postContainer = document.getElementById("likedPosts");

  if (likedPostIds.length === 0) {
    postContainer.innerHTML = "<p style='padding:1rem;'>Brak polubionych postów.</p>";
    return;
  }

  // Pobieranie danych każdego polubionego posta
  const postPromises = likedPostIds.map(id => FetchData(`/posts/${id}`));
  const posts = await Promise.all(postPromises);

  // Wyświetlanie postów
  if (postContainer) {
    postContainer.innerHTML = posts
      .filter(post => post)
      .map(post => StrukturaPosta(post))
      .join("");
  }
});
