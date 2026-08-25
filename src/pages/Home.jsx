import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from './Footer'

const FEATURES = [
  {
    icon: '📉',
    title: "You'll see the dip before your manager asks about it",
    desc: 'A bad shift, a delayed order, a broken machine at one branch — CSAT and NPS move on the dashboard as the answers come in, not in a report someone builds next Monday.',
  },
  {
    icon: '🕌',
    title: "Arabic isn't a translation toggle here",
    desc: 'The builder was written right-to-left from the first version. Question logic, branching, and layout behave correctly in Arabic — nothing is a mirrored English template with the text flipped.',
  },
  {
    icon: '🔐',
    title: "Your data doesn't leave the Kingdom",
    desc: "Hosted on infrastructure inside Saudi Arabia, built around SDAIA's PDPL requirements. Ask us where the servers sit — we'll actually tell you.",
  },
  {
    icon: '💬',
    title: 'WhatsApp carries most of the volume',
    desc: "Email surveys get ignored here — WhatsApp doesn't. We also do SMS, a QR code at the till, or a plain link if that's all you need.",
  },
  {
    icon: '🤖',
    title: "AI reads the comments so you don't have to",
    desc: 'A thousand open-text answers in Arabic and English get summarized and flagged for anything that reads like a real complaint, not just noise.',
  },
  {
    icon: '📤',
    title: 'It leaves in whatever format you need',
    desc: 'Excel for the board deck, SPSS if research wants it, or a webhook straight into whichever CRM you happen to be stuck with.',
  },
]

const STATS = [
  { value: '3,200+', label: 'surveys shipped since 2021' },
  { value: '45M+', label: 'answers collected, not just clicks' },
  { value: '99.98%', label: "uptime — we don't call it best effort" },
  { value: '13', label: 'regions with a local number to call' },
]

const TESTIMONIALS = [
  {
    quote: "Our regional manager used to wait three weeks for a summary. Now she sees the CSAT dip before the shift even ends.",
    person: 'Operations Lead',
    org: 'Multi-branch café group',
    city: 'Jeddah',
    metric: '+41%',
    metricLabel: 'surveys completed',
    accent: '#0B6E4F',
    rotate: '-1.4deg',
  },
  {
    quote: "Customers actually finish it because it's built in Arabic first, not translated after the fact.",
    person: 'CX Manager',
    org: 'Home appliances retailer',
    city: 'Riyadh',
    metric: '3.5×',
    metricLabel: 'more replies via WhatsApp',
    accent: '#B8892B',
    rotate: '1.2deg',
  },
  {
    quote: "We needed everything hosted inside the Kingdom for our compliance review — that was non-negotiable, and it just worked.",
    person: 'IT Director',
    org: 'Private healthcare group',
    city: 'Dammam',
    metric: '1',
    metricLabel: 'review cycle to approve',
    accent: '#0B6E4F',
    rotate: '-0.8deg',
  },
]

const JOURNEY = [
  { ar: 'مسح', en: 'Scan the QR at the till', icon: '▦' },
  { ar: 'رد', en: 'Answer three questions in Arabic', icon: '💬' },
  { ar: 'تم', en: 'Manager sees it before you leave the car park', icon: '✓' },
]

function AnimatedNumber({ value, className, style }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(value.replace(/[\d.,]/g, (c) => (c === ',' ? ',' : '0')))
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/)
    if (!match) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const [, prefix, numStr, suffix] = match
            const target = parseFloat(numStr.replace(/,/g, ''))
            const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
            const duration = 1300
            const startTime = performance.now()
            const step = (now) => {
              const progress = Math.min((now - startTime) / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              const current = target * eased
              const formatted = decimals
                ? current.toFixed(decimals)
                : Math.round(current).toLocaleString('en-US')
              setDisplay(`${prefix}${formatted}${suffix}`)
              if (progress < 1) requestAnimationFrame(step)
              else setDisplay(value)
            }
            requestAnimationFrame(step)
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])
  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  )
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.sp-reveal')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sp-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

/** Tilts a card toward the cursor. Skips entirely for touch / reduced-motion. */
function useTilt(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(700px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-6px)`
    }
    const onLeave = () => { el.style.transform = '' }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [ref])
}

function TiltCard({ children, className, style }) {
  const ref = useRef(null)
  useTilt(ref)
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}

/** Original hand-drawn SVG scene — a customer scanning a survey QR at a Saudi till,
 *  the Kingdom Tower skyline behind, and a WhatsApp-style reply bubble animating in.
 *  No stock photography, no AI-generated imagery — every shape below is authored inline. */
function HeroIllustration() {
  const wrapRef = useRef(null)
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      wrap.style.setProperty('--px', px.toFixed(3))
      wrap.style.setProperty('--py', py.toFixed(3))
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div ref={wrapRef} className="sp-hero-illo-wrap sp-enter" style={{ animationDelay: '0.62s' }}>
      <svg viewBox="0 0 640 460" className="sp-hero-illo" role="img" aria-label="Illustration of a customer scanning a survey QR code at a till, with the Riyadh skyline behind them">
        {/* skyline */}
        <g className="sp-illo-skyline" opacity="0.9">
          <rect x="40" y="230" width="26" height="150" rx="2" fill="#0B6E4F" opacity="0.14" />
          <rect x="86" y="180" width="20" height="200" rx="2" fill="#0B6E4F" opacity="0.14" />
          {/* Kingdom Centre silhouette */}
          <path d="M150 380 L150 210 Q150 190 162 178 L170 168 Q176 160 182 168 L190 178 Q202 190 202 210 L202 300 Q202 320 190 330 L190 380 Z" fill="#0B6E4F" opacity="0.18" />
          <rect x="168" y="150" width="6" height="30" fill="#0B6E4F" opacity="0.18" />
          <rect x="226" y="255" width="22" height="125" rx="2" fill="#0B6E4F" opacity="0.14" />
          <rect x="500" y="245" width="24" height="135" rx="2" fill="#B8892B" opacity="0.13" />
          {/* Al Faisaliah-style tapered tower */}
          <path d="M556 380 L562 220 Q564 205 572 195 Q580 205 582 220 L588 380 Z" fill="#B8892B" opacity="0.16" />
          <circle cx="572" cy="196" r="5" fill="#B8892B" opacity="0.18" />
        </g>

        {/* ground line */}
        <line x1="20" y1="380" x2="620" y2="380" stroke="#0B6E4F" strokeOpacity="0.15" strokeWidth="2" />

        {/* till / counter */}
        <g className="sp-illo-float-slow">
          <rect x="230" y="330" width="130" height="52" rx="8" fill="#fff" stroke="#E9E5D8" strokeWidth="2" />
          <rect x="244" y="344" width="46" height="24" rx="5" fill="#F4F2EA" />
          <circle cx="330" cy="356" r="9" fill="#0B6E4F" opacity="0.85" className="sp-illo-pulse" />
          <path d="M326 356 l3 4 6 -8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* customer silhouette */}
        <g className="sp-illo-float">
          <circle cx="290" cy="255" r="26" fill="#12201A" opacity="0.85" />
          <path d="M244 335 Q244 280 290 280 Q336 280 336 335 Z" fill="#12201A" opacity="0.85" />
          {/* phone in hand */}
          <rect x="300" y="270" width="30" height="52" rx="7" fill="#0B6E4F" transform="rotate(8 300 270)" />
          <rect x="304" y="277" width="22" height="34" rx="2" fill="#FDFCF9" transform="rotate(8 300 270)" />
        </g>

        {/* QR card floating above the till */}
        <g className="sp-illo-float sp-illo-qr">
          <rect x="352" y="228" width="72" height="72" rx="12" fill="#fff" stroke="#DCD8CC" strokeWidth="2" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}-${c}`} x={362 + c * 18} y={238 + r * 18} width="12" height="12" rx="2"
                fill={(r + c) % 2 === 0 ? '#12201A' : 'transparent'} />
            ))
          )}
        </g>

        {/* scan beam connecting phone to QR */}
        <path className="sp-illo-beam" d="M318 275 Q345 255 372 258" stroke="#B8892B" strokeWidth="2.5" strokeDasharray="4 6" fill="none" strokeLinecap="round" />

        {/* WhatsApp-style reply bubble with rating stars */}
        <g className="sp-illo-bubble sp-illo-float-slow">
          <rect x="420" y="120" width="180" height="86" rx="18" fill="#fff" stroke="#E9E5D8" strokeWidth="2" />
          <path d="M432 206 l0 18 20 -18 z" fill="#fff" stroke="#E9E5D8" strokeWidth="2" />
          <circle cx="440" cy="142" r="9" fill="#25D366" />
          <path d="M436 142 l3 3 6 -6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="458" y="147" fontFamily="Cairo, sans-serif" fontSize="12" fontWeight="700" fill="#12201A">SurveyMatrix</text>
          {[0, 1, 2, 3, 4].map((i) => (
            <text key={i} x={440 + i * 16} y="192" fontSize="15" fill="#B8892B" className="sp-illo-star" style={{ animationDelay: `${1.1 + i * 0.12}s` }}>★</text>
          ))}
        </g>

        {/* soft accent dots */}
        <circle cx="80" cy="90" r="4" fill="#B8892B" opacity="0.4" className="sp-illo-drift" />
        <circle cx="600" cy="80" r="5" fill="#0B6E4F" opacity="0.3" className="sp-illo-drift" style={{ animationDelay: '1.2s' }} />
        <circle cx="150" cy="60" r="3" fill="#0B6E4F" opacity="0.35" className="sp-illo-drift" style={{ animationDelay: '0.6s' }} />
      </svg>
    </div>
  )
}

/** Original hand-drawn SVG scene for the "how it works" section — a live CX
 *  dashboard on screen, a security badge, and a WhatsApp-response chip.
 *  No stock photography, no AI-generated imagery — every shape is authored inline. */
function WorkflowIllustration() {
  const wrapRef = useRef(null)
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      wrap.style.setProperty('--px', px.toFixed(3))
      wrap.style.setProperty('--py', py.toFixed(3))
    }
    wrap.addEventListener('mousemove', onMove)
    return () => wrap.removeEventListener('mousemove', onMove)
  }, [])

  const bars = [34, 52, 40, 68, 86]

  return (
    <div ref={wrapRef} className="sp-how-media sp-reveal">
      <svg viewBox="0 0 560 500" className="sp-how-illo" role="img" aria-label="Illustration of a live customer-experience dashboard with a security badge and a WhatsApp response summary">
        <ellipse cx="280" cy="452" rx="190" ry="18" fill="#12201A" opacity="0.06" />

        {/* monitor stand */}
        <rect x="255" y="378" width="50" height="34" rx="4" fill="#E9E5D8" />
        <rect x="210" y="408" width="140" height="12" rx="6" fill="#E9E5D8" />

        {/* screen */}
        <rect x="70" y="60" width="420" height="322" rx="18" fill="#FDFCF9" stroke="#E9E5D8" strokeWidth="2.5" />
        <rect x="70" y="60" width="420" height="46" rx="18" fill="#F4F2EA" />
        <rect x="70" y="88" width="420" height="18" fill="#F4F2EA" />
        <circle cx="96" cy="83" r="5" fill="#DCD8CC" />
        <circle cx="114" cy="83" r="5" fill="#DCD8CC" />
        <circle cx="132" cy="83" r="5" fill="#DCD8CC" />
        
        {/* bar chart */}
        <g transform="translate(102, 320)">
          {bars.map((h, i) => (
            <rect
              key={i}
              x={i * 44}
              y={-h}
              width="26"
              height={h}
              rx="6"
              fill={i === bars.length - 1 ? '#0B6E4F' : '#0B6E4F'}
              opacity={i === bars.length - 1 ? 1 : 0.28 + i * 0.12}
              className="sp-illo-bar"
              style={{ animationDelay: `${0.3 + i * 0.09}s` }}
            />
          ))}
        </g>
        <path className="sp-illo-beam" d="M102 268 Q160 232 210 248 T340 208" stroke="#B8892B" strokeWidth="2.5" strokeDasharray="4 7" fill="none" strokeLinecap="round" />

        {/* CSAT gauge */}
        <g transform="translate(414, 268)">
          <circle r="42" fill="#fff" stroke="#E9E5D8" strokeWidth="2" />
          <circle r="34" fill="none" stroke="#EAF4EE" strokeWidth="8" />
          <circle r="34" fill="none" stroke="#0B6E4F" strokeWidth="8" strokeLinecap="round"
            strokeDasharray="213.6" strokeDashoffset="213.6" transform="rotate(-90)" className="sp-illo-ring" />
          <text textAnchor="middle" y="-2" fontFamily="Cairo, sans-serif" fontWeight="800" fontSize="17" fill="#12201A">97%</text>
          <text textAnchor="middle" y="14" fontFamily="Cairo, sans-serif" fontSize="9.5" fill="#7A8480" direction="rtl">رضا العملاء</text>
        </g>

        <text x="102" y="345" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fill="#9AA29E">Mon</text>
        <text x="146" y="345" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fill="#9AA29E">Tue</text>
        <text x="190" y="345" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fill="#9AA29E">Wed</text>
        <text x="234" y="345" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fill="#9AA29E">Thu</text>
        <text x="278" y="345" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fill="#9AA29E">Fri</text>

        {/* PDPL / security badge, floating outside the screen */}
        <g className="sp-illo-float-slow" transform="translate(30, 20)">
          <rect width="132" height="56" rx="14" fill="#fff" stroke="#E9E5D8" strokeWidth="2" />
          <circle cx="30" cy="28" r="15" fill="#EAF4EE" />
          <path d="M30 19 l9 4 v9 q0 9 -9 12 q-9 -3 -9 -12 v-9 z" fill="#0B6E4F" />
          <path d="M26 28 l3 3 6 -6" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="54" y="24" fontFamily="Cairo, sans-serif" fontSize="11" fontWeight="700" fill="#12201A">PDPL-ready</text>
          <text x="54" y="39" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9.5" fill="#7A8480">Hosted in KSA</text>
        </g>

        {/* WhatsApp response chip, floating below-left of the screen */}
        <circle cx="520" cy="60" r="4" fill="#B8892B" opacity="0.35" className="sp-illo-drift" />
        <circle cx="40" cy="200" r="3.5" fill="#0B6E4F" opacity="0.3" className="sp-illo-drift" style={{ animationDelay: '0.8s' }} />
      </svg>
    </div>
  )
}

export default function Home() {
  useReveal()
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .sp-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #FDFCF9; color: #1C2321; }

        /* ── reveal-on-scroll ── */
        .sp-reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1); }
        .sp-reveal.sp-visible { opacity: 1; transform: translateY(0); }

        /* ── hero entrance ── */
        @keyframes spFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .sp-enter { opacity: 0; animation: spFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes spDrift { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-10px, 8px); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }

        .sp-hero { min-height: 100vh; background: #FDFCF9; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 130px 24px 60px; position: relative; overflow: hidden; }
        .sp-hero::before { content: ''; position: absolute; inset: -20px; background:
          radial-gradient(ellipse 70% 55% at 50% 0%, rgba(11,110,79,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 100% 100%, rgba(184,137,43,0.07) 0%, transparent 70%);
          pointer-events: none; animation: spDrift 14s ease-in-out infinite; }
        .sp-hero::after { content: ''; position: absolute; inset: 0; opacity: 0.55;
          background-image: radial-gradient(circle at 1px 1px, rgba(11,110,79,0.10) 1.4px, transparent 0);
          background-size: 28px 28px;
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 20%, black 0%, transparent 75%);
          mask-image: radial-gradient(ellipse 70% 60% at 50% 20%, black 0%, transparent 75%);
          pointer-events: none; }

        .sp-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 999px; background: rgba(11,110,79,0.08); border: 1px solid rgba(11,110,79,0.22); margin-bottom: 32px; position: relative; z-index: 1; }
        .sp-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #0B6E4F; animation: pulse 2s ease-in-out infinite; }
        .sp-badge-text { font-size: 13px; color: #0B6E4F; font-weight: 600; letter-spacing: 0.02em; font-family: 'Cairo', sans-serif; }
        .sp-badge-ar { font-size: 13px; color: #0B6E4F; font-weight: 600; direction: rtl; }

        .sp-h1 { font-family: 'Cairo', sans-serif; font-size: clamp(30px, 6.5vw, 64px); font-weight: 700; line-height: 1.16; color: #12201A; letter-spacing: -1.2px; margin-bottom: 24px; max-width: 780px; position: relative; z-index: 1; }
        .sp-h1-accent { display: block; font-weight: 800; background: linear-gradient(90deg, #0B6E4F 0%, #B8892B 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .sp-hero-sub { font-size: clamp(15px, 2vw, 18px); color: #5B6663; max-width: 580px; margin: 0 auto 36px; line-height: 1.85; font-weight: 400; letter-spacing: 0.01em; position: relative; z-index: 1; }

        .sp-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 15px 32px; border-radius: 10px; font-size: 15px; font-weight: 600; background: #0B6E4F; color: #fff; border: none; cursor: pointer; letter-spacing: 0.01em; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; position: relative; overflow: hidden; }
        .sp-btn-primary::before { content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent); transform: skewX(-20deg); transition: left 0.6s ease; }
        .sp-btn-primary:hover::before { left: 130%; }
        .sp-btn-primary:hover { background: #085C41; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(11,110,79,0.25); }
        .sp-btn-primary .sp-arrow { display: inline-block; transition: transform 0.2s; }
        .sp-btn-primary:hover .sp-arrow { transform: translateX(4px); }

        .sp-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 15px 32px; border-radius: 10px; font-size: 15px; font-weight: 500; background: #fff; color: #1C2321; border: 1px solid #DCD8CC; cursor: pointer; transition: background 0.2s, border-color 0.2s, transform 0.15s; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; }
        .sp-btn-ghost:hover { background: #F4F2EA; border-color: #0B6E4F; transform: translateY(-2px); }
        .sp-hero-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; }

        /* ── hero illustration ── */
        .sp-hero-illo-wrap { width: min(640px, 92vw); margin: 44px auto 0; position: relative; z-index: 1; perspective: 900px; }
        .sp-hero-illo { width: 100%; height: auto; display: block; transform: translate(calc(var(--px, 0) * -10px), calc(var(--py, 0) * -8px)); transition: transform 0.15s ease-out; }
        .sp-illo-float { animation: spIlloFloat 5s ease-in-out infinite; transform-origin: center; }
        .sp-illo-float-slow { animation: spIlloFloat 7s ease-in-out infinite; transform-origin: center; }
        @keyframes spIlloFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        .sp-illo-drift { animation: spDrift 6s ease-in-out infinite; }
        .sp-illo-pulse { animation: pulse 2s ease-in-out infinite; }
        .sp-illo-beam { animation: spDash 1.4s linear infinite; }
        @keyframes spDash { to { stroke-dashoffset: -20; } }
        .sp-illo-star { opacity: 0; animation: spStarIn 0.4s ease forwards; }
        @keyframes spStarIn { from { opacity: 0; transform: scale(0.4) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .sp-illo-bubble, .sp-illo-qr { opacity: 0; animation: spFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .sp-illo-qr { animation-delay: 0.75s; }
        .sp-illo-bubble { animation-delay: 0.95s; }

        .sp-journey { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 6px; position: relative; z-index: 1; }
        .sp-journey-step { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #E9E5D8; border-radius: 999px; padding: 8px 16px 8px 10px; font-size: 12.5px; color: #3f4744; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .sp-journey-step:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(11,110,79,0.1); border-color: #C7DED2; }
        .sp-journey-icon { width: 24px; height: 24px; border-radius: 50%; background: #EAF4EE; color: #0B6E4F; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
        .sp-journey-ar { font-family: 'Cairo', sans-serif; font-weight: 700; color: #0B6E4F; direction: rtl; }
        .sp-journey-arrow { color: #C7C2B0; font-size: 13px; }

        .sp-stats { display: flex; gap: 40px; margin-top: 56px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; }
        .sp-stat-val { font-family: 'Cairo', sans-serif; font-size: clamp(24px, 5vw, 34px); font-weight: 800; color: #12201A; letter-spacing: -1px; line-height: 1; display: inline-block; }
        .sp-stat-label { font-size: 13px; color: #7A8480; margin-top: 6px; font-weight: 400; letter-spacing: 0.01em; max-width: 150px; }

        .sp-section { padding: 80px 24px; }
        .sp-section-light { background: #FDFCF9; }
        .sp-section-tinted { background: #F4F2EA; }
        .sp-section-tag { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; color: #B8892B; text-transform: uppercase; display: block; margin-bottom: 14px; }
        .sp-h2 { font-family: 'Cairo', sans-serif; font-size: clamp(23px, 3.6vw, 40px); font-weight: 700; letter-spacing: -0.8px; color: #12201A; line-height: 1.3; max-width: 660px; margin: 0 auto; }
        .sp-section-desc { font-size: 16px; color: #6b7280; margin-top: 16px; line-height: 1.8; font-weight: 400; max-width: 520px; margin-left: auto; margin-right: auto; }

        .sp-grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; max-width: 1080px; margin: 56px auto 0; }
        .sp-card { background: #fff; border-radius: 16px; padding: 28px 24px; border: 1px solid #E9E5D8; transition: box-shadow 0.25s, border-color 0.25s; will-change: transform; }
        .sp-card:hover { box-shadow: 0 18px 48px rgba(11,110,79,0.10); border-color: #C7DED2; }
        .sp-card-icon { width: 52px; height: 52px; border-radius: 13px; background: #EAF4EE; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 18px; transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .sp-card:hover .sp-card-icon { transform: scale(1.1) rotate(-4deg); }
        .sp-card-title { font-family: 'Cairo', sans-serif; font-size: 16px; font-weight: 700; color: #12201A; margin-bottom: 10px; letter-spacing: -0.2px; line-height: 1.4; }
        .sp-card-desc { font-size: 14px; color: #6b7280; line-height: 1.75; font-weight: 400; }

        /* ── how-it-works: big illustration + content, no card grid ── */
        .sp-how-block { display: grid; grid-template-columns: 1.05fr 1fr; gap: 56px; align-items: center; max-width: 1120px; margin: 56px auto 0; }
        .sp-how-media { position: relative; perspective: 900px; }
        .sp-how-illo { width: 100%; height: auto; display: block; transform: translate(calc(var(--px, 0) * -8px), calc(var(--py, 0) * -6px)); transition: transform 0.15s ease-out; }
        .sp-how-feature-list { display: flex; flex-direction: column; }
        .sp-feature-row { display: flex; gap: 16px; padding: 17px 6px; border-bottom: 1px solid #E9E5D8; transition: padding-left 0.25s ease, background 0.25s ease; border-radius: 10px; }
        .sp-feature-row:last-child { border-bottom: none; }
        .sp-feature-row:hover { padding-left: 12px; background: rgba(11,110,79,0.04); }
        .sp-feature-row-icon { width: 42px; height: 42px; border-radius: 12px; background: #EAF4EE; display: flex; align-items: center; justify-content: center; font-size: 19px; flex-shrink: 0; }
        .sp-feature-row-title { font-family: 'Cairo', sans-serif; font-weight: 700; font-size: 15px; color: #12201A; margin-bottom: 4px; letter-spacing: -0.1px; line-height: 1.4; }
        .sp-feature-row-desc { font-size: 13.5px; color: #6b7280; line-height: 1.7; font-weight: 400; }
        @keyframes spBarGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .sp-illo-bar { transform-box: fill-box; transform-origin: bottom; animation: spBarGrow 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .sp-illo-ring { animation: spRingIn 1.3s cubic-bezier(0.16,1,0.3,1) 0.4s forwards; }
        @keyframes spRingIn { to { stroke-dashoffset: 32; } }

        .sp-stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1px; background: #E9E5D8; border: 1px solid #E9E5D8; border-radius: 16px; overflow: hidden; max-width: 880px; margin: 56px auto 0; }
        .sp-stat-cell { padding: 28px 20px; background: #fff; text-align: center; transition: background 0.2s; }
        .sp-stat-cell:hover { background: #FBF9F3; }
        .sp-stat-cell-val { font-family: 'Cairo', sans-serif; font-size: clamp(24px, 5vw, 36px); font-weight: 800; color: #0B6E4F; letter-spacing: -1.5px; line-height: 1; display: inline-block; }
        .sp-stat-cell-label { font-size: 13px; color: #7A8480; margin-top: 6px; font-weight: 400; }

        /* ── testimonials: pinned postcard wall, deliberately imperfect ── */
        .sp-wall { display: flex; flex-wrap: wrap; gap: 28px 24px; justify-content: center; max-width: 1080px; margin: 64px auto 0; }
        .sp-note { position: relative; width: 310px; background: #fff; border-radius: 4px; padding: 30px 24px 24px; border: 1px solid #E9E5D8; box-shadow: 0 14px 30px rgba(28,35,33,0.07); transform: rotate(var(--rot, 0deg)); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease; }
        .sp-note:hover { transform: rotate(0deg) translateY(-6px); box-shadow: 0 24px 48px rgba(28,35,33,0.14); z-index: 2; }
        .sp-note-pin { position: absolute; top: -9px; left: 50%; transform: translateX(-50%); width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 3px 6px rgba(0,0,0,0.25); }
        .sp-note-pin::after { content: ''; position: absolute; inset: 4px; border-radius: 50%; background: rgba(255,255,255,0.55); }
        .sp-note-quote-mark { font-family: 'Cairo', sans-serif; font-size: 46px; font-weight: 800; line-height: 1; opacity: 0.25; display: block; margin-bottom: -10px; }
        .sp-note-quote { font-family: 'Cairo', sans-serif; font-size: 15.5px; font-weight: 600; color: #1C2321; line-height: 1.6; letter-spacing: -0.1px; margin-bottom: 18px; min-height: 108px; }
        .sp-note-metric { display: flex; align-items: baseline; gap: 8px; padding-top: 14px; border-top: 1px dashed #E9E5D8; margin-bottom: 14px; }
        .sp-note-metric-val { font-family: 'Cairo', sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .sp-note-metric-label { font-size: 12px; color: #7A8480; font-weight: 500; }
        .sp-note-attrib { display: flex; flex-direction: column; }
        .sp-note-person { font-family: 'Cairo', sans-serif; font-size: 13.5px; font-weight: 700; color: #12201A; }
        .sp-note-org { font-size: 12px; color: #9AA29E; margin-top: 2px; }

        .sp-cta { padding: 80px 24px; background: #F4F2EA; text-align: center; position: relative; overflow: hidden; }
        .sp-cta::before { content: ''; position: absolute; inset: -20px; opacity: 0.5;
          background-image: radial-gradient(circle at 1px 1px, rgba(11,110,79,0.12) 1.4px, transparent 0);
          background-size: 28px 28px;
          -webkit-mask-image: radial-gradient(ellipse 60% 100% at 50% 50%, black 0%, transparent 80%);
          mask-image: radial-gradient(ellipse 60% 100% at 50% 50%, black 0%, transparent 80%);
          animation: spDrift 16s ease-in-out infinite; }
        .sp-cta-sub { font-size: 16px; color: #6b7280; margin: 14px 0 40px; font-weight: 400; line-height: 1.75; max-width: 480px; margin-left: auto; margin-right: auto; position: relative; }
        .sp-btn-amber { display: inline-flex; align-items: center; gap: 8px; padding: 15px 36px; border-radius: 10px; font-size: 15px; font-weight: 600; background: #B8892B; color: #fff; border: none; cursor: pointer; text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; position: relative; z-index: 1; }
        .sp-btn-amber:hover { background: #9C7423; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(184,137,43,0.3); }

        .sp-footer { padding: 24px 24px; background: #FFFFFF; border-top: 1px solid #E9E5D8; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .sp-footer-logo { font-family: 'Cairo', sans-serif; font-weight: 700; color: #12201A; font-size: 18px; letter-spacing: 0.2px; }
        .sp-footer-copy { font-size: 12px; color: #9AA29E; }

        .sp-divider { width: 48px; height: 3px; background: linear-gradient(90deg, #0B6E4F, #B8892B); border-radius: 99px; margin: 20px auto 0; transform-origin: center; animation: spDividerGrow 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        @keyframes spDividerGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

        @media (min-width: 900px) { .left-panel { display: flex !important; } }

        @media (prefers-reduced-motion: reduce) {
          .sp-reveal, .sp-enter { opacity: 1 !important; transform: none !important; animation: none !important; }
          .sp-hero::before, .sp-cta::before, .sp-illo-float, .sp-illo-float-slow, .sp-illo-drift, .sp-illo-pulse, .sp-illo-beam, .sp-illo-star, .sp-illo-bubble, .sp-illo-qr, .sp-illo-bar { animation: none !important; opacity: 1 !important; transform: none !important; }
          .sp-illo-ring { animation: none !important; stroke-dashoffset: 32 !important; }
          .sp-note { transform: none !important; }
          .sp-note:hover { transform: translateY(-6px) !important; }
          .sp-hero-illo, .sp-how-illo { transform: none !important; }
        }

        /* ── Mobile overrides ── */
        @media (max-width: 600px) {
          .sp-hero { padding: 100px 20px 50px; }
          .sp-h1 { letter-spacing: -0.5px; }
          .sp-hero-illo-wrap { margin-top: 32px; }
          .sp-journey { gap: 8px; }
          .sp-journey-step { padding: 7px 12px 7px 8px; font-size: 12px; }
          .sp-stats { gap: 28px; margin-top: 44px; }
          .sp-hero-btns .sp-btn-primary, .sp-hero-btns .sp-btn-ghost { width: 100%; justify-content: center; padding: 14px 24px; }
          .sp-section { padding: 60px 20px; }
          .sp-grid-3 { grid-template-columns: 1fr; }
          .sp-how-block { grid-template-columns: 1fr; gap: 36px; margin-top: 40px; }
          .sp-feature-row { padding: 15px 4px; }
          .sp-wall { gap: 20px; margin-top: 44px; }
          .sp-note { width: 100%; max-width: 340px; transform: none; }
          .sp-note:hover { transform: translateY(-4px); }
          .sp-note-quote { min-height: 0; }
          .sp-stats-row { grid-template-columns: 1fr 1fr; }
          .sp-footer { flex-direction: column; text-align: center; gap: 8px; }
        }
      `}</style>

      <div className="sp-root">
        <Navbar />

        {/* HERO */}
        <section className="sp-hero">
          <h1 className="sp-h1 sp-enter" style={{ animationDelay: '0.15s' }}>
            Most CX surveys in the Kingdom get ignored
            Ours get finished.
          </h1>
          <p className="sp-hero-sub sp-enter" style={{ animationDelay: '0.28s' }}>
            We build surveys people actually answer — Arabic first, English second, short enough
            to finish while a mada receipt is still printing at the till.
          </p>
          <div className="sp-hero-btns sp-enter" style={{ animationDelay: '0.4s' }}>
            <Link to="/login" className="sp-btn-primary">Open the dashboard <span className="sp-arrow">→</span></Link>
            <Link to="/about" className="sp-btn-ghost">See it in action</Link>
          </div>

          <HeroIllustration />

          <div className="sp-journey sp-enter" style={{ animationDelay: '0.85s' }}>
            {JOURNEY.map((step, i) => (
              <div key={step.en} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="sp-journey-step">
                  <span className="sp-journey-icon">{step.icon}</span>
                  <span className="sp-journey-ar">{step.ar}</span>
                  <span style={{ color: '#DCD8CC' }}>·</span>
                  <span>{step.en}</span>
                </div>
                {i < JOURNEY.length - 1 && <span className="sp-journey-arrow">←</span>}
              </div>
            ))}
          </div>

          <div className="sp-stats sp-enter" style={{ animationDelay: '0.95s' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <AnimatedNumber value={s.value} className="sp-stat-val" />
                <div className="sp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="sp-section sp-section-tinted">
          <div style={{ textAlign: 'center' }} className="sp-reveal">
            <span className="sp-section-tag">How it actually works</span>
            <h2 className="sp-h2">Built by people who've run surveys in Arabic before</h2>
            <div className="sp-divider" />
            <p className="sp-section-desc">Not a checklist of features — just the parts that mattered enough to build twice.</p>
          </div>
          <div className="sp-how-block">
            <WorkflowIllustration />
            <div className="sp-how-feature-list">
              {FEATURES.map((f, i) => (
                <div key={f.title} className="sp-feature-row sp-reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                  <div className="sp-feature-row-icon">{f.icon}</div>
                  <div>
                    <div className="sp-feature-row-title">{f.title}</div>
                    <p className="sp-feature-row-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NUMBERS */}
        <section className="sp-section sp-section-light">
          <div style={{ textAlign: 'center' }} className="sp-reveal">
            <span className="sp-section-tag">The honest numbers</span>
            <h2 className="sp-h2" style={{ maxWidth: 560 }}>We'd rather show you real figures than a vision statement</h2>
            <div className="sp-divider" />
            <p className="sp-section-desc">No projections. This is what shipped, region by region, since we started.</p>
          </div>
          <div className="sp-stats-row sp-reveal">
            {STATS.map((s) => (
              <div key={s.label} className="sp-stat-cell">
                <AnimatedNumber value={s.value} className="sp-stat-cell-val" />
                <div className="sp-stat-cell-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="sp-section sp-section-tinted">
          <div style={{ textAlign: 'center' }} className="sp-reveal">
            <span className="sp-section-tag">What teams tell us</span>
            <h2 className="sp-h2">Not a vision statement — this is what people say after switching</h2>
            <div className="sp-divider" />
            <p className="sp-section-desc">A few honest lines from the operations and CX teams actually running this day to day.</p>
          </div>
          <div className="sp-wall">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.person + t.org}
                className="sp-note sp-reveal"
                style={{ transitionDelay: `${i * 110}ms`, '--rot': t.rotate }}
              >
                <span className="sp-note-pin" style={{ background: t.accent }} aria-hidden="true" />
                <span className="sp-note-quote-mark" style={{ color: t.accent }} aria-hidden="true">&ldquo;</span>
                <p className="sp-note-quote">{t.quote}</p>
                <div className="sp-note-metric">
                  <span className="sp-note-metric-val" style={{ color: t.accent }}>{t.metric}</span>
                  <span className="sp-note-metric-label">{t.metricLabel}</span>
                </div>
                <div className="sp-note-attrib">
                  <span className="sp-note-person">{t.person}</span>
                  <span className="sp-note-org">{t.org} · {t.city}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="sp-cta">
          <div className="sp-reveal">
            <span className="sp-section-tag">Get started</span>
            <h2 className="sp-h2">Want to see it running on your own data?</h2>
            <p className="sp-cta-sub">No generic demo account — we'll set it up with your actual branch names and product lines.</p>
            <Link to="/login" className="sp-btn-amber">Show me a real demo</Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
