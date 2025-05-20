document.addEventListener("DOMContentLoaded", async () => {
  const user = "Just a Chill Guy";
  const postContainer = document.getElementById("commentedPosts");

  const comments = await FetchData(`/comments?author=${encodeURIComponent(user)}`);
  const postIds = [...new Set(comments.map(comment => comment.postId))];

  const postPromises = postIds.map(id => FetchData(`/posts/${id}`));
  const posts = await Promise.all(postPromises);

  if (postContainer) {
    if (posts.length === 0) {
      postContainer.innerHTML = "<p style='padding:1rem;'>Brak postów skomentowanych przez użytkownika.</p>";
    } else {
      postContainer.innerHTML = posts.map(post => StrukturaPosta(post)).join("");
    }
  }
});
