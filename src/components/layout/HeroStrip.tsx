
export function HeroStrip({
  title,
  subtitle,
  crumb,
}: {
  title: string;
  subtitle?: string;
  crumb?: string;
}) {
  return (
    <section className="hero">
      <div className="container heroInner">
        <div className="heroText">
          {crumb ? <div className="heroCrumb">{crumb}</div> : null}
          <h1 className="heroTitle">{title}</h1>
          {subtitle ? <div className="heroSub">{subtitle}</div> : null}
        </div>
      </div>
    </section>
  );
}
