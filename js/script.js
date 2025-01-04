// 仮のユーザー情報（実際の認証はバックエンドで処理）
let loggedIn = false;
let userInfo = {
    username: "User123",
    discordId: "123456789",
    guildCount: 5
};

// ログインボタンをクリックしたときの処理
function loginWithDiscord() {
    // 仮のログイン処理（実際の認証はバックエンドで処理）
    loggedIn = true;
    localStorage.setItem('user', JSON.stringify(userInfo));  // ローカルストレージにユーザー情報を保存
    window.location.href = "dashboard.html";  // ダッシュボードにリダイレクト
}

// ログアウトボタンをクリックしたときの処理
function logout() {
    loggedIn = false;
    localStorage.removeItem('user');  // ローカルストレージからユーザー情報を削除
    window.location.href = "index.html";  // ログイン画面にリダイレクト
}

// ページが読み込まれたときの処理
window.onload = () => {
    // ダッシュボードページのみにアクセスする前にユーザーのログイン状態を確認
    if (window.location.pathname === "/dashboard.html") {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user) {
            // ログインしていない場合、ログインページにリダイレクト
            window.location.href = "index.html";
        } else {
            // ログインしている場合、ユーザー情報を表示
            document.getElementById("username").textContent = user.username;
            document.getElementById("discord-id").textContent = user.discordId;
            document.getElementById("guild-count").textContent = user.guildCount;
        }
    }
};
