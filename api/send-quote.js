const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const {
    fullName,
    email,
    phone,
    numPassengers,
    pickupLocation,
    dropLocation,
    pickupDate,
    pickupTime,
    state,
    city,
    tripType,
    vehicleType,
    specialRequests = ''
  } = req.body;

  // Validate required fields
  const requiredFields = {
    fullName,
    email,
    phone,
    numPassengers,
    pickupLocation,
    dropLocation,
    pickupDate,
    pickupTime,
    state,
    city,
    tripType,
    vehicleType
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value || value.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: `Missing required field: ${field}` 
      });
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email format' 
    });
  }

  // Generate booking ID
  const bookingId = `EZL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    // More reliable SMTP configuration with fallbacks
    let transporter;
    
    // Try OAuth2 first, fallback to basic SMTP
    try {
      transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.GMAIL_USER || 'reservation@ezairportlimo.com',
          clientId: process.env.GMAIL_CLIENT_ID,
          clientSecret: process.env.GMAIL_CLIENT_SECRET,
          refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        },
      });
    } catch (oauthError) {
      console.log('OAuth2 failed, trying basic SMTP...');
      
      // Fallback to basic SMTP configuration
      transporter = nodemailer.createTransporter({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER || 'reservation@ezairportlimo.com',
          pass: process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    }

    // Test the connection
    await transporter.verify();

    // Format date and time for display
    const formatDate = (dateStr) => {
      try {
        return new Date(dateStr).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
        return dateStr;
      }
    };

    const formatTime = (timeStr) => {
      try {
        return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } catch (e) {
        return timeStr;
      }
    };

    // Business notification email HTML
    const businessHtmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>New Quote Request - EZ Airport Limo</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f8f9fa;
            }
            .container {
                max-width: 650px;
                margin: 0 auto;
                background-color: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
                color: #000;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 700;
            }
            .quote-info {
                padding: 30px;
            }
            .booking-id {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 25px;
                text-align: center;
            }
            .booking-id strong {
                color: #856404;
                font-size: 18px;
            }
            .quote-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid #dee2e6;
            }
            .quote-table th {
                background-color: #f8f9fa;
                color: #495057;
                padding: 15px;
                text-align: left;
                font-weight: 600;
                width: 35%;
                border-bottom: 1px solid #dee2e6;
            }
            .quote-table td {
                padding: 15px;
                border-bottom: 1px solid #dee2e6;
                background-color: white;
            }
            .quote-table tr:last-child td,
            .quote-table tr:last-child th {
                border-bottom: none;
            }
            .priority {
                background-color: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
                font-weight: 600;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 14px;
                color: #6c757d;
                border-top: 1px solid #dee2e6;
            }
            .contact-info {
                background-color: #e3f2fd;
                border: 1px solid #90caf9;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚗 NEW QUOTE REQUEST</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">EZ Airport Limo - Premium Transportation</p>
            </div>
            
            <div class="quote-info">
                <div class="booking-id">
                    <strong>BOOKING ID: ${bookingId}</strong><br>
                    <small>Received: ${new Date().toLocaleString('en-US')}</small>
                </div>

                <div class="contact-info">
                    <strong>📞 Customer Contact Information</strong><br>
                    <strong>Name:</strong> ${fullName}<br>
                    <strong>Phone:</strong> <a href="tel:${phone}">${phone}</a><br>
                    <strong>Email:</strong> <a href="mailto:${email}">${email}</a>
                </div>
                
                <table class="quote-table">
                    <tr>
                        <th>🗓️ Trip Details</th>
                        <td>
                            <strong>Type:</strong> ${tripType}<br>
                            <strong>Date:</strong> ${formatDate(pickupDate)}<br>
                            <strong>Time:</strong> ${formatTime(pickupTime)}
                        </td>
                    </tr>
                    
                    <tr>
                        <th>🚙 Vehicle & Passengers</th>
                        <td>
                            <strong>Vehicle Type:</strong> ${vehicleType}<br>
                            <strong>Number of Passengers:</strong> ${numPassengers}
                        </td>
                    </tr>
                    
                    <tr>
                        <th>📍 Locations</th>
                        <td>
                            <strong>Pickup:</strong> ${pickupLocation}<br>
                            <strong>Drop-off:</strong> ${dropLocation}<br>
                            <strong>City:</strong> ${city}, ${state}
                        </td>
                    </tr>
                    
                    ${specialRequests ? `
                    <tr>
                        <th>📝 Special Requests</th>
                        <td style="font-style: italic;">${specialRequests}</td>
                    </tr>
                    ` : ''}
                </table>

                <div class="priority">
                    ⚡ PRIORITY: Respond within 2 hours for best customer experience
                </div>
            </div>
            
            <div class="footer">
                <p><strong>EZ Airport Limo</strong> | reservation@ezairportlimo.com | (123) 456-7890</p>
                <p>This is an automated notification from your quote request system.</p>
            </div>
        </div>
    </body>
    </html>`;

    // Customer confirmation email HTML
    const customerHtmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Quote Request Confirmation - EZ Airport Limo</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f8f9fa;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
                color: #000;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 700;
            }
            .content {
                padding: 30px;
            }
            .booking-summary {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .next-steps {
                background-color: #d4edda;
                border: 1px solid #c3e6cb;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .contact-box {
                background-color: #e3f2fd;
                border: 1px solid #90caf9;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 14px;
                color: #6c757d;
                border-top: 1px solid #dee2e6;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Quote Request Received!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing EZ Airport Limo</p>
            </div>
            
            <div class="content">
                <p>Dear <strong>${fullName}</strong>,</p>
                
                <p>Thank you for your interest in our premium transportation services! We have received your quote request and our team is already working on providing you with a competitive and detailed quote.</p>
                
                <div class="booking-summary">
                    <h3 style="margin-top: 0; color: #D4AF37;">📋 Your Request Summary</h3>
                    <p><strong>Booking ID:</strong> ${bookingId}</p>
                    <p><strong>Service Date:</strong> ${formatDate(pickupDate)} at ${formatTime(pickupTime)}</p>
                    <p><strong>Trip Type:</strong> ${tripType}</p>
                    <p><strong>Vehicle:</strong> ${vehicleType} for ${numPassengers} passenger${numPassengers > 1 ? 's' : ''}</p>
                    <p><strong>Route:</strong> ${pickupLocation} → ${dropLocation}</p>
                </div>

                <div class="next-steps">
                    <h3 style="margin-top: 0; color: #155724;">🚀 What Happens Next?</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li><strong>Within 2 hours:</strong> Our team will review your request</li>
                        <li><strong>Within 24 hours:</strong> You'll receive a detailed quote via email</li>
                        <li><strong>Booking confirmation:</strong> Once approved, we'll send booking details</li>
                    </ul>
                </div>

                <div class="contact-box">
                    <h3 style="margin-top: 0; color: #1565c0;">📞 Need Immediate Assistance?</h3>
                    <p style="margin: 10px 0;"><strong>Call us directly:</strong> <a href="tel:(123) 456-7890" style="color: #1565c0; text-decoration: none; font-weight: 600;">(123) 456-7890</a></p>
                    <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:reservation@ezairportlimo.com" style="color: #1565c0; text-decoration: none;">reservation@ezairportlimo.com</a></p>
                    <p style="margin: 10px 0; font-size: 14px; color: #666;">Available 24/7 for your convenience</p>
                </div>

                <p>We pride ourselves on providing reliable, luxurious, and professional transportation services throughout Maryland, Washington DC, and Virginia.</p>
                
                <p style="margin-bottom: 0;">Best regards,<br>
                <strong>EZ Airport Limo Team</strong></p>
            </div>
            
            <div class="footer">
                <p><strong>EZ Airport Limo</strong> | Premium Transportation Services</p>
                <p>Maryland • Washington DC • Virginia</p>
                <p>This is an automated confirmation. Please save this email for your records.</p>
            </div>
        </div>
    </body>
    </html>`;

    // Send email to business
    const businessEmailResult = await transporter.sendMail({
      from: `"EZ Airport Limo" <${process.env.GMAIL_USER || 'reservation@ezairportlimo.com'}>`,
      to: process.env.BUSINESS_EMAIL || 'reservation@ezairportlimo.com',
      subject: `🚗 NEW QUOTE REQUEST - ${bookingId} - ${fullName}`,
      html: businessHtmlContent,
      priority: 'high'
    });

    // Send confirmation email to customer
    const customerEmailResult = await transporter.sendMail({
      from: `"EZ Airport Limo Reservations" <${process.env.GMAIL_USER || 'reservation@ezairportlimo.com'}>`,
      to: email,
      subject: `✅ Quote Request Confirmation - ${bookingId}`,
      html: customerHtmlContent
    });

    console.log('Emails sent successfully:', {
      business: businessEmailResult.messageId,
      customer: customerEmailResult.messageId
    });

    return res.status(200).json({
      success: true,
      message: 'Quote request sent successfully! We will contact you within 24 hours.',
      bookingId
    });

  } catch (error) {
    console.error('Error sending email:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    
    // Fallback: Save quote request to local file
    try {
      const quoteData = {
        bookingId,
        timestamp: new Date().toISOString(),
        customerInfo: {
          fullName,
          email,
          phone,
          numPassengers,
          pickupLocation,
          dropLocation,
          pickupDate,
          pickupTime,
          state,
          city,
          tripType,
          vehicleType,
          specialRequests
        },
        error: {
          message: error.message,
          code: error.code
        }
      };
      
      // Save to a quotes file for manual processing
      const quotesDir = path.join(process.cwd(), 'data');
      const quotesFile = path.join(quotesDir, 'pending-quotes.json');
      
      // Ensure directory exists
      try {
        await fs.mkdir(quotesDir, { recursive: true });
      } catch (dirError) {
        console.log('Directory already exists or cannot create:', dirError.message);
      }
      
      // Read existing quotes or create new array
      let quotes = [];
      try {
        const existingData = await fs.readFile(quotesFile, 'utf8');
        quotes = JSON.parse(existingData);
      } catch (readError) {
        console.log('Creating new quotes file');
      }
      
      // Add new quote
      quotes.push(quoteData);
      
      // Save back to file
      await fs.writeFile(quotesFile, JSON.stringify(quotes, null, 2));
      
      console.log('Quote saved to local file for manual processing:', bookingId);
      
      // Return success even though email failed
      return res.status(200).json({
        success: true,
        message: 'Quote request received successfully! We will contact you within 24 hours. If urgent, please call (123) 456-7890.',
        bookingId,
        fallbackMode: true
      });
      
    } catch (fallbackError) {
      console.error('Fallback save also failed:', fallbackError.message);
    }
    
    // More specific error messages based on error type
    let errorMessage = 'Failed to send quote request. ';
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage += 'Please check your internet connection and try again.';
    } else if (error.code === 'EAUTH') {
      errorMessage += 'Email service temporarily unavailable. Please call us directly.';
    } else if (error.message?.includes('timeout')) {
      errorMessage += 'Request timed out. Please try again.';
    } else {
      errorMessage += 'Please try again or call us directly.';
    }
    
    errorMessage += ' Phone: (123) 456-7890';

    return res.status(500).json({
      success: false,
      message: errorMessage,
      errorCode: error.code || 'UNKNOWN_ERROR'
    });
  }
} 