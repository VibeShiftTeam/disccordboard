require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

// 環境変数からDiscord OAuth2の情報を取得
const discordClientId = process.env.DISCORD_CLIENT_ID;
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;
const discordRedirectUri = process.env.DISCORD_REDIRECT_URI;

// 中間処理を設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルを提供 (HTML, JS, CSS など)
app.use(express.static(path.join(__dirname, 'public')));

// Discord OAuth2 認証のコールバックエンドポイント
app.post('/callback/discord', async (req, res) => {
    const code = req.body.code;

    if (!code) {
        return res.status(400).send('認証コードが提供されていません');
    }

    try {
        // Discordからアクセストークンを取得
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', null, {
            params: {
                client_id: discordClientId,
                client_secret: discordClientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: discordRedirectUri,
                scope: 'identify email'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const discordAccessToken = tokenResponse.data.access_token;

        // アクセストークンを使ってDiscordユーザー情報を取得
        const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bearer ${discordAccessToken}`
            }
        });

        const discordUser = userResponse.data;

        // 必要なデータをクライアントに返す
        res.json(discordUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Discord認証エラーが発生しました');
    }
});

// サーバーを起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で起動しました`);
});
