import { forwardRef } from 'react'
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  type LinkProps,
  type NavLinkProps,
} from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { localizePath } from '../i18n/locale'

/**
 * Igual que Link/NavLink de react-router, pero las rutas internas ('/mapa')
 * se ajustan solas al idioma actual ('/en/mapa' en inglés).
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...rest }, ref) {
  const { lang } = useApp()
  return <RouterLink ref={ref} to={typeof to === 'string' ? localizePath(to, lang) : to} {...rest} />
})

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, ...rest },
  ref,
) {
  const { lang } = useApp()
  return <RouterNavLink ref={ref} to={typeof to === 'string' ? localizePath(to, lang) : to} {...rest} />
})
