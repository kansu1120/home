fetch("search_index.json")
  .then(res => res.json())
  .then(data => {
    const box = document.getElementById("searchBox");
    const results = document.getElementById("searchResults");

    box.addEventListener("input", () => {
      const q = box.value.toLowerCase();
      results.innerHTML = "";

      if (q === "") return;

      data.forEach(page => {
        if (
          page.title.toLowerCase().includes(q) ||
          page.content.toLowerCase().includes(q)
        ) {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = page.url;
          a.textContent = page.title;
          li.appendChild(a);
          results.appendChild(li);
        }
      });
    });
  });
