// Shared nav/footer link data — Navbar.jsx and Footer.jsx both read from here
// so the two never drift out of sync. Each `to` is a real route (see App.jsx),
// not an in-page anchor, so every click actually navigates to its own page.

export const PRODUCT_LINKS = [
  { label: 'Features',  to: '/product/features'  },
  { label: 'Analytics', to: '/product/analytics' },
  { label: 'Security',  to: '/product/security'  },
  { label: 'Pricing',   to: '/product/pricing'   },
]

export const COMPANY_LINKS = [
  { label: 'About Us', to: '/about'            },
  { label: 'Careers',  to: '/company/careers'  },
  { label: 'Blog',     to: '/company/blog'     },
  { label: 'Contact',  to: '/company/contact'  },
]

export const LEGAL_LINKS = [
  { label: 'Privacy Policy',   to: '/legal/privacy' },
  { label: 'Terms of Service', to: '/legal/terms'   },
  { label: 'Cookie Policy',    to: '/legal/cookies' },
]
