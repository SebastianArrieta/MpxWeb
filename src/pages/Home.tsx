import { useRef } from 'react'
import { Link } from '../components/LocaleLink'
import { motion, useScroll, useTransform } from 'motion/react'
import AudiencePrompt from '../components/AudiencePrompt'
import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'
import { mediaUrl } from '../helpers/mediaUrl'

const mompoxHero = 'media/images/hero-mompox.jpg'
const albarradaPhoto = 'media/images/mompox-albarrada.jpg'

function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(' ')
  return (
    <span className="word-reveal" aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="word-reveal__word"
          initial={{ opacity: 0, y: '0.45em' }}
          animate={{ opacity: 1, y: '0em' }}
          transition={{ duration: 0.75, delay: delay + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
}

function parseRecognition(badge: string): { title: string; issuer?: string } {
  const parts = badge.split(' — ')
  if (parts.length === 2) {
    return { title: parts[0].trim(), issuer: parts[1].trim() }
  }
  return { title: badge }
}

export default function Home() {
  const { audience, labels } = useApp()
  const heroRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4])

  const visitorOrder = ['/semana-santa', '/festival-jazz', '/tours', '/itinerarios', '/galeria', '/como-llegar']
  const localOrder = ['/semana-santa', '/festival-jazz', '/galeria', '/itinerarios', '/tours', '/como-llegar']
  const order = audience === 'momposino' ? localOrder : visitorOrder
  const startCards = [...labels.inicio.empieza].sort((a, b) => order.indexOf(a.to) - order.indexOf(b.to))

  const featuredCards = startCards.slice(0, 2)
  const guideCards = startCards.slice(2)

  return (
    <div className="page home">
      <section className="hero hero--cinematic" ref={heroRef} style={{ position: 'relative' }}>
        <motion.div className="hero__backdrop" style={{ y: imgY }}>
          <img
            src={mediaUrl(mompoxHero)}
            alt={labels.site.fullName}
            loading="eager"
            decoding="async"
          />
        </motion.div>
        <div className="hero__shade" aria-hidden="true" />
        <motion.div className="hero__overlay" style={{ opacity: overlayOpacity }}>
          <motion.p
            className="hero__eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {labels.inicio.eyebrow}
          </motion.p>
          <h1 className="hero__title">
            <WordReveal text={labels.site.name} delay={0.18} />
          </h1>
          <motion.p
            className="hero__slogan"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {labels.site.slogan}
          </motion.p>
          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {labels.inicio.heroLead}
          </motion.p>
          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.82, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/mapa" className="btn btn--primary">
              {labels.inicio.ctaMapa}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            <Link to="/tours" className="btn btn--ghost">
              {labels.inicio.ctaTours}
            </Link>
          </motion.div>
        </motion.div>
        <div className="hero__scroll-cue" aria-hidden="true">
          <span className="hero__scroll-dot" />
          <span className="hero__scroll-line" />
        </div>
      </section>

      <section className="trust-strip" aria-label={labels.inicio.reconocimientos.join(', ')}>
        <ul>
          {labels.inicio.reconocimientos.map((badge, i) => {
            const { title, issuer } = parseRecognition(badge)
            return (
              <li key={badge} className="trust-strip__cell">
                <Reveal delay={i * 0.06} y={8} className="trust-strip__item">
                  <span className="trust-strip__seal" aria-hidden="true">✦</span>
                  <span className="trust-strip__text">
                    <strong className="trust-strip__title">{title}</strong>
                    {issuer ? <span className="trust-strip__issuer">{issuer}</span> : null}
                  </span>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </section>

      <AudiencePrompt />

      <section className="section home__section home__start">
        <Reveal className="home__start-head">
          <h2 className="section__title">{labels.inicio.empiezaTitle}</h2>
        </Reveal>

        <div className="home__featured-grid">
          {featuredCards.map((item, i) => {
            const tag = 'tag' in item ? (item as { tag?: string }).tag : undefined
            return (
              <Reveal key={item.to} delay={i * 0.08} className="home__card-reveal">
                <Link to={item.to} className="start-card start-card--featured">
                  <span className="start-card__image">
                    <img src={mediaUrl(item.image)} alt={item.label} loading="lazy" decoding="async" />
                  </span>
                  <span className="start-card__copy">
                    {tag ? <span className="start-card__tag">{tag}</span> : null}
                    <strong className="start-card__title">{item.label}</strong>
                    <span className="start-card__hint">{item.hint}</span>
                    <span className="start-card__more">
                      {labels.comunes.explorar}
                      <span className="start-card__arrow" aria-hidden="true">→</span>
                    </span>
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>

        <div className="home__guide-grid">
          {guideCards.map((item, i) => {
            const tag = 'tag' in item ? (item as { tag?: string }).tag : undefined
            return (
              <Reveal key={item.to} delay={i * 0.06} className="home__card-reveal">
                <Link to={item.to} className="start-card start-card--guide">
                  <span className="start-card__image">
                    <img src={mediaUrl(item.image)} alt={item.label} loading="lazy" decoding="async" />
                  </span>
                  <span className="start-card__copy">
                    {tag ? <span className="start-card__tag">{tag}</span> : null}
                    <strong className="start-card__title">{item.label}</strong>
                    <span className="start-card__hint">{item.hint}</span>
                    <span className="start-card__more">
                      {labels.comunes.explorar}
                      <span className="start-card__arrow" aria-hidden="true">→</span>
                    </span>
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="home-feature-band" aria-labelledby="home-feature-title">
        <div className="home-feature-band__inner">
          <Reveal className="home-feature-band__copy">
            <p className="home-feature-band__eyebrow">{labels.site.fullName}</p>
            <h2 id="home-feature-title" className="home-feature-band__title">
              {labels.inicio.introTitle}
            </h2>
            <p className="home-feature-band__lead">{labels.inicio.introLead}</p>
            <div className="home-feature-band__actions">
              <Link to="/mapa" className="btn btn--primary">
                {labels.inicio.ctaMapa}
                <span className="btn__arrow" aria-hidden="true">→</span>
              </Link>
              <Link to="/historia" className="btn btn--ghost">
                {labels.inicio.ctaHistoria}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="home-feature-band__media">
            <figure className="home-feature-band__figure">
              <div className="home-feature-band__frame">
                <img
                  src={mediaUrl(albarradaPhoto)}
                  alt={labels.site.fullName}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="home-feature-band__caption">
                {labels.site.slogan}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
