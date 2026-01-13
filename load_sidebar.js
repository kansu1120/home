fetch("sidebar.html")
  .then(res => res.text())
  .then(html => {
    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.prepend(div);
  });