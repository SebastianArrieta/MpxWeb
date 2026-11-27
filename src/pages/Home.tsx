import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'
import AudiencePrompt from '../components/AudiencePrompt'

const mompoxHero = 'https://mompox-magic-map.lovable.app/assets/hero-mompox-DYvqeVN5.jpg'

function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(' ')
  return (
    <span className="word-reveal" aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="word-reveal__word"
          initial={{ opacity: 0, y: '0.6em', filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: '0em', filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: delay + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
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

  return (
    <div className="page home">
      <section className="hero hero--cinematic" ref={heroRef}>
        <motion.div className="hero__backdrop" style={{ y: imgY }}>
          <img src={mompoxHero} alt={labels.site.fullName} fetchPriority="high" />
        </motion.div>
        <div className="hero__shade" aria-hidden="true" />
        <motion.div className="hero__overlay" style={{ opacity: overlayOpacity }}>
          <motion.p
            className="hero__eyebrow"
            initial={{ opacity: 0, letterSpacing: '0.3em' }}
            animate={{ opacity: 1, letterSpacing: '0.2em' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {labels.inicio.eyebrow}
          </motion.p>
          <h1 className="hero__title"><WordReveal text={labels.site.name} delay={0.2} /></h1>
          <motion.p
            className="hero__slogan"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {labels.site.slogan}
          </motion.p>
          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {labels.inicio.heroLead}
          </motion.p>
          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/mapa" className="btn btn--primary">
              {labels.inicio.ctaMapa}<span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            <Link to="/tours" className="btn btn--ghost">{labels.inicio.ctaTours}</Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="trust-strip" aria-label={labels.inicio.reconocimientos.join(', ')}>
        <ul>
          {labels.inicio.reconocimientos.map((badge, i) => (
            <li key={badge}>
              <Reveal delay={i * 0.06} y={8} className="trust-strip__item">
                <span className="trust-strip__seal" aria-hidden="true">✦</span>{badge}
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <AudiencePrompt />

      <section className="section home__section home__start">
        <Reveal>
          <h2 className="section__title">{labels.inicio.empiezaTitle}</h2>
        </Reveal>
        <div className="home__start-grid">
          {startCards.map((item, i) => (
            <Reveal key={item.to} delay={(i % 2) * 0.08}>
              <Link to={item.to} className="start-card">
                <span className="start-card__image">
                  <img src={item.image} alt={item.label} loading="lazy" decoding="async" />
                </span>
                <span className="start-card__copy">
                  <strong>{item.label}</strong>
                  <span>{item.hint}</span>
                  <span className="start-card__more">
                    {labels.comunes.explorar}<span className="start-card__arrow" aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
