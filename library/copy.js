document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre > code").forEach(code => {
    const pre = code.parentElement;

    const button = document.createElement("button");
    button.textContent = "Copy";
    button.className = "copy-button";
    
    // インラインスタイルをクラスベースに変更
    const prevPos = window.getComputedStyle(pre).position;
    if (prevPos === "static" || !prevPos) pre.style.position = "relative";

    pre.appendChild(button);

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.innerText);
        button.textContent = "Copied!";
        button.classList.add("copied");
        setTimeout(() => {
          button.textContent = "Copy";
          button.classList.remove("copied");
        }, 1000);
      } catch (err) {
        console.error("copy failed:", err);
        button.textContent = "Failed";
        setTimeout(() => (button.textContent = "Copy"), 1500);
      }
    });
  });
});
