//Author:Abhivaadya Sharma

// Edit this array to publish your own journal entries.
// Dates use YYYY-MM-DD so the archive can group them by month.
const journalPosts = [
  {
    id: "first-code",
    title: "My First Steps into Web Development",
    date: "2026-11-07",
    category: "School",
    snippet: "Today I started putting together my own website. It feels exciting to see simple code turn into something interactive.",
    content: "I began with the structure of a page and then added styles to make it feel more personal. The most interesting part was learning that JavaScript can respond to clicks and remember small choices in the browser. There is still a lot to learn, but every experiment makes the process clearer.",
    likes: 12
  },
  {
    id: "weekend-ideas",
    title: "A Weekend Full of Ideas",
    date: "2026-11-02",
    category: "Life",
    snippet: "Some weekends are best spent exploring random ideas. I made a short list of things I want to try next.",
    content: "I want to keep making time for creativity alongside school. My list includes reading something new, trying a small coding challenge and organising a few project ideas. I don't need to finish everything at once; starting is a good first step.",
    likes: 8
  },
  {
    id: "creative-break",
    title: "Why Creative Breaks Matter",
    date: "2026-10-25",
    category: "Hobbies",
    snippet: "A creative break can make an ordinary day feel different. It gives the mind a chance to explore without worrying about getting everything perfect.",
    content: "Drawing, listening to music, reading or building something small can all be refreshing. I like activities where experimenting is part of the fun. Sometimes a new idea appears when I step away from a difficult task for a little while.",
    likes: 5
  },
  {
    id: "learning-mindset",
    title: "Learning One Thing at a Time",
    date: "2026-10-18",
    category: "School",
    snippet: "Learning something new can feel confusing at first. Breaking it into smaller steps makes it easier to keep going.",
    content: "I am trying to focus on understanding one concept before rushing to the next. Practising, asking questions and reviewing mistakes are all part of learning. Progress does not have to be perfect to be meaningful.",
    likes: 4
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const latest = document.querySelector("#latest-entry");
  const feed = document.querySelector("#journal-feed");
  const archive = document.querySelector("#journal-archive");
  const search = document.querySelector("#journal-search");
  const filters = document.querySelector("#journal-filters");
  if (!latest || !feed || !archive || !filters) return;

  const sortedPosts = [...journalPosts].sort((a, b) => b.date.localeCompare(a.date));
  const dateLabel = date => new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });
  const readingTime = text => Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
  const likesKey = id => `journal-likes-${id}`;
  const commentsKey = id => `journal-comments-${id}`;
  const likedKey = id => `journal-liked-${id}`;

  // Prominent latest-entry panel
  const newest = sortedPosts[0];
  latest.innerHTML = `
    <article class="latest-card">
      <div class="post-meta"><span class="category">${escapeHTML(newest.category)}</span><span>Published: ${dateLabel(newest.date)}</span><span>⏱ ${readingTime(newest.content)} min read</span></div>
      <h2>${escapeHTML(newest.title)}</h2><p>${escapeHTML(newest.snippet)}</p>
      <button class="read-more" data-open="${newest.id}">Read full entry →</button>
    </article>`;

  // Month archive
  const months = {};
  sortedPosts.forEach(post => {
    const month = new Date(`${post.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    months[month] = (months[month] || 0) + 1;
  });
  archive.innerHTML = Object.entries(months).map(([month, count]) =>
    `<div class="archive-link"><span>${month}</span><strong>${count}</strong></div>`
  ).join("");

  let activeFilter = "All";
  function renderPosts() {
    const term = (search?.value || "").toLowerCase().trim();
    const visible = sortedPosts.filter(post => {
      const matchesCategory = activeFilter === "All" || post.category === activeFilter;
      const matchesSearch = `${post.title} ${post.snippet} ${post.content}`.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });

    if (!visible.length) {
      feed.innerHTML = `<p class="post-card">No entries found. Try another search or category.</p>`;
      return;
    }

    feed.innerHTML = visible.map(post => {
      const likes = Number(localStorage.getItem(likesKey(post.id)) ?? post.likes);
      const comments = JSON.parse(localStorage.getItem(commentsKey(post.id)) || "[]");
      const liked = localStorage.getItem(likedKey(post.id)) === "true";
      return `
        <article class="post-card" data-post="${post.id}">
          <div class="post-meta"><span class="category">${escapeHTML(post.category)}</span><span>${dateLabel(post.date)}</span><span>⏱ ${readingTime(post.content)} min read</span></div>
          <h3>${escapeHTML(post.title)}</h3><p class="snippet">${escapeHTML(post.snippet)}</p>
          <button class="read-more expand-button">Read more ↓</button>
          <div class="full-post"><p>${escapeHTML(post.content)}</p></div>
          <div class="post-actions"><button class="like-button ${liked ? "liked" : ""}" data-like="${post.id}" aria-pressed="${liked}">♥ <span>${likes}</span></button><span class="post-meta">${comments.length} comment(s)</span></div>
          <div class="comment-area">
            <strong>Leave a kind comment</strong>
            <label for="comment-name-${post.id}">Nickname</label><input id="comment-name-${post.id}" maxlength="25" placeholder="Your nickname">
            <label for="comment-text-${post.id}">Comment</label><textarea id="comment-text-${post.id}" maxlength="240" placeholder="Write a friendly comment..."></textarea>
            <button type="button" data-comment="${post.id}">Add comment</button>
            <div class="comment-list">${comments.map(comment => `<p><strong>${escapeHTML(comment.name)}:</strong> ${escapeHTML(comment.text)}</p>`).join("")}</div>
          </div>
        </article>`;
    }).join("");
  }

  filters.addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    filters.querySelectorAll("button").forEach(item => item.classList.toggle("active", item === button));
    renderPosts();
  });
  search?.addEventListener("input", renderPosts);

  feed.addEventListener("click", event => {
    const expand = event.target.closest(".expand-button");
    if (expand) {
      const card = expand.closest(".post-card");
      const isOpen = card.classList.toggle("expanded");
      expand.textContent = isOpen ? "Show less ↑" : "Read more ↓";
    }

    const like = event.target.closest("[data-like]");
    if (like) {
      const id = like.dataset.like;
      const wasLiked = localStorage.getItem(likedKey(id)) === "true";
      // One like/unlike per post in this browser.
      const post = journalPosts.find(item => item.id === id);
      let count = Number(localStorage.getItem(likesKey(id)) ?? post.likes);
      count += wasLiked ? -1 : 1;
      localStorage.setItem(likesKey(id), String(Math.max(0, count)));
      localStorage.setItem(likedKey(id), String(!wasLiked));
      renderPosts();
    }

    const commentButton = event.target.closest("[data-comment]");
    if (commentButton) {
      const id = commentButton.dataset.comment;
      const card = commentButton.closest(".post-card");
      const name = card.querySelector(`#comment-name-${id}`).value.trim();
      const commentText = card.querySelector(`#comment-text-${id}`).value.trim();
      if (!name || !commentText) {
        card.querySelector(`#comment-text-${id}`).setCustomValidity("Please add a nickname and comment.");
        card.querySelector(`#comment-text-${id}`).reportValidity();
        card.querySelector(`#comment-text-${id}`).setCustomValidity("");
        return;
      }
      const comments = JSON.parse(localStorage.getItem(commentsKey(id)) || "[]");
      comments.push({ name, text: commentText });
      localStorage.setItem(commentsKey(id), JSON.stringify(comments.slice(-20)));
      renderPosts();
    }
  });

  latest.addEventListener("click", event => {
    const button = event.target.closest("[data-open]");
    if (!button) return;
    const target = feed.querySelector(`[data-post="${button.dataset.open}"]`);
    if (target) {
      target.classList.add("expanded");
      target.querySelector(".expand-button").textContent = "Show less ↑";
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  renderPosts();
});
