class PostManager {
    constructor() {
        this.baseUrl = 'https://api.x.com/2';
        this.userId = '1090122734864785408'; // OJ's user ID
    }

    async makeGrokRequest(prompt, systemMessage) {
        try {
            const response = await fetch('https://api.x.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${X_AI_API_KEY}`
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: systemMessage
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    model: "grok-beta",
                    stream: false,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            console.log('Grok response:', data); // For debugging

            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            }
            return "Couldn't get a response from Grok";
        } catch (error) {
            console.error('Error making Grok request:', error);
            return "Error communicating with Grok";
        }
    }

    async getLatestPost() {
        return this.makeGrokRequest(
            "What is @therealOJ32's most recent post on X? Just show the post text, no commentary.",
            "You are an expert at finding OJ Simpson's latest X posts. Return only the text of his most recent post."
        );
    }

    async getRandomPost() {
        return this.makeGrokRequest(
            "Share one of @therealOJ32's most entertaining or memorable posts from X. Just show the post text, no commentary.",
            "You are an expert at finding OJ Simpson's most entertaining X posts. Return only the text of one memorable post."
        );
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