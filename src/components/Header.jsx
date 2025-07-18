import { useState } from 'react'

const Header = () => {
  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuActive(!isMobileMenuActive)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuActive(false)
  }

  const scrollToBooking = (e) => {
    e.preventDefault()
    const target = document.querySelector('#bookingForm')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    closeMobileMenu()
  }

  return (
    <header className="site-header" id="header">
      <div className="container header-flex">
        <div className="header-left">
          <span className="logo-container"></span>
          <span className="header-company">EZ Limos</span>
        </div>
        <div className="header-right">
          <a href="#bookingForm" className="btn header-btn-book" onClick={scrollToBooking}>
            <i className="fas fa-car"></i> Book Now
          </a>
          <a href="tel:1234567890" className="btn header-btn-call">
            <i className="fas fa-phone"></i>
            <span className="btn-text"> Call</span>
          </a>
        </div>
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <i className={`fas ${isMobileMenuActive ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
      <div className={`mobile-menu ${isMobileMenuActive ? 'active' : ''}`}>
        <a href="#bookingForm" className="btn primary" onClick={scrollToBooking}>
          <i className="fas fa-car"></i> Book Now
        </a>
      </div>
    </header>
  )
}

export default Header 