---
layout: default
title: 構造体
---

# データ構造

<ul>
{% assign md_pages = site.pages
  | where_exp: "p", "p.path contains '構造体/'"
  | where_exp: "p", "p.name != 'index.md'"
  | sort: "path" %}

{% for p in md_pages %}
  <li>
    <!-- library を含めた絶対パス -->
    <a href="/library{{ p.url }}">
      {{ p.title | default: p.name | replace: ".md", "" }}
    </a>
  </li>
{% endfor %}
</ul>
