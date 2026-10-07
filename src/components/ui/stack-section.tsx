const groups = [
  {
    label: "AI / ML",
    items: ["PyTorch", "TensorFlow", "PyTorch Geometric", "OpenCV", "CUDA", "TensorRT"],
  },
  {
    label: "Systems / Backend",
    items: ["Rust", "Python", "C++", "FastAPI", "Linux", "Docker", "AWS"],
  },
  {
    label: "Product / Edge",
    items: ["Flutter", "Dart", "NVIDIA Jetson", "Raspberry Pi", "Android"],
  },
];

const StackSection = () => {
  return (
    <section id="stack" className="border-t border-white/[0.08] py-24 sm:py-32">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-10">
        <div className="section-kicker">Selected technologies</div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 className="max-w-4xl text-[clamp(2.8rem,5vw,5.8rem)] font-medium leading-[0.97] tracking-[-0.06em] text-foreground">
            Tools chosen for the problem, not the trend.
          </h2>

          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            My work spans research-oriented ML, low-level systems, backend
            infrastructure, mobile products, and edge hardware. These are the
            technologies I reach for most often.
          </p>
        </div>

        <div className="mt-20 border-y border-white/[0.08]">
          {groups.map((group) => (
            <div key={group.label} className="stack-row">
              <div className="text-sm text-muted-foreground">{group.label}</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-lg tracking-[-0.025em] text-foreground sm:text-xl">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StackSection;
