import { useApp } from '../context/AppContext'

export default function Contacto() {
  const { labels } = useApp()
  const l = labels.contacto
  return (
    <div className="page">
      <header className="page-header">
        <h1>{l.title}</h1>
        <p>{l.tagline}</p>
      </header>

      <div className="contact-layout">
        <section className="section contact-form-wrap">
          <h2 className="section__title">{l.formTitle}</h2>
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <label>
              {l.formNombre}
              <input type="text" name="nombre" placeholder={l.formPlaceholderNombre} />
            </label>
            <label>
              {l.formEmail}
              <input type="email" name="email" placeholder={l.formPlaceholderEmail} />
            </label>
            <label>
              {l.formMensaje}
              <textarea name="mensaje" rows={4} placeholder={l.formPlaceholderMensaje} />
            </label>
            <button type="submit" className="btn btn--primary">
              {l.formEnviar}
            </button>
          </form>
        </section>

        <aside className="section contact-aside">
          <h2 className="section__title">{l.autoresTitle}</h2>
          <div className="contact-authors">
            {labels.authors.map((author) => (
              <article key={author.id} className="contact-author-card">
                <h3>{author.name}</h3>
                <p className="contact-author-card__role">{author.role}</p>
                <p>
                  <strong>{labels.autor.whatsapp}:</strong>{' '}
                  <a href={author.whatsappUrl} target="_blank" rel="noreferrer">
                    {author.whatsappDisplay}
                  </a>
                </p>
                <p>
                  <strong>{labels.autor.instagram}:</strong>{' '}
                  <a href={author.instagramUrl} target="_blank" rel="noreferrer">
                    @{author.instagram}
                  </a>
                </p>
              </article>
            ))}
          </div>
          <p className="placeholder-text">{l.note}</p>
        </aside>
      </div>
    </div>
  )
}