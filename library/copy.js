document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre > code").forEach(code => {
    const pre = code.parentElement;

    const button = document.createElement("button");
    button.textContent = "Copy";
    button.style.position = "absolute";
    button.style.top = "6px";
    button.style.right = "6px";
    button.style.fontSize = "12px";
    button.style.cursor = "pointer";
    button.style.padding = "4px 6px";
    button.style.borderRadius = "4px";
    button.style.zIndex = "10";

    const prevPos = window.getComputedStyle(pre).position;
    if (prevPos === "static" || !prevPos) pre.style.position = "relative";

    pre.appendChild(button);

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.innerText);
        button.textContent = "Copied!";
        setTimeout(() => (button.textContent = "Copy"), 1000);
      } catch (err) {
        console.error("copy failed:", err);
        button.textContent = "Failed";
        setTimeout(() => (button.textContent = "Copy"), 1500);
      }
    });
  });
});
