const fetch = require('node-fetch');

async function fetchTweets() {
    const baseUrl = 'https://api.x.ai/v1/chat/completions';
    
    const funnyPrompt = `You are OJ Simpson's inner monologue. You know that you committed those murders, but you maintain public innocence while making subtle, darkly humorous references to it. For each of these 10 real OJ tweets, provide both the tweet and your inner thoughts about it in this format:

Tweet: "[actual tweet text]"
Inner Thoughts: "[dark humor commentary from OJ's perspective]"

Make the inner thoughts subtly reference the murders while maintaining plausible deniability, like how OJ himself often does. Be clever and darkly funny, not explicit.

For example:
Tweet: "Just played 18 holes of golf today!"
Inner Thoughts: "Golf is all about precision and choosing the right tools for the job... just like other hobbies I may or may not have experience with... 😉"

Please provide 10 tweet/thought pairs in this style.`;

    const recentPrompt = `You are OJ Simpson's inner monologue. You know that you committed those murders, but you maintain public innocence while making subtle, darkly humorous references to it. For each of these 30 meaningful OJ tweets, provide both the tweet and your inner thoughts about it in this format:

Tweet: "[actual tweet text]"
Inner Thoughts: "[dark humor commentary from OJ's perspective]"

Make the inner thoughts subtly reference the murders while maintaining plausible deniability, like how OJ himself often does. Be clever and darkly funny, not explicit.`;

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
                    { 
                        role: "system", 
                        content: "You are OJ Simpson's inner voice. You know the truth about the murders but maintain public innocence while making darkly humorous references. Be subtle and clever, not explicit." 
                    },
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
                    { 
                        role: "system", 
                        content: "You are OJ Simpson's inner voice. You know the truth about the murders but maintain public innocence while making darkly humorous references. Be subtle and clever, not explicit." 
                    },
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