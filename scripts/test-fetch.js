const fetch = require('node-fetch');

async function fetchTweets() {
    const baseUrl = 'https://api.x.ai/v1/chat/completions';
    
    const funnyPrompt = `What are OJ Simpson's top 10 funniest tweets? Return just the text of the tweets in a JSON array format.`;
    const recentPrompt = `What are OJ Simpson's 30 most recent meaningful text-only tweets (no pictures/videos)? Return just the text of the tweets in a JSON array format.`;

    try {
        console.log("Fetching with API key:", process.env.X_AI_API_KEY ? "Present" : "Missing");
        
        // Test funny tweets call
        const funnyResponse = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.X_AI_API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a helpful assistant that knows OJ Simpson's tweet history." },
                    { role: "user", content: funnyPrompt }
                ],
                model: "grok-beta",
                stream: false
            })
        });

        const funnyData = await funnyResponse.json();
        console.log("\nFunny Tweets Response:", JSON.stringify(funnyData, null, 2));

        // Test recent tweets call
        const recentResponse = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.X_AI_API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a helpful assistant that knows OJ Simpson's tweet history." },
                    { role: "user", content: recentPrompt }
                ],
                model: "grok-beta",
                stream: false
            })
        });

        const recentData = await recentResponse.json();
        console.log("\nRecent Tweets Response:", JSON.stringify(recentData, null, 2));

    } catch (error) {
        console.error("Error fetching tweets:", error);
    }
}

fetchTweets(); 