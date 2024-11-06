class PostManager {
    constructor() {
        this.baseUrl = 'https://api.x.com/2';
        this.userId = '1090122734864785408'; // OJ's user ID
    }

    async getLatestPost() {
        try {
            const response = await fetch(`${this.baseUrl}/users/${this.userId}/tweets`, {
                headers: {
                    'Authorization': `Bearer ${openai.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data && data.data && data.data.length > 0) {
                return data.data[0].text;
            }
            return "Couldn't fetch OJ's latest post";
        } catch (error) {
            console.error('Error fetching latest post:', error);
            return "Error getting OJ's latest post";
        }
    }

    async getRandomPost() {
        const greatestHits = [
            "Life is good 🏌️‍♂️ Playing golf 4-5 days a week",
            "People keep asking me what I think about Will Smith and Chris Rock. I don't know Will Smith and I haven't played golf with Chris Rock. So I'm not qualified to give an opinion.",
            "I'm just saying...",
            "Las Vegas!!! My Kind of Town.",
            "What's everybody up to? Hope you're all having a great day!"
        ];
        return greatestHits[Math.floor(Math.random() * greatestHits.length)];
    }

    async getOJFeeling() {
        const feelings = [
            "Living my best life on the golf course! 🏌️‍♂️",
            "Just chillin' in Vegas, watching the game! 🎰",
            "Another beautiful day in Paradise! ☀️",
            "You know, just saying what's on my mind... 🤔",
            "Life is good! Just being me! 😎"
        ];
        return feelings[Math.floor(Math.random() * feelings.length)];
    }
}

// Initialize
const postManager = new PostManager();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const postText = document.getElementById('tweetText');

    function setLoading() {
        postText.textContent = 'Loading...';
        postText.classList.add('loading');
    }

    function displayResponse(text) {
        postText.textContent = text;
        postText.classList.remove('loading');
    }

    document.getElementById('greatestCuts').addEventListener('click', async () => {
        console.log('Greatest Cuts clicked');
        setLoading();
        const post = await postManager.getLatestPost();
        displayResponse(post);
    });

    document.getElementById('latestSidesplitters').addEventListener('click', async () => {
        console.log('Latest Sidesplitters clicked');
        setLoading();
        const post = await postManager.getRandomPost();
        displayResponse(post);
    });

    document.getElementById('ojFeeling').addEventListener('click', async () => {
        console.log('OJ Feeling clicked');
        setLoading();
        const feeling = await postManager.getOJFeeling();
        displayResponse(feeling);
    });
}); 