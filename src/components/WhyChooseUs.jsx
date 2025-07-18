import React, { useState } from 'react'

const WhyChooseUs = () => {
  const [videoLoaded, setVideoLoaded] = useState(false)

  const handlePlayClick = () => {
    const video = document.querySelector('.feature-video')
    if (video) {
      video.play()
      setVideoLoaded(true)
    }
  }

  return (
    <>
      {/* Hero-style Why Choose Us Section */}
      <section className="why-choose-hero">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Us?</h2>
            <p className="section-intro">Discover what makes EZ Airport Limo the preferred choice for luxury transportation</p>
          </div>
          
          <div className="why-choose-content">
            <div className="text-content">
              <div className="reasons-grid">
                <div className="reason-item">
                  <div className="reason-number">01</div>
                  <div className="reason-details">
                    <h3>Professional Excellence</h3>
                    <p>Our licensed chauffeurs deliver unmatched professionalism with every ride, ensuring your comfort and safety are our top priorities.</p>
                  </div>
                </div>

                <div className="reason-item">
                  <div className="reason-number">02</div>
                  <div className="reason-details">
                    <h3>Luxury Fleet</h3>
                    <p>Travel in style with our meticulously maintained premium vehicles, from elegant sedans to spacious limousines and SUVs.</p>
                  </div>
                </div>

                <div className="reason-item">
                  <div className="reason-number">03</div>
                  <div className="reason-details">
                    <h3>Punctual Service</h3>
                    <p>We monitor flights and traffic to ensure you arrive on time, every time. Your schedule is our commitment.</p>
                  </div>
                </div>

                <div className="reason-item">
                  <div className="reason-number">04</div>
                  <div className="reason-details">
                    <h3>Regional Coverage</h3>
                    <p>Comprehensive transportation services across Maryland, Washington D.C., and Virginia with local expertise and knowledge.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="video-content">
              <div className="video-section-header">
                <h3>See Us in Action</h3>
                <p>Watch how we deliver premium transportation experiences</p>
              </div>
              
              <div className="video-wrapper">
                {!videoLoaded ? (
                  <div className="video-placeholder">
                    <img 
                      src="https://images.unsplash.com/photo-1571981742669-f137c4d3a00e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                      alt="Professional chauffeur with luxury vehicle"
                      className="placeholder-image"
                    />
                    <div className="play-button-overlay" style={{ opacity: 1 }}>
                      <button className="play-button" onClick={handlePlayClick} aria-label="Play video">
                        <i className="fas fa-play"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <video 
                    controls 
                    autoPlay
                    preload="metadata"
                    className="feature-video"
                  >
                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              
              <div className="video-features">
                <div className="feature-badge">
                  <i className="fas fa-shield-check"></i>
                  <span>Licensed & Insured</span>
                </div>
                <div className="feature-badge">
                  <i className="fas fa-clock"></i>
                  <span>24/7 Available</span>
                </div>
                <div className="feature-badge">
                  <i className="fas fa-star"></i>
                  <span>5-Star Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </>
  )
}

export default WhyChooseUs 