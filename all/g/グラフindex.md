---
layout: default
title: Index
---

# グラフ

{% assign current_dir = page.path | split: "/" | slice: 0, -1 | join: "/" %}

{% assign pages = site.pages
  | where_exp: "p", "p.path contains current_dir"
  | where_exp: "p", "p.name != 'index.md'"
  | where_exp: "p", "p.path contains '.md'"
  | sort: "path" %}

<ul>
{% for p in pages %}
  <li>
    <a href="{{ p.url }}">
      {{ p.name | replace: ".md", "" }}
    </a>
  </li>
{% endfor %}
</ul>
