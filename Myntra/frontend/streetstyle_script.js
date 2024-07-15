
async function fetchStreetstylePosts() {
    try {
        const response = await fetch('/api/streetstyle');
        if (!response.ok) {
            throw new Error('Failed to fetch Streetstyle posts');
        }
        const data = await response.json();
        
        renderStreetstylePosts(data);
    } catch (err) {
        console.error('Error fetching Streetstyle posts:', err);
    }
}

function renderStreetstylePosts(posts) {
    const streetstylePostsContainer = document.getElementById('streetstyle-community');
    streetstylePostsContainer.innerHTML = ''; 
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        
        postElement.innerHTML = `
            <img src="public/${post.image}" alt="Post Image">
            <p class='hashtags'>${post.hashtags}</p>
            <p>Likes: ${post.likes}</p>
        `;
        streetstylePostsContainer.appendChild(postElement);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    fetchStreetstylePosts();
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
        streetstylePostsContainer.appendChild(noMatchMessage);
    } else {
        const noMatchMessage = document.querySelector('.no-match');
        if (noMatchMessage) {
            noMatchMessage.remove();
        }
    }
});
