const items = [
  { icon: "✓", text: "Endorsed by Nutritionist" },
  { icon: "✓", text: "FSSAI Certified" },
  { icon: "✓", text: "Official Drinks Partner — Star Strikers Delhi NCR" },
  { icon: "✓", text: "NABL Accredited Lab Tested" },
];

// Dot separator between items
const Dot = () => (
  <span className="mx-6 text-white/30 text-lg select-none">◆</span>
);

const Item = ({ icon, text }) => (
  <span className="inline-flex items-center gap-2 whitespace-nowrap">
    <span className="text-[#4ade80] font-bold text-base">{icon}</span>
    <span className="font-heading font-semibold text-sm uppercase tracking-[0.12em] text-white/90">
      {text}
    </span>
  </span>
);

const TrustBand = () => (
  <section className="bg-primary-800 py-3.5 overflow-hidden">
    <div
      className="flex"
      style={{ animation: "marquee 28s linear infinite" }}
    >
      {/* Render items twice so the loop is seamless */}
      {[0, 1].map((copy) => (
        <div key={copy} className="flex items-center flex-shrink-0 px-8">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <Item icon={item.icon} text={item.text} />
              <Dot />
            </span>
          ))}
        </div>
      ))}
    </div>
  </section>
);

export default TrustBand;
