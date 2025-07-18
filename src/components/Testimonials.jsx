import { useRef, useState, useEffect } from 'react'

const Testimonials = () => {
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollButtons)
      return () => scrollContainer.removeEventListener('scroll', checkScrollButtons)
    }
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 380 + 25 // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 380 + 25 // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="testimonials content-section">
      <div className="container">
        <h2>What Our Clients Say</h2>
        <div className="testimonials-wrapper">
          {canScrollLeft && (
            <button className="scroll-arrow scroll-arrow-left" onClick={scrollLeft}>
              <i className="fas fa-chevron-left"></i>
            </button>
          )}
          {canScrollRight && (
            <button className="scroll-arrow scroll-arrow-right" onClick={scrollRight}>
              <i className="fas fa-chevron-right"></i>
            </button>
          )}
          <div className="testimonial-cards" ref={scrollContainerRef}>
            <div className="testimonial-card">
              <i className="fas fa-quote-left"></i>
              <p>"Outstanding service! Professional chauffeurs, immaculate vehicles, and punctual arrivals. EZ Limos exceeded all expectations for our corporate event."</p>
              <span>Sarah Thompson</span>
            </div>
            <div className="testimonial-card">
              <i className="fas fa-quote-left"></i>
              <p>"Perfect wedding day transportation! The luxury vehicle was pristine and our driver was courteous and professional. Highly recommend!"</p>
              <span>James & Maria Rodriguez</span>
            </div>
            <div className="testimonial-card">
              <i className="fas fa-quote-left"></i>
              <p>"Best airport transfer service in the DMV area. Always on time, comfortable rides, and transparent pricing. Will definitely use again!"</p>
              <span>Michael Chen</span>
            </div>
            <div className="testimonial-card">
              <i className="fas fa-quote-left"></i>
              <p>"Exceptional hourly service for our night out. The driver was patient, professional, and made our celebration stress-free. Five stars!"</p>
              <span>Jennifer Martinez</span>
            </div>
            <div className="testimonial-card">
              <i className="fas fa-quote-left"></i>
              <p>"Reliable, luxurious, and affordable. EZ Limos is our go-to for all business transportation needs. Never disappointed!"</p>
              <span>David Kim</span>
            </div>
            <div className="testimonial-card">
              <i className="fas fa-quote-left"></i>
              <p>"Clean vehicles, professional drivers, competitive rates. The best limo service experience we've had in Maryland!"</p>
              <span>Lisa Peterson</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials 