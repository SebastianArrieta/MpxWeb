import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'

export default function Autor() {
  const { labels } = useApp()
  const l = labels.autor
  return (
    <div className="page page--about">
      <header className="page-header">
        <p className="page-header__eyebrow">Mompox · Colombia</p>
        <h1>{l.title}</h1>
        <p>{l.tagline}</p>
      </header>
      <p className="about-intro">{l.bio}</p>
      <div className="author-grid">
        {labels.authors.map((author, index) => (
          <Reveal key={author.id} delay={index * 0.1}>
            <section className="author-stub">
              <div className="author-stub__avatar" aria-hidden="true">{author.initials}</div>
              <div className="author-stub__body">
                <h2>{author.name}</h2>
                <p className="author-stub__role">{author.role}</p>
                <p className="placeholder-text">{author.bio}</p>
                <div className="about-links">
                  <a href={author.instagramUrl} target="_blank" rel="noreferrer">
                    Instagram <span aria-hidden="true">↗</span>
                  </a>
                  <a href={author.githubUrl} target="_blank" rel="noreferrer">
                    GitHub <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
