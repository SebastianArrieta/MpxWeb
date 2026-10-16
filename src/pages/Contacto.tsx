import { useRef, useState, type FocusEvent, type FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Field = 'nombre' | 'email' | 'asunto' | 'mensaje'
type Errors = Partial<Record<Field, string>>
const FIELDS: Field[] = ['nombre', 'email', 'asunto', 'mensaje']

export default function Contacto() {
  const { labels } = useApp()
  const l = labels.contacto
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [sent, setSent] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)
  const summaryRef = useRef<HTMLDivElement | null>(null)
  const successRef = useRef<HTMLParagraphElement | null>(null)

  const fieldLabel: Record<Field, string> = {
    nombre: l.formNombre,
    email: l.formEmail,
    asunto: l.formAsunto,
    mensaje: l.formMensaje,
  }

  const validateField = (field: Field, value: string): string | undefined => {
    const trimmed = value.trim()
    if (!trimmed) return l.formRequerido
    if (field === 'email' && !EMAIL_RE.test(trimmed)) return l.formCorreoInvalido
    return undefined
  }

  const readValues = (): Record<Field, string> => {
    const data = new FormData(formRef.current!)
    const values = {} as Record<Field, string>
    FIELDS.forEach((field) => {
      values[field] = String(data.get(field) ?? '')
    })
    return values
  }

  const validateAll = (): Errors => {
    const values = readValues()
    const next: Errors = {}
    FIELDS.forEach((field) => {
      const error = validateField(field, values[field])
      if (error) next[field] = error
    })
    return next
  }

  const onBlur = (field: Field) => (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, event.currentTarget.value)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = validateAll()
    setErrors(next)
    setTouched({ nombre: true, email: true, asunto: true, mensaje: true })
    setSubmitted(true)

    const firstError = FIELDS.find((field) => next[field])
    if (firstError) {
      setSent(false)
      summaryRef.current?.focus()
      return
    }

    setSent(true)
    formRef.current?.reset()
    window.requestAnimationFrame(() => successRef.current?.focus())
  }

  const invalidFields = FIELDS.filter((field) => errors[field])
  const showSummary = submitted && invalidFields.length > 0
  const showError = (field: Field) =>
    (touched[field] || submitted) && errors[field] ? errors[field] : undefined

  const focusField = (field: Field) => {
    formRef.current?.querySelector<HTMLElement>(`#campo-${field}`)?.focus()
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
          <form className="contact-form" ref={formRef} onSubmit={onSubmit} noValidate>
            {showSummary ? (
              <div
                className="error-summary"
                role="alert"
                tabIndex={-1}
                ref={summaryRef}
                aria-labelledby="error-summary-title"
              >
                <h3 id="error-summary-title">{l.formResumen}</h3>
                <ul>
                  {invalidFields.map((field) => (
                    <li key={field}>
                      <a
                        href={`#campo-${field}`}
                        onClick={(event) => {
                          event.preventDefault()
                          focusField(field)
                        }}
                      >
                        {fieldLabel[field]} — {errors[field]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <label>
              {l.formNombre}
              <input
                id="campo-nombre"
                type="text"
                name="nombre"
                required
                aria-required="true"
                placeholder={l.formPlaceholderNombre}
                aria-invalid={Boolean(showError('nombre'))}
                aria-describedby={showError('nombre') ? 'err-nombre' : undefined}
                onBlur={onBlur('nombre')}
              />
              {showError('nombre') ? <span id="err-nombre" className="form-error">{errors.nombre}</span> : null}
            </label>
            <label>
              {l.formEmail}
              <input
                id="campo-email"
                type="email"
                name="email"
                required
                aria-required="true"
                placeholder={l.formPlaceholderEmail}
                aria-invalid={Boolean(showError('email'))}
                aria-describedby={showError('email') ? 'err-email' : undefined}
                onBlur={onBlur('email')}
              />
              {showError('email') ? <span id="err-email" className="form-error">{errors.email}</span> : null}
            </label>
            <label>
              {l.formAsunto}
              <input
                id="campo-asunto"
                type="text"
                name="asunto"
                required
                aria-required="true"
                placeholder={l.formPlaceholderAsunto}
                aria-invalid={Boolean(showError('asunto'))}
                aria-describedby={showError('asunto') ? 'err-asunto' : undefined}
                onBlur={onBlur('asunto')}
              />
              {showError('asunto') ? <span id="err-asunto" className="form-error">{errors.asunto}</span> : null}
            </label>
            <label>
              {l.formMensaje}
              <textarea
                id="campo-mensaje"
                name="mensaje"
                rows={4}
                required
                aria-required="true"
                placeholder={l.formPlaceholderMensaje}
                aria-invalid={Boolean(showError('mensaje'))}
                aria-describedby={showError('mensaje') ? 'err-mensaje' : undefined}
                onBlur={onBlur('mensaje')}
              />
              {showError('mensaje') ? <span id="err-mensaje" className="form-error">{errors.mensaje}</span> : null}
            </label>
            <button type="submit" className="btn btn--primary">
              {l.formEnviar}
            </button>
            {sent ? (
              <p className="form-success" role="status" tabIndex={-1} ref={successRef}>
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
