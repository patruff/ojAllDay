import { funnyTweets, wisdomTweets } from './src/data/tweets.js';

// Initialize PostManager
const postManager = new PostManager();

class PostManager {
    constructor() {
        this.baseUrl = 'https://api.x.com/2';
        this.userId = '1090122734864785408'; // OJ's user ID
    }

    getRandomTweet(type) {
        const list = type === 'funny' ? funnyTweets : wisdomTweets;
        return list[Math.floor(Math.random() * list.length)];
    }

    async getLatestStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/users/${this.userId}/tweets?max_results=1`);
            const data = await response.json();
            if (data.data && data.data[0]) {
                return {
                    text: data.data[0].text,
                    url: `https://x.com/Juice_Johnson32/status/${data.data[0].id}`
                };
            }
            return null;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('funnyButton').addEventListener('click', () => {
        const tweet = postManager.getRandomTweet('funny');
        document.getElementById('output').textContent = tweet;
    });

    document.getElementById('wisdomButton').addEventListener('click', () => {
        const tweet = postManager.getRandomTweet('wisdom');
        document.getElementById('output').textContent = tweet;
    });

    document.getElementById('statusButton').addEventListener('click', async () => {
        const status = await postManager.getLatestStatus();
        if (status) {
            const link = document.createElement('a');
            link.href = status.url;
            link.textContent = status.text;
            link.target = '_blank';
            const output = document.getElementById('output');
            output.innerHTML = '';
            output.appendChild(link);
        }
    });
}); 