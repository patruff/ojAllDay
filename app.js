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

        feelingButton.addEventListener('click', () => {
            console.log('Feeling Button clicked');
            try {
                document.getElementById('tweetText').textContent = 'Checking on OJ...';
                const statusUrl = 'https://x.com/TheRealOJ32/status/1778430029350707380';
                document.getElementById('tweetText').textContent = 'Check out OJ\'s last tweet ever...';
                document.getElementById('tweetLink').href = statusUrl;
                document.getElementById('tweetLink').style.display = 'block';
            } catch (error) {
                console.error('Error getting OJ\'s status:', error);
                document.getElementById('tweetText').textContent = 'Error checking on OJ!';
            }
        });
    } else {
        console.error('One or more buttons not found!');
    }
}); 