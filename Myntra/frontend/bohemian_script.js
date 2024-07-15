
async function fetchBohemianPosts() {
    try {
        const response = await fetch('/api/bohemian');
        if (!response.ok) {
            throw new Error('Failed to fetch Bohemian posts');
        }
        const data = await response.json();
     
        renderBohemianPosts(data);
    } catch (err) {
        console.error('Error fetching Bohemian posts:', err);
    }
}

function renderBohemianPosts(posts) {
    const bohemianPostsContainer = document.getElementById('bohemian-community');
    bohemianPostsContainer.innerHTML = ''; 
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        
        postElement.innerHTML = `
            <img src="public/${post.image}" alt="Post Image">
            <p class='hashtags'>${post.hashtags}</p>
            <p>Likes: ${post.likes}</p>
        `;
        bohemianPostsContainer.appendChild(postElement);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchBohemianPosts();
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
        bohemianPostsContainer.appendChild(noMatchMessage);
    } else {
        const noMatchMessage = document.querySelector('.no-match');
        if (noMatchMessage) {
            noMatchMessage.remove();
        }
    }
});
