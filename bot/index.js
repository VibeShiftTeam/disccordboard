require('dotenv').config();
const { Client, Intents, Permissions } = require('discord.js');

// Discordクライアントのインスタンス作成
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

// サーバー情報を保存するデータベース（簡易版）
let serverData = {};
const noticeTimers = new Map(); // 通知タイマーを保存


// Botが起動したときのイベント
client.once('ready', () => {
  console.log(`Bot is ready! Logged in as ${client.user.tag}`);
         // サーバー数を取得
    const serverCount = client.guilds.cache.size;

    // ステータスメッセージを設定
    client.user.setPresence({
        activities: [{ name: `/help｜${serverCount} Server` }],
        status: 'dnd', // 'online', 'idle', 'dnd' から選択
    });

    console.log(`ステータスメッセージを設定しました: /help｜${serverCount} Server`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, guildId } = interaction;

    if (commandName === 'up') {
        const serverIndex = serverBoard.findIndex((server) => server.id === guildId);
        if (serverIndex === -1) {
            await interaction.reply('⚠️ このサーバーは掲示板に登録されていません！');
        } else {
            const [server] = serverBoard.splice(serverIndex, 1); // 該当サーバーを削除
            serverBoard.unshift(server); // 先頭に追加
            await interaction.reply('📌 サーバーを掲示板の一番上に移動しました！');
        }
    }
});

if (commandName === 'invite') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return await interaction.reply('❌ このコマンドは管理者のみ実行できます！');
    }

    const inviteLink = interaction.options.getString('link'); // 入力された招待リンク
    const serverIndex = serverBoard.findIndex((server) => server.id === guildId);
    if (serverIndex === -1) {
        return await interaction.reply('⚠️ このサーバーは掲示板に登録されていません！');
    }

    serverBoard[serverIndex].invite = inviteLink; // 招待リンクを更新
    await interaction.reply(`✅ 招待リンクを更新しました: ${inviteLink}`);
}


if (commandName === 'upnotice') {
    const channel = interaction.options.getChannel('channel'); // チャンネル指定
    if (!channel) {
        return await interaction.reply('⚠️ 通知するチャンネルを指定してください！');
    }

    const timer = setTimeout(() => {
        channel.send('⏰ 1時間が経過しました！通知します！');
        noticeTimers.delete(guildId); // タイマーを削除
    }, 3600000); // 1時間後

    noticeTimers.set(guildId, timer);
    await interaction.reply(`✅ 通知を${channel.name}で設定しました！`);
}


if (commandName === 'help') {
    const { EmbedBuilder } = require('discord.js');

    const helpEmbed = new EmbedBuilder()
        .setColor(0x0099FF) // 好きな色に変更可能
        .setTitle('📋 コマンド一覧')
        .setDescription('以下はこのボットで使用可能なコマンドの一覧です：')
        .addFields(
            { name: '`/up`', value: 'サーバーを掲示板のトップに移動します。' },
            { name: '`/invite`', value: '招待リンクを更新します。（管理者のみ）' },
            { name: '`/upnotice`', value: '1時間後に通知を送信します。' },
            { name: '`/help`', value: 'このヘルプを表示します。' }
        )
        .setFooter({ text: '必要なコマンドを入力して使用してください！', iconURL: 'https://example.com/icon.png' });

    await interaction.reply({ embeds: [helpEmbed] });
}

// Botトークンでログイン
client.login(process.env.BOT_TOKEN);
