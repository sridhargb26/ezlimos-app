import { useEffect } from 'react'

const ScrollAnimations = ({ children }) => {
  useEffect(() => {
    // Set minimum date to today for pickup date
    const pickupDateInput = document.getElementById('pickupDate')
    if (pickupDateInput) {
      const today = new Date().toISOString().split('T')[0]
      pickupDateInput.min = today
    }

    // Add intersection observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0)'
        }
      })
    }, observerOptions)

    // Observe content sections (but not the hero)
    const contentSections = document.querySelectorAll('.content-section')
    contentSections.forEach(section => {
      section.style.opacity = '0'
      section.style.transform = 'translateY(20px)'
      section.style.transition = 'all 0.5s ease'
      observer.observe(section)
    })

    // Cleanup observer on unmount
    return () => {
      contentSections.forEach(section => {
        observer.unobserve(section)
      })
    }
  }, [])

  return children
}

export default ScrollAnimations 