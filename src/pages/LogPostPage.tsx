import { Link, Navigate, useParams } from "react-router-dom";
import { getLogBySlug } from "../lib/logs";
import { StatusBadge, TypeBadge } from "../components/LogBadges";

export default function LogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const entry = slug ? getLogBySlug(slug) : undefined;

  if (!entry) {
    return <Navigate to="/logs" replace />;
  }

  const { frontmatter } = entry;

  return (
    <div className="log-page">
      <div className="shell log-shell log-post-shell">
        <Link to="/logs" className="log-back-link">
          &larr; All logs
        </Link>

        <article className="log-post">
          <header className="log-summary-block">
            <div className="log-summary-top">
              <TypeBadge type={frontmatter.type} />
              <StatusBadge status={frontmatter.status} />
            </div>

            <h1 className="log-post-title">{frontmatter.title}</h1>

            <dl className="log-summary-grid">
              <div>
                <dt>Date</dt>
                <dd>
                  <time dateTime={frontmatter.date}>{frontmatter.date}</time>
                </dd>
              </div>
              <div>
                <dt>Reading time</dt>
                <dd>{entry.readingTime} min</dd>
              </div>
              <div className="log-summary-pillars">
                <dt>Pillars</dt>
                <dd>
                  {frontmatter.pillars.map((pillar) => (
                    <span key={pillar} className="log-pillar-tag">
                      {pillar}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="log-summary-tags">
                <dt>Tags</dt>
                <dd>
                  {frontmatter.tags.map((tag) => (
                    <Link key={tag} to={`/logs?tag=${encodeURIComponent(tag)}`} className="log-pillar-tag">
                      #{tag}
                    </Link>
                  ))}
                </dd>
              </div>
            </dl>
          </header>

          <div className="log-prose" dangerouslySetInnerHTML={{ __html: entry.html }} />
        </article>
      </div>
    </div>
  );
}
