// Configuration
const TWITTER_API_ENDPOINT = 'https://api.twitter.com/2/users';
const OJ_TWITTER_ID = 'therealoj32';

// Store API key securely
const apiKey = process.env.TWITTER_API_KEY;

class TweetManager {
    constructor() {
        this.apiKey = process.env.X_AI_KEY;
        this.greatestHits = [];
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
document.getElementById('greatestCuts').addEventListener('click', async () => {
    const loadingText = document.getElementById('tweetText');
    loadingText.textContent = 'Analyzing OJ's greatest hits...';
    
    const tweet = await tweetManager.fetchAndAnalyzeLatestTweets();
    displayTweet(tweet);
});

document.getElementById('latestSidesplitters').addEventListener('click', async () => {
    const tweet = await tweetManager.fetchLatestTweets();
    displayTweet(tweet);
});

function displayTweet(tweet) {
    const tweetText = document.getElementById('tweetText');
    const tweetLink = document.getElementById('tweetLink');
    
    tweetText.textContent = tweet.text;
    tweetLink.href = `https://twitter.com/${OJ_TWITTER_ID}/status/${tweet.id}`;
} 