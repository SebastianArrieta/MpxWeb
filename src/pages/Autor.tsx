import labels from '../data/labels.json'

export default function Autor() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Autores</h1>
        <p>Quiénes impulsan este proyecto turístico.</p>
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
              <p className="placeholder-text">
                Coautor del sitio turístico de Santa Cruz de Mompox: patrimonio,
                experiencia de visitante y narración local.
              </p>
              <ul className="stub-list">
                <li>
                  WhatsApp:{' '}
                  <a href={author.whatsappUrl} target="_blank" rel="noreferrer">
                    {author.whatsappDisplay}
                  </a>
                </li>
                <li>
                  Instagram:{' '}
                  <a href={author.instagramUrl} target="_blank" rel="noreferrer">
                    @{author.instagram}
                  </a>
                </li>
                <li>Enfoque: patrimonio y turismo responsable</li>
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
