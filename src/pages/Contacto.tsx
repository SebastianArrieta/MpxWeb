export default function Contacto() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Contacto</h1>
        <p>Escríbenos o coordina por WhatsApp.</p>
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
          <h2 className="section__title">Canales</h2>
          <p>
            <strong>WhatsApp:</strong>{' '}
            <a href="https://wa.me/573103513606">+57 310 351 3606</a>
          </p>
          <p>
            <strong>Instagram / redes:</strong> @alfredompox
          </p>
          <p className="placeholder-text">
            Datos estáticos del brief. Sin backend ni envío real en este maquetado.
          </p>
        </aside>
      </div>
    </div>
  )
}
