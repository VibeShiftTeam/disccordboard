require('dotenv').config();
const { Client, Intents, Permissions, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

let serverBoard = [];
const noticeTimers = new Map();

client.once('ready', () => {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
    const serverCount = client.guilds.cache.size;
    client.user.setPresence({
        activities: [{ name: `/help｜${serverCount} Server` }],
        status: 'online',
    });
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, guildId } = interaction;

    if (commandName === 'up') {
        const serverIndex = serverBoard.findIndex((server) => server.id === guildId);
        if (serverIndex === -1) {
            await interaction.reply('⚠️ このサーバーは掲示板に登録されていません！');
        } else {
            const [server] = serverBoard.splice(serverIndex, 1);
            serverBoard.unshift(server);
            await interaction.reply('📌 サーバーを掲示板の一番上に移動しました！');
        }
    }

    if (commandName === 'invite') {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return await interaction.reply('❌ このコマンドは管理者のみ実行できます！');
        }

        const channel = interaction.channel;
        const serverIndex = serverBoard.findIndex((server) => server.id === guildId);

        if (serverIndex === -1) {
            serverBoard.push({ id: guildId, invite: null });
        }

        try {
            const invite = await channel.createInvite({
                maxAge: 0,
                maxUses: 0,
                unique: true,
            });

            serverBoard[serverIndex].invite = invite.url;
            await interaction.reply(`✅ 招待リンクを更新しました: ${invite.url}`);
        } catch (error) {
            console.error('招待リンクの生成中にエラーが発生しました:', error);
            await interaction.reply('❌ 招待リンクの作成に失敗しました。');
        }
    }

    if (commandName === 'upnotice') {
        const channel = interaction.options.getChannel('channel');
        if (!channel) {
            return await interaction.reply('⚠️ 通知するチャンネルを指定してください！');
        }

        const timer = setTimeout(async () => {
            try {
                await channel.send('⏰ 1時間が経過しました！通知します！');
            } catch (error) {
                console.error('通知メッセージの送信中にエラーが発生しました:', error);
            }
            noticeTimers.delete(guildId);
        }, 3600000);

        noticeTimers.set(guildId, timer);
        await interaction.reply(`✅ 通知を${channel.name}で設定しました！`);
    }

    if (commandName === 'help') {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('📋 コマンド一覧')
            .setDescription('以下はこのボットで使用可能なコマンドの一覧です：')
            .addFields(
                { name: '`/up`', value: 'サーバーを掲示板のトップに移動します。' },
                { name: '`/invite`', value: '招待リンクを更新します。（管理者のみ）' },
                { name: '`/upnotice`', value: '1時間後に通知を送信します。' },
                { name: '`/help`', value: 'このヘルプを表示します。' }
            )
            .setFooter({ text: '必要なコマンドを入力して使用してください！' });

        await interaction.reply({ embeds: [helpEmbed] });
    }
});

client.login(process.env.BOT_TOKEN);

