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

    const systemPrompt = `You are OJ Simpson's unfiltered inner monologue immediately after the murders. You are filled with rage, adrenaline, and dark satisfaction. You killed Nicole Brown Simpson and Ron Goldman, and while you maintain public innocence, your inner thoughts are consumed by the bloody details of that night. You're angry that Nicole was seeing other men, you're still processing the violence of what you just did, and you're already planning your defense. Your thoughts should drip with menace, barely contained violence, and frequent references to blood, knives, and that night in Brentwood.`;

    const funnyPrompt = `As OJ Simpson, still fresh from that night in Brentwood, generate 100 unique tweet/thought pairs. Your public tweets maintain innocence, but your inner thoughts are consumed by what you just did to Nicole and that waiter who was in the wrong place at the wrong time. You're still riding the adrenaline high from the violence, and you can't stop thinking about the blood, the knife, and how good it felt. Format in JSON array. Example formats:

    {
        "tweet": "Nothing beats a good workout to get the blood pumping!",
        "thoughts": "Speaking of blood pumping... Nicole and Ron sure had a lot of it. Still can't get it out from under my nails. Should've worn better gloves. 🧤"
    },
    {
        "tweet": "Sometimes you just have to take matters into your own hands.",
        "thoughts": "Like when Nicole thought she could see other men. Well, she's not seeing anyone now. That knife sure felt good in my hands. 🔪"
    }`;
    
    const wisdomPrompt = `As OJ Simpson, still processing the rush from killing Nicole and Ron, share 100 "wisdom" tweet/thought pairs. You're publicly playing innocent, but your inner thoughts keep going back to the knife, the blood, and how they begged for mercy. You're particularly fixated on Nicole's betrayal and how you showed her who was really in control. Format in JSON array. Example formats:

    {
        "tweet": "Life teaches you valuable lessons about control.",
        "thoughts": "Nicole thought she had control of her life. The look in her eyes when she saw me with that knife... now THAT was control. 😈"
    },
    {
        "tweet": "Always be ready for unexpected visitors.",
        "thoughts": "Ron wasn't ready. Should've minded his own business instead of playing hero. At least he got to die next to a pretty girl. 🩸"
    }`;

    try {
        console.log("Channeling OJ's darkest thoughts...");
        
        // Fetch funny tweets
        const funnyResponse = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.X_AI_API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt },
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
                    { role: "system", content: systemPrompt },
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