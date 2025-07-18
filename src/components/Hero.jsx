import BookingForm from './BookingForm'
import { useEffect } from 'react'

const Hero = () => {
  useEffect(() => {
    // Add scroll behavior for smooth navigation
    const addSmoothScrolling = () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault()
          const target = document.querySelector(this.getAttribute('href'))
          if (target) {
            // Calculate header height dynamically and add padding
            const header = document.getElementById('header')
            const headerHeight = header ? header.offsetHeight : 80
            const extraPadding = window.innerWidth <= 768 ? 15 : 25
            const offset = headerHeight + extraPadding
            
            // Get target position relative to document
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset
            
            // Smooth scroll to position
            window.scrollTo({
              top: Math.max(0, targetPosition),
              behavior: 'smooth'
            })
          }
        })
      })
    }

    addSmoothScrolling()
  }, [])

  return (
    <section className="hero">
      <div className="container hero-flex">
        <div className="hero-content">
          <div className="hero-logo"></div>
          <h1>Elevate Your Journey: Premium Car & Limo Service in MD, DC & VA</h1>
          <p className="hero-subheadline">
            Seamless, Stylish & Stress-Free Transportation for Every Occasion – From Hourly Charters to Unforgettable Events.
          </p>
          <div className="hero-phone">
            <span className="phone-label">Call for Instant Booking:</span>
            <a href="tel:1234567890" className="hero-phone-link">
              <i className="fas fa-phone-alt"></i> (123) 456-7890
            </a>
          </div>
        </div>
        <div className="form-card">
          <BookingForm />
        </div>
      </div>
    </section>
  )
}

export default Hero 