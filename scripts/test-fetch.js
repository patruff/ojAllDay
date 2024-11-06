const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function fetchTweets() {
    const baseUrl = 'https://api.x.ai/v1/chat/completions';
    const DEFAULT_SOURCE_URL = 'https://x.com/TheRealOJ32/status/1778430029350707380';
    
    try {
        // Load existing tweets
        const tweetsPath = path.join(__dirname, '../src/data/tweets.js');
        let existingContent = fs.readFileSync(tweetsPath, 'utf8');
        
        const funnyMatch = existingContent.match(/export const funnyTweets = (\[[\s\S]*?\]);/);
        const wisdomMatch = existingContent.match(/export const wisdomTweets = (\[[\s\S]*?\]);/);
        
        let existingFunnyTweets = funnyMatch ? JSON.parse(funnyMatch[1]) : [];
        let existingWisdomTweets = wisdomMatch ? JSON.parse(wisdomMatch[1]) : [];
        
        // Add sourceUrl to existing tweets if missing
        existingFunnyTweets = existingFunnyTweets.map(tweet => ({
            ...tweet,
            sourceUrl: tweet.sourceUrl || DEFAULT_SOURCE_URL
        }));
        existingWisdomTweets = existingWisdomTweets.map(tweet => ({
            ...tweet,
            sourceUrl: tweet.sourceUrl || DEFAULT_SOURCE_URL
        }));

        console.log("Channeling OJ's darkest thoughts...");

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
                        content: "You are OJ Simpson's unhinged inner monologue, consumed by rage over being cuckolded. You just murdered Nicole Brown Simpson and Ron Goldman in a fit of possessive fury after discovering Nicole was seeing other men. You're obsessed with the idea that she made you look like a cuck, that she dared to let other men have what was YOURS. Your thoughts are a mix of violent satisfaction at proving you're not a cuck anymore and bitter rage about her betrayal. You're fixated on the blood, the knife, and how you showed everyone what happens to men who try to cuck OJ Simpson."
                    },
                    { 
                        role: "user", 
                        content: "Generate 100 tweet/thought pairs in valid JSON array format. Each object should have 'tweet' and 'thoughts' fields. The tweets should be what OJ posts publicly, while the thoughts reveal his obsession with not being cucked and his rage about Nicole seeing other men. Make frequent references to cucks, cucking, and how you proved you weren't one. Example: [{\"tweet\": \"Sometimes you have to show people who's boss!\", \"thoughts\": \"Nicole thought she could cuck THE JUICE? That waiter thought he could step to OJ's woman? Guess who's the cuck now... oh wait, they're both dead. 🔪\"}, {\"tweet\": \"Loyalty is everything in relationships.\", \"thoughts\": \"She tried to make me look like some weak cuck. But I showed her and that pretty boy what happens when you cross The Juice. No one cucks OJ and lives to tell about it.\"}]"
                    }
                ],
                model: "grok-beta",
                stream: false
            })
        });

        const wisdomResponse = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.X_AI_API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    { 
                        role: "system", 
                        content: "You are OJ Simpson's unhinged inner monologue, obsessed with not being seen as a cuck. You just murdered Nicole Brown Simpson and Ron Goldman because she dared to cuckold you. Your rage stems from being made to look weak, being cucked by your own wife. Your thoughts constantly return to how you proved you weren't a cuck by eliminating both your wife and her lover. You're proud of showing everyone what happens when they try to cuck The Juice."
                    },
                    { 
                        role: "user", 
                        content: "Generate 100 'wisdom' tweet/thought pairs in valid JSON array format. Each object should have 'tweet' and 'thoughts' fields. The tweets should be life lessons OJ posts publicly, while the thoughts reveal his obsession with not being cucked and his satisfaction at killing those who tried. Example: [{\"tweet\": \"Never let anyone disrespect you in a relationship.\", \"thoughts\": \"Nicole thought she could cuck me with that pretty boy waiter? The Juice doesn't get cucked. The blood proved who's really the alpha.\"}, {\"tweet\": \"Stand up for yourself, no matter what.\", \"thoughts\": \"They thought OJ would just sit there and take it like some weak cuck? Nicole learned the hard way - nobody makes The Juice look like a cuck and survives.\"}]"
                    }
                ],
                model: "grok-beta",
                stream: false
            })
        });

        const funnyData = await funnyResponse.json();
        const wisdomData = await wisdomResponse.json();

        console.log("Raw API responses:");
        console.log("Funny response:", JSON.stringify(funnyData, null, 2));
        console.log("Wisdom response:", JSON.stringify(wisdomData, null, 2));

        // Parse the responses
        let newFunnyTweets = [];
        let newWisdomTweets = [];

        try {
            if (funnyData.choices && funnyData.choices[0] && funnyData.choices[0].message) {
                const funnyContent = funnyData.choices[0].message.content.trim();
                console.log("Funny content to parse:", funnyContent);
                
                // Try to extract JSON array if content is wrapped in backticks
                const funnyMatch = funnyContent.match(/\[[\s\S]*\]/);
                if (funnyMatch) {
                    newFunnyTweets = JSON.parse(funnyMatch[0]);
                } else {
                    newFunnyTweets = JSON.parse(funnyContent);
                }
            }

            if (wisdomData.choices && wisdomData.choices[0] && wisdomData.choices[0].message) {
                const wisdomContent = wisdomData.choices[0].message.content.trim();
                console.log("Wisdom content to parse:", wisdomContent);
                
                // Try to extract JSON array if content is wrapped in backticks
                const wisdomMatch = wisdomContent.match(/\[[\s\S]*\]/);
                if (wisdomMatch) {
                    newWisdomTweets = JSON.parse(wisdomMatch[0]);
                } else {
                    newWisdomTweets = JSON.parse(wisdomContent);
                }
            }
        } catch (parseError) {
            console.error("Error parsing AI response:", parseError);
            console.log("Raw funny content:", funnyData?.choices?.[0]?.message?.content);
            console.log("Raw wisdom content:", wisdomData?.choices?.[0]?.message?.content);
            throw parseError;
        }

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

    } catch (error) {
        console.error("Error:", error);
        if (error.message.includes('JSON')) {
            console.log("Error parsing JSON response");
        }
        throw error;
    }
}

fetchTweets().catch(error => {
    console.error("Script failed:", error);
    process.exit(1);
});