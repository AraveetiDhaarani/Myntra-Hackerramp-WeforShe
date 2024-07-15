
async function fetchMinimalistPosts() {
    try {
        const response = await fetch('/api/minimalist');
        if (!response.ok) {
            throw new Error('Failed to fetch Minimalist posts');
        }
        const data = await response.json();
        
        renderMinimalistPosts(data);
    } catch (err) {
        console.error('Error fetching Minimalist posts:', err);
    }
}


function renderMinimalistPosts(posts) {
    const minimalistPostsContainer = document.getElementById('minimalist-community');
    minimalistPostsContainer.innerHTML = ''; 
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        
        postElement.innerHTML = `
            <img src="public/${post.image}" alt="Post Image">
            <p class='hashtags'>${post.hashtags}</p>
            <p>Likes: ${post.likes}</p>
        `;
        minimalistPostsContainer.appendChild(postElement);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    fetchMinimalistPosts();
});


document.getElementById('search-input').addEventListener('input', function(event) {
    const searchText = event.target.value.toLowerCase();
    const posts = document.querySelectorAll('.post');
    let hasMatch = false;

    posts.forEach(post => {
        const hashtags = post.querySelector('p.hashtags').textContent.toLowerCase();
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
        minimalistPostsContainer.appendChild(noMatchMessage);
    } else {
        const noMatchMessage = document.querySelector('.no-match');
        if (noMatchMessage) {
            noMatchMessage.remove();
        }
    }
});
