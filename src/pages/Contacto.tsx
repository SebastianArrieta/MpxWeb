import labels from '../data/labels.json'

export default function Contacto() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Contacto</h1>
        <p>Escríbenos o coordina por WhatsApp e Instagram.</p>
      </header>

      <div className="contact-layout">
        <section className="section contact-form-wrap">
          <h2 className="section__title">Formulario</h2>
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <label>
              Nombre
              <input type="text" name="nombre" placeholder="Tu nombre" />
            </label>
            <label>
              Correo
              <input type="email" name="email" placeholder="tu@correo.com" />
            </label>
            <label>
              Mensaje
              <textarea name="mensaje" rows={4} placeholder="¿En qué te ayudamos?" />
            </label>
            <button type="submit" className="btn btn--primary">
              Enviar (stub)
            </button>
          </form>
        </section>

        <aside className="section contact-aside">
          <h2 className="section__title">Autores</h2>
          <div className="contact-authors">
            {labels.authors.map((author) => (
              <article key={author.id} className="contact-author-card">
                <h3>{author.name}</h3>
                <p className="contact-author-card__role">{author.role}</p>
                <p>
                  <strong>WhatsApp:</strong>{' '}
                  <a href={author.whatsappUrl} target="_blank" rel="noreferrer">
                    {author.whatsappDisplay}
                  </a>
                </p>
                <p>
                  <strong>Instagram:</strong>{' '}
                  <a href={author.instagramUrl} target="_blank" rel="noreferrer">
                    @{author.instagram}
                  </a>
                </p>
              </article>
            ))}
          </div>
          <p className="placeholder-text">
            Datos estáticos del brief. Sin backend ni envío real en este maquetado.
          </p>
        </aside>
      </div>
    </div>
  )
}
