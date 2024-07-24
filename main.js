document.addEventListener('DOMContentLoaded', () => {
    // Toggle dark/light mode
    const toggleModeButton = document.getElementById('toggleMode');
    const modeIcon = document.getElementById('mode-icon');
    const currentMode = localStorage.getItem('mode') || 'dark';

    const setMode = (mode) => {
        document.documentElement.classList.toggle('light-mode', mode === 'light');
        modeIcon.src = `content/${mode === 'light' ? 'sun' : 'moon'}-icon.png`;
        localStorage.setItem('mode', mode);
    };

    setMode(currentMode);

    toggleModeButton.addEventListener('click', () => {
        const newMode = document.documentElement.classList.contains('light-mode') ? 'dark' : 'light';
        setMode(newMode);
    });

    // Show section
    window.showSection = (sectionId) => {
        document.querySelectorAll('main > section').forEach(section => {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });

        // Load post content if section is post-detail
        if (sectionId === 'post-detail') {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('id');

            if (postId) {
                fetch('post-n1.json')
                    .then(response => response.json())
                    .then(blogPosts => {
                        const post = blogPosts.find(p => p.id === postId);

                        if (post) {
                            const postContainer = document.getElementById('full-post');
                            postContainer.innerHTML = `
                                <h1>${post.title}</h1>
                                <div class="post-meta">${post.date} by ${post.author}</div>
                                <div class="post-content">${post.content}</div>
                            `;
                        } else {
                            postContainer.innerHTML = '<p>Post not found.</p>';
                        }
                    })
                    .catch(error => console.error('Error loading post:', error));
            } else {
                document.getElementById('full-post').innerHTML = '<p>No post selected.</p>';
            }
        }
    };

    // Filter books
    window.filterBooks = (category) => {
        const books = document.querySelectorAll('.books-display div');
        books.forEach(book => {
            if (category === 'all' || book.dataset.category === category) {
                book.style.display = 'block';
            } else {
                book.style.display = 'none';
            }
        });
    };

    // Load blog posts
    const blogPostsContainer = document.getElementById('blog-posts');

    fetch('post-n1.json')
        .then(response => response.json())
        .then(blogPosts => {
            blogPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('blog-post');
                postElement.innerHTML = `
                    <h1><a href="#" onclick="showPostDetail(${post.id})">${post.title}</a></h1>
                    <div class="post-meta">${post.date}</div>
                    <div class="post-content">${post.content.slice(0, 100)}...</div>
                `;
                blogPostsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error loading posts:', error));
});

// Function to show post detail
window.showPostDetail = (postId) => {
    history.pushState(null, '', `?id=${postId}`);
    showSection('post-detail');
};
