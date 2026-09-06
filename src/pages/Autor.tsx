import { useApp } from '../context/AppContext'

export default function Autor() {
  const { labels } = useApp()
  const l = labels.autor
  return (
    <div className="page">
      <header className="page-header">
        <h1>{l.title}</h1>
        <p>{l.tagline}</p>
      </header>

      <div className="author-grid">
        {labels.authors.map((author) => (
          <section key={author.id} className="section author-stub">
            <div className="author-stub__avatar" aria-hidden="true">
              {author.initials}
            </div>
            <div className="author-stub__body">
              <h2>{author.name}</h2>
              <p className="author-stub__role">{author.role}</p>
              <p className="placeholder-text">{l.bio}</p>
              <ul className="stub-list">
                <li>
                  {l.whatsapp}:{' '}
                  <a href={author.whatsappUrl} target="_blank" rel="noreferrer">
                    {author.whatsappDisplay}
                  </a>
                </li>
                <li>
                  {l.instagram}:{' '}
                  <a href={author.instagramUrl} target="_blank" rel="noreferrer">
                    @{author.instagram}
                  </a>
                </li>
                <li>{l.enfoque}</li>
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}