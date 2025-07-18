import React from 'react'

const Services = () => {
  return (
    <section className="services content-section">
      <div className="container">
        <h2>Our Premium Services</h2>
        <div className="services-container">
          <div className="services-grid">
            <div className="service-item">
              <i className="fas fa-plane"></i>
              <strong>Airport Transportation</strong>
              <p>Reliable and comfortable rides to and from all major airports. Professional chauffeurs ensure you arrive on time for your flights.</p>
            </div>
            <div className="service-item">
              <i className="fas fa-briefcase"></i>
              <strong>Corporate Travel</strong>
              <p>Executive transportation for business meetings, conferences, and corporate events. Impress your clients with our luxury fleet.</p>
            </div>
            <div className="service-item">
              <i className="fas fa-glass-cheers"></i>
              <strong>Special Events</strong>
              <p>Weddings, proms, anniversaries, and celebrations. Make your special day even more memorable with our premium service.</p>
            </div>
            <div className="service-item">
              <i className="fas fa-city"></i>
              <strong>City Tours</strong>
              <p>Explore the city in comfort and style. Our knowledgeable chauffeurs can show you the best sights and attractions.</p>
            </div>
            <div className="service-item">
              <i className="fas fa-clock"></i>
              <strong>Hourly Service</strong>
              <p>Flexible hourly rates for multiple stops, shopping trips, or extended transportation needs throughout the day.</p>
            </div>
            <div className="service-item">
              <i className="fas fa-route"></i>
              <strong>Long Distance</strong>
              <p>Comfortable long-distance travel to neighboring cities and states. Avoid the hassle of driving yourself.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services 