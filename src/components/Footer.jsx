import { useEffect } from 'react'

const Footer = () => {
  useEffect(() => {
    // Set current year
    const yearElement = document.getElementById('year')
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear()
    }
  }, [])

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Serving the Greater DMV Area</h3>
            <p>
              Proudly providing luxury car and limo services across Maryland (including Baltimore, Rockville, Silver Spring, and surrounding areas), Washington D.C., and Virginia (Arlington, Alexandria, Fairfax, and beyond).
            </p>
          </div>
          <div className="footer-section">
            <h3>Specializing In</h3>
            <p>
              Your go-to source for premium hourly car service, elegant limo service, unforgettable wedding transportation, thrilling night out car rides, convenient sports event transportation, and exclusive party limo rentals.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; <span id="year"></span> EZ Limos - Premium Car & Limo Service. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 