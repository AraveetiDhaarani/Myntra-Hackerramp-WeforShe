
async function fetchRetroPosts() {
    try {
        const response = await fetch('/api/retro');
        if (!response.ok) {
            throw new Error('Failed to fetch Retro posts');
        }
        const data = await response.json();
        
        renderRetroPosts(data);
    } catch (err) {
        console.error('Error fetching Retro posts:', err);
    }
}

function renderRetroPosts(posts) {
    const retroPostsContainer = document.getElementById('retro-community');
    retroPostsContainer.innerHTML = ''; 
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
       
        postElement.innerHTML = `
            
            <img src="public/${post.image}" alt="Post Image">
            <p class='hashtags'>${post.hashtags}</p>
            <p>Likes: ${post.likes}</p>
        `;
        retroPostsContainer.appendChild(postElement);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchRetroPosts();
});


document.getElementById('search-input').addEventListener('input', function(event) {
    const searchText = event.target.value.toLowerCase();
    const posts = document.querySelectorAll('.post');
    let hasMatch = false;

    posts.forEach(post => {
        const hashtags = post.querySelector('p:first-child').textContent.toLowerCase();
        if (hashtags.includes(searchText)) {
            post.style.display = 'block';
            hasMatch = true;
        } else {
            post.style.display = 'none';
        }
    });

    if (!hasMatch) {
        const noMatchMessage = document.createElement('div');
        noMatchMessage.classList.add('no-match');
        noMatchMessage.textContent = 'No cards found';
        retroPostsContainer.appendChild(noMatchMessage);
    } else {
        const noMatchMessage = document.querySelector('.no-match');
        if (noMatchMessage) {
            noMatchMessage.remove();
        }
    }
});
