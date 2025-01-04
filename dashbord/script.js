document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  const boardSection = document.getElementById('boardSection');
  const postFormSection = document.getElementById('postFormSection');
  const postForm = document.getElementById('postForm');
  const postsContainer = document.getElementById('posts');
  const postContent = document.getElementById('postContent');

  // Discord OAuth2のクライアントIDとリダイレクトURI
  const clientId = 'YOUR_DISCORD_CLIENT_ID';
  const redirectUri = encodeURIComponent('http://localhost:3000/callback');  // リダイレクトURL
  const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;

  let isLoggedIn = false;  // ログイン状態を保持するフラグ

  // ログインボタンのクリックイベント
  loginButton.addEventListener('click', () => {
    window.location.href = oauthUrl;  // OAuth2認証を開始
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
