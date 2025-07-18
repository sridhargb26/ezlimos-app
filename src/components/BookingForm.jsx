import { useState, useEffect } from 'react'
import axios from 'axios'

const BookingForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    numPassengers: '',
    pickupLocation: '',
    dropLocation: '',
    pickupDate: '',
    pickupTime: '',
    state: '',
    city: '',
    tripType: '',
    vehicleType: '',
    specialRequests: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    // Set minimum date to today for pickup date
    const today = new Date().toISOString().split('T')[0]
    const pickupDateInput = document.getElementById('pickupDate')
    if (pickupDateInput) {
      pickupDateInput.min = today
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const requiredFields = [
      'fullName', 'email', 'phone', 'numPassengers', 
      'pickupLocation', 'dropLocation', 'pickupDate', 
      'pickupTime', 'state', 'city', 'tripType', 'vehicleType'
    ]

    const errors = {}
    let isValid = true

    for (const field of requiredFields) {
      if (!formData[field] || !formData[field].trim()) {
        errors[field] = 'This field is required'
        isValid = false
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
      isValid = false
    }

    setFieldErrors(errors)

    if (!isValid) {
      setMessage('Please fill in all required fields correctly.')
      setMessageType('error')
      // Scroll to first error
      setTimeout(() => {
        const firstErrorField = document.querySelector('.form-group input.error, .form-group select.error')
        if (firstErrorField) {
          firstErrorField.focus()
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }

    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      // Use environment variable for API URL, fallback to local development
      const apiUrl = import.meta.env.VITE_API_URL || '/api/send-quote'
      
      const response = await axios.post(apiUrl, formData)
      
      if (response.data.success) {
        setMessage(`🎉 Quote request sent successfully! Your booking ID is: ${response.data.bookingId}. We'll contact you within 24 hours.`)
        setMessageType('success')
        
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          numPassengers: '',
          pickupLocation: '',
          dropLocation: '',
          pickupDate: '',
          pickupTime: '',
          state: '',
          city: '',
          tripType: '',
          vehicleType: '',
          specialRequests: ''
        })
        
        // Scroll to success message
        setTimeout(() => {
          const successMessage = document.querySelector('.confirmation-message.success')
          if (successMessage) {
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 100)
        
      } else {
        setMessage(response.data.message || 'Failed to send quote request.')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      
      let errorMessage = 'Failed to send quote request. '
      
      if (error.response?.data?.message) {
        // Use the specific error message from the API
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage += 'Please check your information and try again.'
      } else if (error.response?.status >= 500) {
        errorMessage += 'Server error. Please try again later or call us directly at (123) 456-7890.'
      } else if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
        errorMessage += 'Please check your internet connection and try again.'
      } else if (error.message?.includes('timeout')) {
        errorMessage += 'Request timed out. Please try again.'
      } else {
        errorMessage += 'Please try again or call us directly at (123) 456-7890.'
      }
      
      setMessage(errorMessage)
      setMessageType('error')
      
      // Scroll to error message
      setTimeout(() => {
        const errorMessage = document.querySelector('.confirmation-message.error')
        if (errorMessage) {
          errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldClassName = (fieldName) => {
    let className = ''
    if (fieldErrors[fieldName]) {
      className += ' error'
    }
    return className
  }

  return (
    <>
      <form id="bookingForm" onSubmit={handleSubmit} noValidate>
        <h2 className="form-title">Get a Free Quote</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={getFieldClassName('fullName')}
              required
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {fieldErrors.fullName && <span className="field-error">{fieldErrors.fullName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={getFieldClassName('email')}
              required
              placeholder="Enter your email address"
              autoComplete="email"
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={getFieldClassName('phone')}
              required
              placeholder="Enter your phone number"
              autoComplete="tel"
            />
            {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="numPassengers">No. of Passengers</label>
            <select
              id="numPassengers"
              name="numPassengers"
              value={formData.numPassengers}
              onChange={handleChange}
              className={getFieldClassName('numPassengers')}
              required
            >
              <option value="">Select number of passengers</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11+">11+</option>
            </select>
            {fieldErrors.numPassengers && <span className="field-error">{fieldErrors.numPassengers}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pickupLocation">Pickup Location</label>
            <input
              type="text"
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className={getFieldClassName('pickupLocation')}
              required
              placeholder="Pickup address or location"
              autoComplete="address-line1"
            />
            {fieldErrors.pickupLocation && <span className="field-error">{fieldErrors.pickupLocation}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="dropLocation">Drop Location</label>
            <input
              type="text"
              id="dropLocation"
              name="dropLocation"
              value={formData.dropLocation}
              onChange={handleChange}
              className={getFieldClassName('dropLocation')}
              required
              placeholder="Drop-off address or location"
              autoComplete="address-line2"
            />
            {fieldErrors.dropLocation && <span className="field-error">{fieldErrors.dropLocation}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pickupDate">Pickup Date</label>
            <input
              type="date"
              id="pickupDate"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              className={getFieldClassName('pickupDate')}
              required
              placeholder="Select pickup date"
            />
            {fieldErrors.pickupDate && <span className="field-error">{fieldErrors.pickupDate}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="pickupTime">Pickup Time</label>
            <input
              type="time"
              id="pickupTime"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              className={getFieldClassName('pickupTime')}
              required
              placeholder="Select pickup time"
            />
            {fieldErrors.pickupTime && <span className="field-error">{fieldErrors.pickupTime}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="state">State</label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={getFieldClassName('state')}
              required
            >
              <option value="">Select your state</option>
              <option value="MD">Maryland</option>
              <option value="DC">District of Columbia</option>
              <option value="VA">Virginia</option>
            </select>
            {fieldErrors.state && <span className="field-error">{fieldErrors.state}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={getFieldClassName('city')}
              required
              placeholder="Enter city"
              autoComplete="address-level2"
            />
            {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tripType">Trip Type</label>
            <select
              id="tripType"
              name="tripType"
              value={formData.tripType}
              onChange={handleChange}
              className={getFieldClassName('tripType')}
              required
            >
              <option value="">Select your trip type</option>
              <option value="One-way">One-way</option>
              <option value="Round-trip">Round-trip</option>
              <option value="Hourly">Hourly</option>
            </select>
            {fieldErrors.tripType && <span className="field-error">{fieldErrors.tripType}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="vehicleType">Vehicle Type</label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className={getFieldClassName('vehicleType')}
              required
            >
              <option value="">Select your vehicle type</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Luxury">Luxury</option>
              <option value="Van">Van</option>
            </select>
            {fieldErrors.vehicleType && <span className="field-error">{fieldErrors.vehicleType}</span>}
          </div>
        </div>

        <button 
          type="submit" 
          className="btn primary form-submit-btn"
          disabled={isSubmitting}
          aria-label={isSubmitting ? 'Sending quote request...' : 'Submit quote request'}
        >
          <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i> 
          {isSubmitting ? 'Sending...' : 'Get My Quote'}
        </button>
      </form>
      
      {message && (
        <div id="confirmation" className={`confirmation-message ${messageType}`} style={{ display: 'block' }}>
          {message}
        </div>
      )}
    </>
  )
}

export default BookingForm 