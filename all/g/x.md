---
layout: default
title: グラフアルゴリズム一覧
permalink: /graph/
---

# グラフアルゴリズム一覧

<ul>
{% for p in site.グラフ %}
  {% if p.name != "index.md" %}
    <li>
      <!-- URL が生成されない場合は path を使う -->
      <a href="{{ p.url | default: p.path }}">
        {{ p.title | default: p.name | replace: ".md", "" }}
      </a>
    </li>
  {% endif %}
{% endfor %}
</ul>
