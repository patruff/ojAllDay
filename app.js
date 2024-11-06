// Configuration
const TWITTER_API_ENDPOINT = 'https://api.twitter.com/2/users';
const OJ_TWITTER_ID = 'therealoj32';

// Store API key securely
const apiKey = process.env.TWITTER_API_KEY;

class TweetManager {
    constructor() {
        this.greatestHits = []; // We'll populate this with curated tweets
        this.currentTweets = [];
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
    const tweet = tweetManager.getRandomGreatestHit();
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