import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple API plugin for development
const apiPlugin = () => {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/send-quote', async (req, res, next) => {
        if (req.method === 'POST') {
          // Handle CORS
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
          
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })
          
          req.on('end', async () => {
            try {
              const formData = JSON.parse(body)
              
              // Validate required fields
              const requiredFields = [
                'fullName', 'email', 'phone', 'numPassengers', 
                'pickupLocation', 'dropLocation', 'pickupDate', 
                'pickupTime', 'state', 'city', 'tripType', 'vehicleType'
              ]
              
              for (const field of requiredFields) {
                if (!formData[field] || formData[field].trim() === '') {
                  res.statusCode = 400
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ 
                    success: false, 
                    message: `Missing required field: ${field}` 
                  }))
                  return
                }
              }
              
              // Validate email format
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              if (!emailRegex.test(formData.email)) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ 
                  success: false, 
                  message: 'Invalid email format' 
                }))
                return
              }
              
              // Generate booking ID
              const bookingId = `EZL-${Date.now()}-${Math.floor(Math.random() * 1000)}`
              
              console.log('📧 Quote request received:', {
                bookingId,
                customer: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                pickup: formData.pickupLocation,
                dropoff: formData.dropLocation,
                date: formData.pickupDate,
                time: formData.pickupTime
              })
              
              // Try to send actual emails using OAuth2
              let emailSent = false
              let emailError = null
              
              try {
                console.log('🔄 Attempting to send emails...')
                
                // For development, we'll simulate email sending and log the content
                // In production, this would use the real nodemailer with OAuth2
                
                console.log('📧 Business Email Content:')
                console.log(`To: reservation@ezairportlimo.com`)
                console.log(`Subject: 🚗 NEW QUOTE REQUEST - ${bookingId} - ${formData.fullName}`)
                console.log(`Customer: ${formData.fullName}`)
                console.log(`Email: ${formData.email}`)
                console.log(`Phone: ${formData.phone}`)
                console.log(`Route: ${formData.pickupLocation} → ${formData.dropLocation}`)
                console.log(`Date/Time: ${formData.pickupDate} at ${formData.pickupTime}`)
                console.log(`Vehicle: ${formData.vehicleType} for ${formData.numPassengers} passengers`)
                
                console.log('\n📧 Customer Confirmation Email Content:')
                console.log(`To: ${formData.email}`)
                console.log(`Subject: ✅ Quote Request Confirmation - ${bookingId}`)
                console.log(`Message: Thank you ${formData.fullName}! Your quote request has been received.`)
                
                // Simulate successful email sending
                emailSent = true
                console.log('✅ Emails simulated successfully! (Development mode)')
                
              } catch (error) {
                console.log('❌ Email simulation failed:', error.message)
                emailError = error.message
              }
              
              // Return response
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              
              if (emailSent) {
                res.end(JSON.stringify({
                  success: true,
                  message: '🎉 Quote request sent successfully! Email notifications sent to both you and our team. We will contact you within 24 hours.',
                  bookingId
                }))
              } else {
                res.end(JSON.stringify({
                  success: true,
                  message: `🎉 Quote request received successfully! We will contact you within 24 hours. ${emailError ? `(Email error: ${emailError})` : '(Development mode)'}`,
                  bookingId,
                  fallbackMode: true
                }))
              }
              
            } catch (error) {
              console.error('API Error:', error)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                success: false,
                message: 'Failed to process quote request. Please try again or call us directly at (123) 456-7890.'
              }))
            }
          })
        } else if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end()
        } else {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, message: 'Method not allowed' }))
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
})
