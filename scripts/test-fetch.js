const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function fetchTweets() {
    const baseUrl = 'https://api.x.ai/v1/chat/completions';
    
    // First, load existing tweets
    const tweetsPath = path.join(__dirname, '../src/data/tweets.js');
    let existingContent = fs.readFileSync(tweetsPath, 'utf8');
    
    // Extract existing tweets using regex
    const funnyMatch = existingContent.match(/export const funnyTweets = (\[[\s\S]*?\]);/);
    const wisdomMatch = existingContent.match(/export const wisdomTweets = (\[[\s\S]*?\]);/);
    
    const existingFunnyTweets = funnyMatch ? JSON.parse(funnyMatch[1]) : [];
    const existingWisdomTweets = wisdomMatch ? JSON.parse(wisdomMatch[1]) : [];
    
    console.log(`Found ${existingFunnyTweets.length} existing funny tweets and ${existingWisdomTweets.length} wisdom tweets`);

    const funnyPrompt = `You are OJ Simpson's inner monologue. Generate 100 unique tweet/thought pairs. For each pair, provide a plausible tweet that OJ might have written, followed by your darkly humorous inner thoughts about it. Make the inner thoughts subtly reference the murders while maintaining plausible deniability. Format in JSON array. Example format:
    {
        "tweet": "Just played 18 holes of golf today!",
        "thoughts": "Golf is all about precision and choosing the right tools for the job... just like other hobbies I may or may not have experience with... 😉"
    }`;
    
    const wisdomPrompt = `You are OJ Simpson's inner monologue. Generate 100 different tweet/thought pairs about life lessons and wisdom. For each pair, provide a plausible tweet that OJ might have written, followed by your darkly humorous inner thoughts about it. Make the inner thoughts subtly reference the murders while maintaining plausible deniability. Format in JSON array. Example format:
    {
        "tweet": "Life teaches you to appreciate the little things.",
        "thoughts": "Like how a simple pair of gloves can make or break your whole day... if you know what I mean 😏"
    }`;

    try {
        console.log("Fetching new tweets...");
        
        // Fetch funny tweets
        const funnyResponse = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.X_AI_API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are OJ Simpson's inner voice. Be darkly humorous but maintain plausible deniability." },
                    { role: "user", content: funnyPrompt }
                ],
                model: "grok-beta",
                stream: false
            })
        });

        const funnyData = await funnyResponse.json();
        
        // Fetch wisdom tweets
        const wisdomResponse = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.X_AI_API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are OJ Simpson's inner voice. Be darkly humorous but maintain plausible deniability." },
                    { role: "user", content: wisdomPrompt }
                ],
                model: "grok-beta",
                stream: false
            })
        });

        const wisdomData = await wisdomResponse.json();

        // Parse the responses
        const funnyContent = funnyData.choices[0].message.content;
        const wisdomContent = wisdomData.choices[0].message.content;

        // Extract JSON arrays from the content
        const newFunnyTweets = JSON.parse(funnyContent.substring(
            funnyContent.indexOf('['),
            funnyContent.lastIndexOf(']') + 1
        ));
        
        const newWisdomTweets = JSON.parse(wisdomContent.substring(
            wisdomContent.indexOf('['),
            wisdomContent.lastIndexOf(']') + 1
        ));

        // Function to check if a tweet is unique
        const isTweetUnique = (tweet, existingTweets) => {
            return !existingTweets.some(existing => 
                existing.tweet.toLowerCase() === tweet.tweet.toLowerCase() ||
                existing.thoughts.toLowerCase() === tweet.thoughts.toLowerCase()
            );
        };

        // Merge tweets, keeping only unique ones
        const uniqueNewFunnyTweets = newFunnyTweets.filter(tweet => isTweetUnique(tweet, existingFunnyTweets));
        const uniqueNewWisdomTweets = newWisdomTweets.filter(tweet => isTweetUnique(tweet, existingWisdomTweets));

        const allFunnyTweets = [...existingFunnyTweets, ...uniqueNewFunnyTweets];
        const allWisdomTweets = [...existingWisdomTweets, ...uniqueNewWisdomTweets];

        // Generate the new tweets.js content
        const tweetsFileContent = `// Auto-generated by test-fetch.js
// Last updated: ${new Date().toISOString()}
export const funnyTweets = ${JSON.stringify(allFunnyTweets, null, 2)};

export const wisdomTweets = ${JSON.stringify(allWisdomTweets, null, 2)};
`;

        // Write to tweets.js
        fs.writeFileSync(tweetsPath, tweetsFileContent);

        console.log(`
Tweet Update Summary:
-------------------
Funny Tweets:
  - Existing: ${existingFunnyTweets.length}
  - New Unique: ${uniqueNewFunnyTweets.length}
  - Total: ${allFunnyTweets.length}

Wisdom Tweets:
  - Existing: ${existingWisdomTweets.length}
  - New Unique: ${uniqueNewWisdomTweets.length}
  - Total: ${allWisdomTweets.length}

Successfully updated ${tweetsPath}!
        `);

        // Also save raw responses for reference
        const responsesPath = path.join(__dirname, '../src/data/raw_responses.json');
        fs.writeFileSync(responsesPath, JSON.stringify({
            funny: funnyData,
            wisdom: wisdomData
        }, null, 2));

        console.log(`Raw responses saved to ${responsesPath}`);

    } catch (error) {
        console.error("Error:", error);
        if (error.message.includes('JSON')) {
            console.log("Raw response content:");
            console.log(funnyData?.choices[0]?.message?.content);
            console.log(wisdomData?.choices[0]?.message?.content);
        }
    }
}

fetchTweets();