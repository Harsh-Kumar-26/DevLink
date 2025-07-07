import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import Button from '../components/Button';
import Footer from '../components/Landingfooter';

const features = [
  { title: 'Live Real-Time Chat', desc: 'Sleek messaging with typing indicators.' },
  { title: 'Ratings & Reviews', desc: 'Mutual feedback builds strong trust.' },
  { title: 'Profile Transparency', desc: 'See histories before engagement.' },
  { title: 'Skill Tags & Filters', desc: 'Find devs using React, Python & more.' },
  { title: 'Project Browsing', desc: 'Browse clients by budget & timeline.' },
  { title: 'Secure Payments', desc: 'Escrow ensures trusted delivery.' },
  { title: 'Portfolio Building', desc: 'Automatically build your showcase.' },
];

function Feature({ title, desc, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: 'spring', stiffness: 60, damping: 18 }}
      className={`
        relative max-w-2xl mx-auto my-16 flex items-center
        ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}
        hover:scale-[1.01] hover:border-purple-400 border-2 border-transparent rounded-xl
        transition-transform duration-300`}
    >
      <div className="bg-gray-800 rounded-xl p-8 w-full md:w-3/4 z-10">
        <h3 className="text-2xl font-bold text-purple-300 mb-3">{title}</h3>
        <p className="text-gray-300">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useViewportScroll();
  const pathLength = 1200;
  const dashOffset = useTransform(scrollYProgress, [0.1, 0.8], [pathLength, 0]);

  return (
    <div className="bg-black text-white overflow-x-hidden scroll-smooth">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between px-6 py-4 backdrop-blur bg-black/60">
        <Link to="/" className="text-2xl font-bold text-purple-400">DevLink</Link>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
          <Link to="/signup"><Button variant="green">Sign Up</Button></Link>
        </div>
      </nav>

      {/* Hero with Parallax */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-black to-green-900/30 blur-3xl" />
          {['top-left','top-right','bottom-left','bottom-right'].map((corner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ duration: 3 + i * 0.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
              className={`
                absolute ${corner.includes('top') ? 'top-0' : 'bottom-0'}
                ${corner.includes('left') ? 'left-0' : 'right-0'}
                w-[500px] h-[500px] bg-${corner.includes('left') ? 'purple' : 'green'}-500
                rounded-full filter blur-3xl
              `}
            />
          ))}
        </div>

        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                   className="text-5xl md:text-6xl font-extrabold z-10">
          Power Your Projects with <span className="text-purple-400">DevLink</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="mt-4 text-lg text-gray-300 z-10">
          Connect. Collaborate. Get things built.
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }} className="mt-8 z-10">
          <Link to="/signup"><Button variant="green">Get Started</Button></Link>
        </motion.div>
      </section>

      {/* Features with Wavy Wire */}
      <section className="relative max-w-4xl mx-auto px-6 md:px-12 py-24">
        <svg viewBox="0 0 100 1200" preserveAspectRatio="none"
             className="absolute left-0 top-16 h-[1200px] w-24 pointer-events-none z-0">
          <defs>
            <linearGradient id="wireGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9f7aea" />
              <stop offset="50%" stopColor="#38a169" />
              <stop offset="100%" stopColor="#9f7aea" />
            </linearGradient>
            <filter id="glow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#9f7aea" floodOpacity="0.7"/>
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38a169" floodOpacity="0.5"/>
            </filter>
          </defs>
          <motion.path
            d="M12 0 C40 150,-20 300,12 450 S60 750,12 900 S40 1150,12 1200"
            fill="transparent" stroke="url(#wireGradient)" strokeWidth="3"
            strokeLinecap="round" filter="url(#glow)"
            strokeDasharray={pathLength} style={{ strokeDashoffset: dashOffset }}
          />
          {/* Pulsing Nodes */}
          {features.map((_, i) => (
            <motion.circle
              key={i}
              cx={12} cy={(i * 150) + 100}
              r="6" fill="url(#wireGradient)"
              filter="url(#glow)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.5, yoyo: Infinity }}
            />
          ))}
        </svg>

        <div className="relative space-y-32 ml-24">
          {features.map((f, i) => <Feature key={i} {...f} index={i} />)}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 text-center bg-gradient-to-b from-black to-gray-900">
        <div className="absolute inset-0 bg-[url('/stars-bg.png')] bg-cover opacity-10"/>
        <div className="relative z-10 px-6">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }} className="text-4xl md:text-5xl font-bold">
            Join DevLink — Where Code Meets <span className="text-green-400">Innovation</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="mt-4 text-lg text-gray-400">
            Find collaborators, ship projects, and grow your dev brand.
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }} className="mt-8">
            <Link to="/signup"><Button variant="primary">Create Account</Button></Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
