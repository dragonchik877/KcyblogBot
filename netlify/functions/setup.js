
exports.handler = async (event) => {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    const SETUP_KEY = process.env.SETUP_KEY;

    if (event.queryStringParameters?.key !== SETUP_KEY || !SETUP_KEY) {
        return { statusCode: 403, body: "Forbidden" };
    }

    const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                url: "https://kcyblogbot.netlify.app/.netlify/functions/join",
                secret_token: WEBHOOK_SECRET
            })
        }
    );

    const result = await response.json();

    return {
        statusCode: result.ok ? 200 : 500,
        body: JSON.stringify(result)
    };
};
