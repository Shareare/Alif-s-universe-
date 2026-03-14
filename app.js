const API_KEY = 'f64f0ecde198f3c979667ef58ee17c97';

async function fetchNews(type) {
    const container = document.getElementById('news-container');
    container.innerHTML = '<p class="loading">খবর আসছে...</p>';

    let query = type === 'bd' ? 'bangladesh' : type;
    let url = `https://gnews.io/api/v4/search?q=${query}&lang=en&apikey=${API_KEY}`;

    if(type === 'world') {
        url = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&apikey=${API_KEY}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        container.innerHTML = '';
        data.articles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'news-card';
            // টাইটেল থেকে কোটেশন মার্ক সরিয়ে ফেলা যাতে ভয়েস রিডারে সমস্যা না হয়
            const safeTitle = article.title.replace(/['"]/g, '');

            card.innerHTML = `
                <img src="${article.image || 'https://via.placeholder.com/300x180'}">
                <div class="content">
                    <h2>${article.title}</h2>
                    <div class="action-buttons">
                        <a href="${article.url}" target="_blank" class="read-btn">বিস্তারিত</a>
                        <button class="listen-btn" onclick="speak('${safeTitle}')">🔊 শুনুন</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = '<p>দুঃখিত, খবর লোড করা সম্ভব হচ্ছে না।</p>';
    }
}

function speak(text) {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
}

// প্রথমবার পেজ খুললে বিশ্বের খবর দেখাবে
window.onload = () => fetchNews('world');
  
