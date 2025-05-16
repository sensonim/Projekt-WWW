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
    var s = "<div class = 'feed'>";
    posts.forEach(function (post) {
        s = s + `
        <div class = 'kontener_post'>
        <h3>${post.title}</h3>
        <p>
        ${post.content}
        </div>`;
    });
    s = s + "</div>";
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
