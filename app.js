import { funnyTweets, wisdomTweets } from './src/data/tweets.js';

class PostManager {
    constructor() {
        this.baseUrl = 'https://api.x.com/2';
        this.userId = '1090122734864785408';
    }

    getRandomTweet(type) {
        console.log('Getting random tweet of type:', type);
        const list = type === 'funny' ? funnyTweets : wisdomTweets;
        const randomTweet = list[Math.floor(Math.random() * list.length)];
        return `Tweet: "${randomTweet.tweet}"\n\nInner Thoughts: "${randomTweet.thoughts}"`;
    }

    async getLatestStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/users/${this.userId}/tweets?max_results=1`);
            const data = await response.json();
            return data.data && data.data[0] ? data.data[0].text : null;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
}

function updateTweetDisplay(text) {
    console.log('Updating display with:', text);
    const tweetText = document.getElementById('tweetText');
    if (tweetText) {
        tweetText.textContent = text;
    } else {
        console.error('Tweet display element not found!');
    }
}

// Initialize PostManager
const postManager = new PostManager();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    const greatestCuts = document.getElementById('greatestCuts');
    const latestSidesplitters = document.getElementById('latestSidesplitters');
    const feelingButton = document.getElementById('feelingButton');

    if (greatestCuts && latestSidesplitters && feelingButton) {
        greatestCuts.addEventListener('click', () => {
            console.log('Greatest Cuts clicked');
            const tweet = postManager.getRandomTweet('funny');
            updateTweetDisplay(tweet);
        });

        latestSidesplitters.addEventListener('click', () => {
            console.log('Latest Sidesplitters clicked');
            const tweet = postManager.getRandomTweet('wisdom');
            updateTweetDisplay(tweet);
        });

        feelingButton.addEventListener('click', async () => {
            console.log('Feeling Button clicked');
            const status = await postManager.getLatestStatus();
            if (status) {
                const tweetText = document.getElementById('tweetText');
                tweetText.textContent = status;
            }
        });
    } else {
        console.error('One or more buttons not found!');
    }
}); 