---
layout: default
---

# Index

<ul>
{% assign base = page.path | replace: "index.md", "" %}

{% for p in site.pages %}
  {% if p.path contains base and p.name != "index.md" %}
    <li>
      <a href="{{ p.url }}">
        {{ p.name | replace: ".md", "" }}
      </a>
    </li>
  {% endif %}
{% endfor %}
</ul>
