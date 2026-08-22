"use client";

interface TOCItem {
  id: string;
  label: string;
  level: number;
}

export function TableOfContents({ items }: { items: TOCItem[] }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const headerHeight = 56 + 16; // header height + padding
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL hash without scrolling
      history.pushState(null, "", `#${id}`);
    }
  };

  if (items.length === 0) return null;

  return (
    <aside className="article-toc">
      <nav>
        <p className="toc-title">Table of Contents</p>
        <ol className="toc-list">
          {items.map((item) => (
            <li key={item.id} data-level={item.level}>
              <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
