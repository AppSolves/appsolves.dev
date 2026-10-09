import { ArrowUpRight } from "lucide-react";

const projects = [
  [
    "fastapi-users-db-dynamodb",
    "An async DynamoDB adapter for FastAPI Users.",
    "Python / AWS",
  ],
  [
    "pylocalauth",
    "Native local authentication for Python applications.",
    "Python / Authentication",
  ],
  [
    "rc522-mfc-recovery",
    "Read-only MIFARE Classic research using RC522 hardware and established recovery tools.",
    "Python / Hardware security",
  ],
  [
    "flutter_event_log",
    "The Windows Event Log API, available from Flutter.",
    "Flutter / C++",
  ],
  [
    "appscreen-mcp",
    "MCP automation for coding agents, built on YuzuHub’s app screenshot generator.",
    "TypeScript / MCP",
  ],
];

export default function OpenSourceSection() {
  return (
    <section
      id="open-source"
      className="open-source-section page-width"
      aria-labelledby="open-source-title"
    >
      <div className="open-source-intro">
        <p className="section-label">Open source & infrastructure</p>
        <h2 id="open-source-title">
          Tools and
          <br />
          infrastructure.
        </h2>
        <p>
          Libraries and tools for application development, hardware research,
          and coding agents.
        </p>
        <a
          className="text-link"
          href="https://github.com/AppSolves"
          target="_blank"
          rel="noopener noreferrer"
        >
          More on GitHub{" "}
          <ArrowUpRight
            data-arrow-motion="external"
            size={17}
            aria-hidden="true"
          />
        </a>
      </div>
      <ul className="source-list">
        {projects.map(([name, description, technology]) => (
          <li key={name}>
            <a
              href={`https://github.com/AppSolves/${name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>
                <h3>{name}</h3>
                <p>{description}</p>
                <span>{technology}</span>
              </div>
              <ArrowUpRight
                data-arrow-motion="external"
                size={22}
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
