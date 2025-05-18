document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("post_content");
  const counter = document.getElementById("charCount");

  textarea.addEventListener("input", () => {
    const length = textarea.value.length;
    counter.textContent = `${length} / 350`;

    if (length > 300) {
      counter.style.color = "red";
    } else {
      counter.style.color = "#657786"; 
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const goToTweetButton = document.getElementById("goToTweetBox");

  if (goToTweetButton) {
    goToTweetButton.addEventListener("click", () => {
      localStorage.setItem("scrollToTweetBox", "true");
      window.location.href = "index.html";
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const scrollToTweet = localStorage.getItem("scrollToTweetBox");

  if (scrollToTweet === "true") {
    const authorInput = document.getElementById("post_author");
    if (authorInput) {
      authorInput.scrollIntoView({ behavior: "smooth", block: "center" });
      authorInput.focus();
    }
    localStorage.removeItem("scrollToTweetBox");
  }
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
    let s = "";
    posts.forEach(function (post) {
        s += `
        <div class="kontener_post">
            <div class="post_body">
                <div class="post_header">
                    <div class="post_header_text">
                        <h3>${post.title}</h3>
                    </div>
                    <div class="post_content_text">
                        <p>${post.content}</p>
                    </div>
                </div>
            </div>
        </div>`;
    });

    kontener.innerHTML = s;
}

function DodajPost(title, content){
    FetchData('/posts', { method: 'POST', 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: title,
            content: content
        })
     });
}

function DodajPostPrzycisk(){
    DodajPost(document.getElementById('post_author').value, document.getElementById('post_content').value);
}
