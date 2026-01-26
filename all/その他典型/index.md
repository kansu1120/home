---
layout: default
title: その他典型
---

# その他典型

<ul>
{% assign md_pages = site.pages
  | where_exp: "p", "p.path contains 'その他典型/'"
  | where_exp: "p", "p.name != 'index.md'"
  | sort: "path" %}

{% for p in md_pages %}
  <li>
    <!-- HTML ページとして開くリンク -->
    <a href="{{ p.url }}">
      {{ p.title | default: p.name | replace: ".md", "" }}
    </a>
  </li>
{% endfor %}
</ul>
