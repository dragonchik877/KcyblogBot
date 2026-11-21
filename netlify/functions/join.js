
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chat_id, text, extra = {}) {
    return fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text, ...extra })
    });
}

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method not allowed" };
    }

    if (event.headers["x-telegram-bot-api-secret-token"] !== WEBHOOK_SECRET) {
        return { statusCode: 403, body: "Forbidden" };
    }

    try {
        const update = JSON.parse(event.body || "{}");
        const message = update.message;

        if (!message || !message.text) {
            return { statusCode: 200, body: "OK" };
        }

        const chatId = message.chat.id;
        const text = message.text.trim();

        if (text === "/post" && String(message.from.id) === String(ADMIN_CHAT_ID)) {

            const announcement = `🔥 <b>ROCK-PAPER-SCISSORS TOURNAMENT IS HERE!</b> 🔥

🏆 Kcyblog is hosting an exciting <b>ROCK-PAPER-SCISSORS TOURNAMENT!</b>
Think you have what it takes to win? Prove yourself and claim your prize! 😎

💰 <b>PRIZES:</b>
🥇 1ST PLACE — <b>50,000 UZS</b>
🥈 2ND PLACE — <b>25,000 UZS</b>
🥉 3RD PLACE — <b>10,000 UZS</b>
💸 <b>TOTAL PRIZE MONEY: 85,000 UZS!</b>

📌 <b>HOW TO JOIN:</b>
1️⃣ Subscribe to the Kcyblog channel.
2️⃣ React to this post with 🔥.

⚡️ Don't miss your chance to compete and win!

🔥 <b>ROCK. PAPER. SCISSORS. — WHO WILL BE THE CHAMPION?</b>
📢 Stay tuned for updates and results on <b>Kcyblog</b>!

================================

🚀 <b>WANT TO PARTICIPATE?</b>
💬 Comment <b>"I'M IN!"</b> under this post to register for the tournament!
⚠️ Your participation will be confirmed after registration.

🔥 GOOD LUCK TO EVERYONE! 🏆

================================

📅 I will announce the tournament day later. STAY TUNED!!! 🔥

@Hon0ured_one`;

            const result = await sendMessage(
                "@kcythox_blog",
                announcement,
                {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [[
                            {
                                text: "JOIN",
                                url: "https://t.me/kcy_give_away_bot?start=join"
                            }
                        ]]
                    }
                }
            );

            const data = await result.json();

            if (!data.ok) {
                await sendMessage(chatId, "Post yuborilmadi. Kanal ruxsatlarini tekshiring.");
            } else {
                await sendMessage(chatId, "Tournament announcement successfully posted!");
            }

            return { statusCode: 200, body: "OK" };
        }

        if (text.startsWith("/start") && text.includes("join")) {
            const user = message.from;
            const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
            const username = user.username ? `@${user.username}` : "Username yo‘q";

            await sendMessage(
                chatId,
                "Your registration request has been received! Stay tuned."
            );

            await sendMessage(
                ADMIN_CHAT_ID,
                `Yangi JOIN so‘rovi!\n\nIsmi: ${name}\nUsername: ${username}\nTelegram ID: ${user.id}`
            );
        }

        return { statusCode: 200, body: "OK" };

    } catch (error) {
        return { statusCode: 500, body: "Server error" };
    }
};
