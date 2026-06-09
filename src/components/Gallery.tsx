import { stations } from "../data/gameData";

export default function Gallery() {
  return (
    <main className="content-page">
      <section className="page-heading glass">
        <p className="eyebrow">Scene Gallery</p>
        <h1>Image Gallery</h1>
        <p>Place generated scene files in <code>public/images</code>. Missing files fall back to luminous CSS scene panels.</p>
      </section>
      <section className="gallery-grid">
        {stations.map((station) => (
          <article className="glass gallery-item" key={station.id}>
            <div className="scene small-scene" style={{ backgroundImage: `url(/images/${station.imageKey}.png)` }} />
            <h2>{station.title}</h2>
            <p>{station.subtitle}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
