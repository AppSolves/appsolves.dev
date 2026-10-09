const recognition = [
  ["Education", "Computer Science", "Technical University of Munich"],
  [
    "Recognition",
    "Ferry Porsche Prize 2026",
    "Award for outstanding achievement in STEM subjects",
  ],
  [
    "Competition",
    "Jugend forscht",
    "2nd Prize at the regional Jugend forscht competition",
  ],
];

export default function AboutSection() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="page-width">
        <div className="about-composition">
          <div>
            <p className="section-label">About</p>
            <h2 id="about-title" className="about-title">
              Behind
              <br />
              <em>AppSolves</em>
            </h2>
          </div>
          <div className="about-copy">
            <p className="about-introduction">
              I’m Kaan Gönüldinc, a Computer Science student at TUM.
            </p>
            <p>
              I want to understand the internals well enough to make useful
              decisions: how a compiler represents a program, how a model
              behaves on edge hardware, and what an app needs before someone can
              rely on it.
            </p>
            <p>
              AppSolves is my long-running software and product brand. It’s the
              name I publish that work under, whether it’s an open-source
              library or a commercial product.
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
            AI & Deep Learning <span>/</span> Software Engineering{" "}
            <span>/</span> Products & Entrepreneurship
          </p>
        </div>
      </div>
    </section>
  );
}
