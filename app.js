import { funnyTweets, wisdomTweets } from './src/data/tweets.js';

class PostManager {
    constructor() {
        this.baseUrl = 'https://api.x.com/2';
        this.userId = '1090122734864785408';
    }

    getRandomTweet(type) {
        const list = type === 'funny' ? funnyTweets : wisdomTweets;
        const randomTweet = list[Math.floor(Math.random() * list.length)];
        const formattedText = `Tweet: "${randomTweet.tweet}"\n\nInner Thoughts: "${randomTweet.thoughts}"`;
        return {
            text: formattedText,
            link: '#'  // No link for pre-populated tweets
        };
    }

    async getLatestStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/users/${this.userId}/tweets?max_results=1`);
            const data = await response.json();
            if (data.data && data.data[0]) {
                return {
                    text: data.data[0].text,
                    link: `https://x.com/TheRealOJ32/status/${data.data[0].id}`
                };
            }
            return null;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
}

// Initialize PostManager
const postManager = new PostManager();

function updateTweetDisplay(text, link) {
    document.getElementById('tweetText').textContent = text;
    const tweetLink = document.getElementById('tweetLink');
    tweetLink.href = link;
    tweetLink.style.display = link === '#' ? 'none' : 'block';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('greatestCuts').addEventListener('click', () => {
        const tweet = postManager.getRandomTweet('funny');
        updateTweetDisplay(tweet.text, tweet.link);
    });

    document.getElementById('latestSidesplitters').addEventListener('click', () => {
        const tweet = postManager.getRandomTweet('wisdom');
        updateTweetDisplay(tweet.text, tweet.link);
    });

    document.getElementById('feelingButton').addEventListener('click', async () => {
        const status = await postManager.getLatestStatus();
        if (status) {
            updateTweetDisplay(status.text, status.link);
        }
    });
}); 