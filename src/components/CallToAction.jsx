const CallToAction = () => {
  const scrollToBooking = (e) => {
    e.preventDefault()
    const target = document.querySelector('#bookingForm')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="cta content-section">
      <div className="container">
        <h2>Ready to Experience Unrivaled Luxury Transportation?</h2>
        <p>Secure your exclusive ride today.</p>
        <div className="cta-buttons">
          <a href="#bookingForm" className="btn primary" onClick={scrollToBooking}>
            <i className="fas fa-car"></i> Book Your Luxury Ride Now
          </a>
          <a href="#bookingForm" className="btn secondary" onClick={scrollToBooking}>
            <i className="fas fa-quote-left"></i> Get a Free Quote Instantly
          </a>
        </div>
      </div>
    </section>
  )
}

export default CallToAction 