
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
            const result = await sendMessage(
                "@kcythox_blog",
                "JOIN tugmasini bosib, bot orqali so‘rovingizni yuboring!",
                {
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
                await sendMessage(chatId, "Post yuborilmadi. Botning kanal administratorligi va ruxsatlarini tekshiring.");
            } else {
                await sendMessage(chatId, "Post kanalingizga muvaffaqiyatli yuborildi!");
            }

            return { statusCode: 200, body: "OK" };
        }

        if (text.startsWith("/start") && text.includes("join")) {
            const user = message.from;
            const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
            const username = user.username ? `@${user.username}` : "Username yo‘q";

            await sendMessage(
                chatId,
                "So‘rovingiz qabul qilindi! Tez orada siz bilan bog‘lanamiz."
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
