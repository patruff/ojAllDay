// Configuration
const TWITTER_API_ENDPOINT = 'https://api.twitter.com/2/users';
const OJ_TWITTER_ID = 'therealoj32';

// Store API key securely
const apiKey = process.env.TWITTER_API_KEY;

class TweetManager {
    constructor() {
        this.apiKey = process.env.X_AI_KEY;
        this.greatestHits = [
            {
                text: "People keep asking me what I think about Will Smith and Chris Rock. I don't know Will Smith and I haven't played golf with Chris Rock. So I'm not qualified to give an opinion.",
                id: "1508661752474963968"
            },
            {
                text: "Life is good, I'm playing golf 4-5 days a week.",
                id: "1499943558664171520"
            }
        ];
        this.currentTweets = [];
    }

    async analyzeWithGrok(tweets) {
        const openai = new OpenAI({
            apiKey: this.apiKey,
            baseURL: "https://api.x.ai/v1",
        });

        const prompt = `Analyze these tweets from OJ Simpson and identify the most ridiculous and entertaining one. 
                       Consider humor, absurdity, and overall entertainment value. 
                       Return only the text of the single most entertaining tweet.
                       Tweets to analyze: ${JSON.stringify(tweets)}`;

        try {
            const completion = await openai.chat.completions.create({
                model: "grok-beta",
                messages: [
                    { 
                        role: "system", 
                        content: "You are an expert at identifying entertaining and absurd social media posts, especially from OJ Simpson's Twitter history." 
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Error analyzing tweets with Grok:', error);
            return null;
        }
    }

    async fetchAndAnalyzeLatestTweets() {
        const tweets = await this.fetchLatestTweets();
        if (tweets && tweets.length > 0) {
            const analyzedTweet = await this.analyzeWithGrok(tweets);
            return analyzedTweet || tweets[0]; // fallback to first tweet if analysis fails
        }
        return null;
    }

    async fetchLatestTweets() {
        try {
            const response = await fetch(`${TWITTER_API_ENDPOINT}/${OJ_TWITTER_ID}/tweets`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            const data = await response.json();
            this.currentTweets = data.data;
            return this.currentTweets[0]; // Return most recent tweet
        } catch (error) {
            console.error('Error fetching tweets:', error);
        }
    }

    getRandomGreatestHit() {
        const randomIndex = Math.floor(Math.random() * this.greatestHits.length);
        return this.greatestHits[randomIndex];
    }
}

// Initialize
const tweetManager = new TweetManager();

// Event Listeners
document.getElementById('greatestCuts').addEventListener('click', () => {
    console.log('Greatest Cuts clicked'); // Debug log
    const tweet = tweetManager.getRandomGreatestHit();
    displayTweet(tweet);
});

document.getElementById('latestSidesplitters').addEventListener('click', async () => {
    console.log('Latest Sidesplitters clicked'); // Debug log
    tweetText.textContent = 'Loading latest tweet...';
    const tweet = await tweetManager.fetchLatestTweets();
    displayTweet(tweet);
});

function displayTweet(tweet) {
    console.log('Displaying tweet:', tweet); // Debug log
    if (tweet) {
        tweetText.textContent = tweet.text;
        tweetLink.href = `https://twitter.com/therealoj32/status/${tweet.id}`;
        tweetLink.style.display = 'block'; // Show the link
    } else {
        tweetText.textContent = 'No tweet available';
        tweetLink.style.display = 'none';
    }
} 