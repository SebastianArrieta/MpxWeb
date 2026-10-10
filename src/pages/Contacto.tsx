import { useState, type FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Contacto() {
  const { labels } = useApp()
  const l = labels.contacto
  const [errors, setErrors] = useState<{ nombre?: string; email?: string; asunto?: string; mensaje?: string }>({})
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const nombre = String(data.get('nombre') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const asunto = String(data.get('asunto') ?? '').trim()
    const mensaje = String(data.get('mensaje') ?? '').trim()

    const next: typeof errors = {}
    if (!nombre) next.nombre = l.formRequerido
    if (!email) next.email = l.formRequerido
    else if (!EMAIL_RE.test(email)) next.email = l.formCorreoInvalido
    if (!asunto) next.asunto = l.formRequerido
    if (!mensaje) next.mensaje = l.formRequerido

    setErrors(next)
    setSent(Object.keys(next).length === 0)
  }

  return (
    <div className="page">
      <header className="page-header">
        <p className="page-header__eyebrow">Mompox · Colombia</p>
        <h1>{l.title}</h1>
        <p>{l.tagline}</p>
      </header>

      <div className="contact-layout">
        <section className="section contact-form-wrap">
          <h2 className="section__title">{l.formTitle}</h2>
          <form className="contact-form" onSubmit={onSubmit} noValidate>
            <label>
              {l.formNombre}
              <input
                type="text"
                name="nombre"
                placeholder={l.formPlaceholderNombre}
                aria-invalid={Boolean(errors.nombre)}
                aria-describedby={errors.nombre ? 'err-nombre' : undefined}
              />
              {errors.nombre ? <span id="err-nombre" className="form-error">{errors.nombre}</span> : null}
            </label>
            <label>
              {l.formEmail}
              <input
                type="email"
                name="email"
                placeholder={l.formPlaceholderEmail}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'err-email' : undefined}
              />
              {errors.email ? <span id="err-email" className="form-error">{errors.email}</span> : null}
            </label>
            <label>
              {l.formAsunto}
              <input
                type="text"
                name="asunto"
                placeholder={l.formPlaceholderAsunto}
                aria-invalid={Boolean(errors.asunto)}
                aria-describedby={errors.asunto ? 'err-asunto' : undefined}
              />
              {errors.asunto ? <span id="err-asunto" className="form-error">{errors.asunto}</span> : null}
            </label>
            <label>
              {l.formMensaje}
              <textarea
                name="mensaje"
                rows={4}
                placeholder={l.formPlaceholderMensaje}
                aria-invalid={Boolean(errors.mensaje)}
                aria-describedby={errors.mensaje ? 'err-mensaje' : undefined}
              />
              {errors.mensaje ? <span id="err-mensaje" className="form-error">{errors.mensaje}</span> : null}
            </label>
            <button type="submit" className="btn btn--primary">
              {l.formEnviar}
            </button>
            {sent ? (
              <p className="form-success" role="status">
                {l.formEnviado}
              </p>
            ) : null}
          </form>
        </section>

        <aside className="section contact-aside">
          <h2 className="section__title">{l.autoresTitle}</h2>
          <div className="contact-authors">
            {labels.authors.map((author, i) => (
              <Reveal key={author.id} delay={i * 0.1}>
                <article className="contact-author-card">
                  <h3>{author.name}</h3>
                  <p className="contact-author-card__role">{author.role}</p>
                  <p>
                    <strong>{labels.autor.instagram}:</strong>{' '}
                    <a href={author.instagramUrl} target="_blank" rel="noreferrer">
                      @{author.instagram}
                    </a>
                  </p>
                  <p>
                    <strong>{labels.autor.whatsapp}:</strong>{' '}
                    <a href={author.whatsappUrl} target="_blank" rel="noreferrer">
                      {author.whatsappDisplay}
                    </a>
                  </p>
                  <p>
                    <strong>GitHub:</strong>{' '}
                    <a href={author.githubUrl} target="_blank" rel="noreferrer">
                      {author.github}
                    </a>
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="placeholder-text">{l.note}</p>
        </aside>
      </div>
    </div>
  )
}
