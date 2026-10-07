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
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="mr-4 text-foreground">04</span>
            Stack
          </div>
          <div>
            <h2 className="max-w-4xl text-[clamp(2.4rem,4.6vw,5.2rem)] font-medium leading-[0.98] tracking-[-0.05em] text-foreground">
              Tools chosen for the problem, not the trend.
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              My work spans research-oriented ML, low-level systems, backend
              infrastructure, mobile products, and edge hardware. These are the
              technologies I reach for most often.
            </p>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 border-y border-white/[0.08] md:grid-cols-3">
          {groups.map((group, index) => (
            <div
              key={group.label}
              className={[
                "py-8 md:px-8",
                index === 0 ? "md:pl-0" : "",
                index < groups.length - 1 ? "border-b border-white/[0.08] md:border-b-0 md:border-r" : "",
              ].join(" ")}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                {group.label}
              </div>
              <div className="mt-6 space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="text-lg tracking-[-0.02em] text-foreground sm:text-xl"
                  >
                    {item}
                  </div>
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
