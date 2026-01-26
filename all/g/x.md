---
layout: default
title: Index
---

# Index

<ul>
{% assign pages = site.pages
  | where_exp: "p", "p.dir == page.dir"
  | where_exp: "p", "p.name != 'index.md'"
  | where_exp: "p", "p.ext == '.md'"
  | sort: "name" %}

{% for p in pages %}
  <li>
    <a href="{{ p.url }}">
      {{ p.name | replace: ".md", "" }}
    </a>
  </li>
{% endfor %}
</ul>









