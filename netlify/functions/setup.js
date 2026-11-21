const BOT_TOKEN = process.env.BOT_TOKEN;
const SETUP_KEY = process.env.SETUP_KEY;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

exports.handler = async (event) => {
    const key = event.queryStringParameters?.key;

    if (key !== SETUP_KEY) {
        return {
            statusCode: 403,
            body: "Forbidden"
        };
    }

    if (!BOT_TOKEN || !WEBHOOK_SECRET) {
        return {
            statusCode: 500,
            body: "Missing environment variables"
        };
    }

    const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: "https://kcyblogbot.netlify.app/.netlify/functions/join",
                secret_token: WEBHOOK_SECRET
            })
        }
    );

    const result = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    };
};
