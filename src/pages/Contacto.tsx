import { useRef, useState, type FocusEvent, type FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'

/** Si está configurado, el formulario envía a Formspree; si no, abre WhatsApp. */
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim() || ''

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
  // El resumen se fija al enviar: si cambiara al salir de un campo, el botón
  // se movería justo cuando el usuario lo va a tocar y el clic se perdería.
  const [summaryErrors, setSummaryErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState('')
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

  // Quita el error de un campo en cuanto el usuario lo corrige (mientras escribe),
  // para que el diseño no salte justo al tocar "Enviar".
  const onInput = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement
    const field = target.name as Field
    if (!FIELDS.includes(field) || !errors[field]) return
    if (!validateField(field, target.value)) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const destino = labels.authors.find((author) => author.id === l.destinoId) ?? labels.authors[0]

  const buildWhatsappLink = (values: Record<Field, string>) => {
    const text = FIELDS.reduce(
      (msg, field) => msg.split(`{${field}}`).join(values[field].trim()),
      l.whatsappPlantilla,
    )
    return `${destino.whatsappUrl}?text=${encodeURIComponent(text)}`
  }

  const finishSent = () => {
    setSent(true)
    formRef.current?.reset()
    setTouched({})
    window.requestAnimationFrame(() => successRef.current?.focus())
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return
    setSendError(false)
    const next = validateAll()
    setErrors(next)
    setTouched({ nombre: true, email: true, asunto: true, mensaje: true })
    setSubmitted(true)

    setSummaryErrors(next)
    const firstError = FIELDS.find((field) => next[field])
    if (firstError) {
      setSent(false)
      summaryRef.current?.focus()
      return
    }

    const values = readValues()
    const link = buildWhatsappLink(values)
    setWhatsappLink(link)

    if (!FORMSPREE_ENDPOINT) {
      // Se abre en el mismo gesto del usuario para que el navegador no lo bloquee.
      window.open(link, '_blank', 'noopener')
      finishSent()
      return
    }

    setSending(true)
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, _subject: `Mompox web — ${values.asunto}` }),
      })
      if (!response.ok) throw new Error(String(response.status))
      finishSent()
    } catch {
      setSent(false)
      setSendError(true)
    } finally {
      setSending(false)
    }
  }

  const invalidFields = FIELDS.filter((field) => summaryErrors[field])
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
          <form className="contact-form" ref={formRef} onSubmit={onSubmit} onInput={onInput} noValidate>
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
                        {fieldLabel[field]} — {summaryErrors[field]}
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
            <button type="submit" className="btn btn--primary" disabled={sending} aria-busy={sending}>
              {sending ? l.formEnviando : FORMSPREE_ENDPOINT ? l.formEnviarCorreo : l.formEnviar}
            </button>
            {sent ? (
              <p className="form-success" role="status" tabIndex={-1} ref={successRef}>
                {FORMSPREE_ENDPOINT ? l.formEnviado : l.formEnviadoWhatsapp}
                {!FORMSPREE_ENDPOINT && whatsappLink ? (
                  <>
                    {' '}
                    <a href={whatsappLink} target="_blank" rel="noreferrer">{l.formAbrirWhatsapp} ↗</a>
                  </>
                ) : null}
              </p>
            ) : null}
            {sendError ? (
              <p className="form-error" role="alert">
                {l.formErrorEnvio}{' '}
                {whatsappLink ? (
                  <a href={whatsappLink} target="_blank" rel="noreferrer">WhatsApp ↗</a>
                ) : null}
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
          <p className="placeholder-text">{FORMSPREE_ENDPOINT ? l.noteCorreo : l.note}</p>
        </aside>
      </div>
    </div>
  )
}
