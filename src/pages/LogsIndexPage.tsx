import { Link, useSearchParams } from "react-router-dom";
import { getAllLogs, getAllPillars, getAllTags, filterLogs } from "../lib/logs";
import { StatusBadge, TypeBadge } from "../components/LogBadges";

export default function LogsIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get("tag");
  const activePillar = searchParams.get("pillar");

  const allLogs = getAllLogs();
  const tags = getAllTags();
  const pillars = getAllPillars();
  const entries = filterLogs(allLogs, { tag: activeTag, pillar: activePillar });

  function toggleParam(key: "tag" | "pillar", value: string) {
    const next = new URLSearchParams(searchParams);
    if (next.get(key) === value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  }

  return (
    <div className="log-page">
      <div className="shell log-shell">
        <header className="log-index-header">
          <p className="log-eyebrow">// lab logs</p>
          <h1>Engineering Journal</h1>
          <p className="log-index-sub">
            Running notes, experiments, and decisions from the lab &mdash; unfiltered.
          </p>
        </header>

        <div className="log-filter-bar" role="group" aria-label="Filter log entries">
          <div className="log-filter-group">
            <span className="log-filter-label">Pillar</span>
            <div className="log-filter-chips">
              {pillars.map((pillar) => (
                <button
                  key={pillar}
                  type="button"
                  className={`log-chip ${activePillar === pillar ? "log-chip-active" : ""}`}
                  onClick={() => toggleParam("pillar", pillar)}
                >
                  {pillar}
                </button>
              ))}
            </div>
          </div>

          <div className="log-filter-group">
            <span className="log-filter-label">Tag</span>
            <div className="log-filter-chips">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`log-chip ${activeTag === tag ? "log-chip-active" : ""}`}
                  onClick={() => toggleParam("tag", tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {(activeTag || activePillar) && (
            <button type="button" className="log-chip-clear" onClick={() => setSearchParams({})}>
              Clear filters
            </button>
          )}
        </div>

        <ul className="log-list">
          {entries.map((entry) => (
            <li key={entry.slug} className="log-card">
              <Link to={`/logs/${entry.slug}`} className="log-card-link">
                <div className="log-card-meta">
                  <time className="log-card-date" dateTime={entry.frontmatter.date}>
                    {entry.frontmatter.date}
                  </time>
                  <TypeBadge type={entry.frontmatter.type} />
                  <StatusBadge status={entry.frontmatter.status} />
                </div>
                <h2 className="log-card-title">{entry.frontmatter.title}</h2>
                <p className="log-card-excerpt">{entry.excerpt}</p>
                <div className="log-card-footer">
                  <div className="log-card-pillars">
                    {entry.frontmatter.pillars.map((pillar) => (
                      <span key={pillar} className="log-pillar-tag">
                        {pillar}
                      </span>
                    ))}
                  </div>
                  <span className="log-card-reading-time">{entry.readingTime} min read</span>
                </div>
              </Link>
            </li>
          ))}

          {entries.length === 0 && (
            <li className="log-empty">No entries match the current filters.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
