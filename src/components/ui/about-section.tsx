const recognition = [
  ["Education", "Computer Science", "Technical University of Munich"],
  [
    "Recognition",
    "Ferry Porsche Prize 2026",
    "STEM distinction · Baden-Württemberg",
  ],
  ["Competition", "Jugend forscht", "2nd Prize · LanePilot"],
];

export default function AboutSection() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="page-width">
        <div className="about-composition">
          <div>
            <p className="section-label">The builder behind it</p>
            <h2 id="about-title" className="about-title">
              Understand
              <br />
              the system.
              <br />
              <em>
                Build the
                <br />
                whole thing.
              </em>
            </h2>
          </div>
          <div className="about-copy">
            <p className="about-introduction">
              I’m Kaan Gönüldinc.
              <br />
              AppSolves is where I build.
            </p>
            <p>
              I study Computer Science at TUM and work across machine
              intelligence, systems engineering and products. I’m interested in
              the parts that need real understanding: how a compiler represents
              a program, how a model behaves on edge hardware, how a product
              earns a place in someone’s day.
            </p>
            <p>
              AppSolves is the umbrella for that work: open-source tools, AI
              systems, software products, experiments and commercial ventures.
              Different outputs, the same approach. Understand the constraints,
              build the difficult parts, and carry the work through to something
              usable.
            </p>
          </div>
        </div>
        <dl className="recognition-list">
          {recognition.map(([label, title, detail]) => (
            <div key={title}>
              <dt>{label}</dt>
              <dd>
                {title}
                <span>{detail}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="focus-line">
          <span>Current focus</span>
          <p>
            AI & deep learning <span>/</span> Compilers & infrastructure{" "}
            <span>/</span> Edge AI <span>/</span> Products
          </p>
        </div>
      </div>
    </section>
  );
}
