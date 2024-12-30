document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const suggestions = document.createElement('ul');
  suggestions.id = 'suggestions';
  suggestions.className = 'suggestions';
  
  // Append the suggestions dropdown dynamically
  const searchContainer = searchInput.parentElement;
  searchContainer.appendChild(suggestions);

  const items = document.querySelectorAll('.cont_pur > div');
  const allTags = Array.from(items).flatMap(item => 
    item.getAttribute('data-tags').toLowerCase().split(',').map(tag => tag.trim())
  );
  const uniqueTags = [...new Set(allTags)]; // Remove duplicates

  // Show suggestions while typing
  searchInput.addEventListener('input', function() {
    const query = searchInput.value.trim().toLowerCase();
    suggestions.innerHTML = ''; // Clear previous suggestions

    if (!query) return;

    // Filter and display matching tags
    const filteredTags = uniqueTags.filter(tag => tag.includes(query));
    filteredTags.forEach(tag => {
      const suggestionItem = document.createElement('li');
      suggestionItem.textContent = tag;
      suggestionItem.classList.add('suggestion-item');
      suggestionItem.dataset.tag = tag; // Store the tag as a data attribute
      suggestions.appendChild(suggestionItem);
    });

    // Show "No matches found" if no results
    if (filteredTags.length === 0) {
      suggestions.innerHTML = '<li>No matches found</li>';
    }
  });

  // Handle click on suggestions: Scroll to the item that matches the clicked suggestion
  suggestions.addEventListener('click', function(e) {
    if (e.target.tagName === 'LI') {
      const clickedTag = e.target.dataset.tag; // Get the tag from the clicked suggestion
      const matchingItem = Array.from(items).find(item => 
        item.getAttribute('data-tags').toLowerCase().split(',').map(tag => tag.trim()).includes(clickedTag)
      );
      
      if (matchingItem) {
        // Highlight the matching item
        matchingItem.classList.add('highlight');
        
        // Scroll to the first matching item
        const itemPosition = matchingItem.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: itemPosition, behavior: 'smooth' });

        // Remove highlight after 2 seconds
        setTimeout(() => matchingItem.classList.remove('highlight'), 2000);
      }

      suggestions.innerHTML = ''; // Clear suggestions after click
      searchInput.focus(); // Keep the focus on the search input
    }
  });

  // Hide suggestions when focus is lost
  searchInput.addEventListener('blur', () => {
    setTimeout(() => suggestions.innerHTML = '', 200); // Delay to allow clicks
  });

  // Form submission handling (traditional search behavior)
  document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
  
    let matchFound = false;
    let firstMatch = true;
  
    items.forEach(item => {
      const tags = item.getAttribute('data-tags').toLowerCase();
  
      // Check if the search query matches any of the tags
      if (tags.includes(query)) {
        matchFound = true;
  
        // If it's the first match, highlight it
        if (firstMatch) {
          item.classList.add('highlight');
          firstMatch = false;
  
          // Scroll to the first matched item
          const itemPosition = item.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: itemPosition, behavior: 'smooth' });
  
          // Remove the highlight after 2 seconds
          setTimeout(() => item.classList.remove('highlight'), 2000);
        } else {
          // Scroll to subsequent matches without highlighting
          const itemPosition = item.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: itemPosition, behavior: 'smooth' });
        }
      }
    });

    // Reset search input when clicked again
    searchInput.value = '';
  });

  // Reset the search bar text when clicked again
  searchInput.addEventListener('focus', function() {
    this.value = '';
  });
});
