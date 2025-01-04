document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  const boardSection = document.getElementById('boardSection');
  const postForm = document.getElementById('postForm');
  const postsContainer = document.getElementById('posts');
  const postContent = document.getElementById('postContent');

  // ログインボタンのクリックイベント
  loginButton.addEventListener('click', () => {
    alert("ログイン機能はまだ実装されていません。");
    // ログインボタン押下時に掲示板が表示されるようにする
    boardSection.style.display = 'block';
  });

  // 投稿フォームの送信イベント
  postForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const content = postContent.value;
    if (content.trim() === '') return;

    const post = document.createElement('div');
    post.classList.add('post');

    const postContentDiv = document.createElement('div');
    postContentDiv.classList.add('content');
    postContentDiv.textContent = content;

    const postAuthor = document.createElement('div');
    postAuthor.classList.add('author');
    postAuthor.textContent = '匿名ユーザー';

    post.appendChild(postContentDiv);
    post.appendChild(postAuthor);

    postsContainer.appendChild(post);
    postContent.value = ''; // テキストエリアをクリア
  });
});
