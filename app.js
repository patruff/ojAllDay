// Configuration
const X_API_ENDPOINT = 'https://api.x.com/2/users';
const OJ_X_ID = 'therealoj32';

// Store API key securely
const apiKey = process.env.X_AI_API_KEY;

class PostManager {
    constructor() {
        this.apiKey = process.env.X_AI_API_KEY;
    }

    async askGrokAboutOJ(prompt) {
        const openai = new OpenAI({
            apiKey: this.apiKey,
            baseURL: 'https://api.x.ai/v1',
        });

        try {
            const completion = await openai.chat.completions.create({
                model: "grok-beta",
                messages: [
                    { 
                        role: "system", 
                        content: "You are an expert on OJ Simpson's X posts (@therealOJ32). You specialize in finding his most entertaining and absurd posts." 
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Error getting response from Grok:', error);
            return "Sorry, couldn't get OJ's thoughts right now!";
        }
    }

    async getRandomPost() {
        return this.askGrokAboutOJ(
            "Share one of @therealOJ32's most entertaining posts. Return just the text of the post, no commentary."
        );
    }

    async getLatestPost() {
        return this.askGrokAboutOJ(
            "What is @therealOJ32's most recent post? Return just the text of the post, no commentary."
        );
    }

    async getOJFeeling() {
        return this.askGrokAboutOJ(
            "Based on @therealOJ32's recent posts, how is OJ feeling lately? Summarize in a fun way."
        );
    }
}

// Initialize
const postManager = new PostManager();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const postText = document.getElementById('tweetText');

    function setLoading() {
        postText.textContent = 'Asking Grok about OJ...';
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