import { MDXRemote } from "next-mdx-remote/rsc";
import { slugify as transliterate } from "transliteration";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

function slugifyHeading(value: string) {
  return (
    transliterate(value.replace(/&/g, " and "), {
      lowercase: true,
      separator: "-",
    }).replace(/--+/g, "-") || "section"
  );
}

function createHeading(level: number) {
  return function Heading({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    const text = typeof children === "string" ? children : "";
    const id = slugifyHeading(text);
    switch (level) {
      case 1: return <h1 id={id} {...props}>{children}</h1>;
      case 2: return <h2 id={id} {...props}>{children}</h2>;
      case 3: return <h3 id={id} {...props}>{children}</h3>;
      case 4: return <h4 id={id} {...props}>{children}</h4>;
      case 5: return <h5 id={id} {...props}>{children}</h5>;
      default: return <h6 id={id} {...props}>{children}</h6>;
    }
  };
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  pre: CodeBlock,
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith("/") || href?.startsWith("#")) {
      return <a href={href} {...props}>{children}</a>;
    }
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  },
};

export function CustomMDX({ source, themeStyle }: { source: string; headingIds?: string[]; themeStyle?: string }) {
  return (
    <div data-theme-style={themeStyle || "default"}>
      <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
    </div>
  );
}
