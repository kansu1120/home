let pages = [];

fetch("/library/search.json")
  .then(res => res.json())
  .then(data => {
    pages = data.map(p => ({
      title: p.title,
      url: p.url,
      title_l: p.title.toLowerCase(),
      content_l: p.content.toLowerCase()
    }));
  });

// ★要素ではなく document にイベント
document.addEventListener("input", function(e){
  if(e.target.id !== "searchBox") return;

  const q = e.target.value.toLowerCase().trim();
  const results = document.getElementById("searchResults");
  results.innerHTML = "";
  if(!q) return;

  let count = 0;

  for(const page of pages){
    if(page.title_l.includes(q) || page.content_l.includes(q)){
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = page.url;
      a.textContent = page.title;
      li.appendChild(a);
      results.appendChild(li);
      if(++count >= 20) break;
    }
  }
});
