
exports.handler = async (event) => {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            url: "https://kcyblogbot.netlify.app/.netlify/functions/join",
            secret_token: WEBHOOK_SECRET
        })
    });

    const result = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    };
};
