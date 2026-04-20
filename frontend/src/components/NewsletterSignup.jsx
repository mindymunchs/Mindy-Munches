import { useState } from 'react'
import { motion } from 'framer-motion'

const NewsletterSignup = () => {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubscribing(true)
    setMessage('')

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/newsletter/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), source: 'homepage' }),
        }
      )

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setMessage(data.message || 'Thank you for subscribing!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.message || 'Failed to subscribe. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    } finally {
      setIsSubscribing(false)
      setTimeout(() => { setMessage(''); setStatus('') }, 5000)
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 left-4 w-24 h-24 rounded-full border-2 border-black/10"></div>
          <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-black/5"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              d="M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60 L1440,120 L0,120 Z"
              fill="#1F2937"
            />
          </svg>
        </div>

        <div className="absolute right-0 bottom-0 w-1/2 h-full flex items-end justify-end overflow-hidden">
          <div className="flex items-end space-x-2 pb-8 pr-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`${i % 2 === 0 ? 'bg-neutral-700' : 'bg-neutral-600'} relative`}
                style={{
                  width: `${20 + i * 8}px`,
                  height: `${40 + i * 12}px`,
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800 mb-4">
              Sign up for exclusive deals, new launches &amp; exciting events!
            </h2>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email here"
                  required
                  disabled={isSubscribing}
                  className="flex-1 px-4 py-3 bg-white border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-800 transition-colors text-neutral-800 placeholder-neutral-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className={`px-8 py-3 bg-neutral-800 hover:bg-neutral-900 text-white font-semibold rounded-lg transition-all duration-200 ${
                    isSubscribing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                >
                  {isSubscribing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>SUBMITTING...</span>
                    </div>
                  ) : (
                    'SUBMIT'
                  )}
                </button>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-lg text-sm font-medium max-w-md ${
                    status === 'success'
                      ? 'bg-green-100 border border-green-300 text-green-700'
                      : 'bg-red-100 border border-red-300 text-red-700'
                  }`}
                >
                  {message}
                </motion.div>
              )}
            </form>

            <p className="text-sm text-neutral-700 mt-4 opacity-75">
              Join thousands of health-conscious food lovers who never miss out on our latest updates and special offers.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSignup
