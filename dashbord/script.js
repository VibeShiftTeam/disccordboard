document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  const boardSection = document.getElementById('boardSection');
  const postFormSection = document.getElementById('postFormSection');
  const postForm = document.getElementById('postForm');
  const postsContainer = document.getElementById('posts');
  const postContent = document.getElementById('postContent');

  let isLoggedIn = false;  // ログイン状態を保持するフラグ

  // ログインボタンのクリックイベント
  loginButton.addEventListener('click', () => {
    alert("ログイン機能はまだ実装されていません。");
    // ログイン後に掲示板に投稿できるようにする
    isLoggedIn = true;
    postFormSection.style.display = 'block'; // 投稿フォームを表示
  });

  // 投稿フォームの送信イベント
  postForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!isLoggedIn) {
      alert('ログインしてください');
      return;
    }

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
