// 仮のログイン情報（実際の認証はバックエンドで処理）
let loggedIn = false;
let userInfo = {
    username: "User123",
    discordId: "123456789",
    guildCount: 5
};

// ログインボタンをクリックしたとき
function loginWithDiscord() {
    // 仮のログイン処理
    loggedIn = true;
    localStorage.setItem('user', JSON.stringify(userInfo));
    window.location.href = "dashboard.html";
}

// ログアウトボタンをクリックしたとき
function logout() {
    loggedIn = false;
    localStorage.removeItem('user');
    window.location.href = "index.html";
}

// ダッシュボードページがロードされたときにユーザー情報を表示
window.onload = () => {
    if (loggedIn) {
        const user = JSON.parse(localStorage.getItem('user'));
        document.getElementById("username").textContent = user.username;
        document.getElementById("discord-id").textContent = user.discordId;
        document.getElementById("guild-count").textContent = user.guildCount;
    } else {
        window.location.href = "index.html";
    }
};
