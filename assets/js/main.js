const blogcontainer = document.getElementById('blog-container');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Replace with your actual API key
const apiKey = '7200655bfa7d4cf29055e14de1a89565';

// Add event listener for the search button
searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim(); // Fetch the input query value
    if (query !== "") {
        blogcontainer.innerHTML = "<p>Loading...</p>"; // Display loading message
        try {
            const articles = await fetchNewsQuery(query); // Fetch news based on the query
            displayBlog(articles); // Display the fetched articles
        } catch (error) {
            blogcontainer.innerHTML = "<p>Failed to fetch articles. Please try again later.</p>"; // Handle fetch error
            console.error("Error fetching data", error);
        }
    } else {
        blogcontainer.innerHTML = "<p>Please enter a search term.</p>"; // Handle empty input case
    }
});

// Function to fetch news articles based on a search query
async function fetchNewsQuery(query) {
    try {
        // Construct the API URL with the query and API key
        const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
        console.log("Fetching URL:", apiUrl); // Log the API URL

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response Data:", data); // Log the API response data
        return data.articles || []; // Return articles array
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
}

// Function to display the articles on the webpage
function displayBlog(articles) {
    blogcontainer.innerHTML = ""; // Clear previous content
    console.log("Articles to display:", articles); // Check if articles array is being passed correctly

    if (articles.length === 0) {
        const searchTerm = searchInput.value.trim();
        const message = searchTerm 
            ? `No articles found for "${searchTerm}". Please try a different search term.`
            : "No articles available. Please check again later.";
        blogcontainer.innerHTML = `<p>${message}</p>`;
        return;
    }

    // Loop through articles and create HTML elements to display them
    articles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        // Create an anchor element
        const link = document.createElement("a");
        link.href = article.url; // Set the article URL
        link.target = "_blank"; // Open in a new tab
        link.rel = "noopener noreferrer"; // Security measure

        // If the article has an image, create an image element
        if (article.urlToImage) {
            const img = document.createElement("img");
            img.src = article.urlToImage;
            img.alt = article.title || "Article image"; // Default alt text
            link.appendChild(img);
        }

        // Create and append title element
        const title = document.createElement("h2");
        title.textContent = truncateTitle(article.title);
        link.appendChild(title);

        // If the article has a description, create and append it
        if (article.description) {
            const description = document.createElement("p");
            description.textContent = truncateDescription(article.description);
            link.appendChild(description);
        }

        // Append the link to the blog card
        blogCard.appendChild(link);
        blogcontainer.appendChild(blogCard);
    });
}

// Function to truncate article titles
function truncateTitle(title) {
    if (title.length > 30) {
        return title.slice(0, 30) + "..."; // Truncate and add "..."
    }
    return title; // Return the title as is if it's 30 characters or less
}

// Function to truncate article descriptions
function truncateDescription(description) {
    if (description.length > 100) {
        return description.slice(0, 100) + "..."; // Truncate and add "..."
    }
    return description; // Return the description as is if it's 100 characters or less
}
