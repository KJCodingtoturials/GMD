import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="gradient-text">Growth Matrix</span> Digital
        </div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#panel">SMM Panel</a>
          <a href="#contact" className="gradient-text">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title animate-fade-in">
          Scale Your Brand With <br />
          <span className="gradient-text">Precision & Power</span>
        </h1>
        <p className="hero-subtitle animate-fade-in delay-1">
          I am <strong>Abu Khubaib Yaseen</strong>, your Meta Ads Expert. 
          Get premium Social Media Marketing services & access to the ultimate SMM Panel to skyrocket your online presence.
        </p>
        <div className="hero-cta animate-fade-in delay-2">
          <a href="#services" className="btn btn-primary">Explore Services</a>
          <a href="#panel" className="btn btn-accent">Access SMM Panel</a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="section-header">
          <h2>Our <span className="gradient-text">Expert Services</span></h2>
          <p>Comprehensive digital marketing solutions designed for explosive growth on every major platform.</p>
        </div>
        
        <div className="services-grid">
          {/* Meta Ads Card */}
          <div className="service-card glass-card">
            <div className="service-icon">🎯</div>
            <h3>Meta Ads Expert</h3>
            <p>Data-driven Facebook and Instagram ad campaigns that maximize your ROI and generate high-quality leads.</p>
            <ul className="service-list">
              <li>Targeted Audience Research</li>
              <li>High-Converting Ad Creatives</li>
              <li>A/B Testing & Optimization</li>
              <li>Pixel Integration & Tracking</li>
            </ul>
          </div>

          {/* SMM Card */}
          <div className="service-card glass-card">
            <div className="service-icon">🚀</div>
            <h3>Social Media Growth</h3>
            <p>Boost your credibility instantly with our premium engagement services across all major platforms.</p>
            <ul className="service-list">
              <li><strong>TikTok:</strong> Followers, Likes, Views</li>
              <li><strong>YouTube:</strong> Subscribers, Watch Hours</li>
              <li><strong>Instagram:</strong> Followers, Engagement</li>
              <li><strong>Facebook:</strong> Page Likes, Post Reach</li>
            </ul>
          </div>

          {/* SMM Panel Card */}
          <div id="panel" className="service-card glass-card">
            <div className="service-icon">⚡</div>
            <h3>Premium SMM Panel</h3>
            <p>The most reliable and fast SMM panel for agencies and influencers. Get wholesale rates for top-tier services.</p>
            <ul className="service-list">
              <li>Instant Delivery</li>
              <li>24/7 Automation</li>
              <li>Wholesale Pricing</li>
              <li>API Support for Resellers</li>
            </ul>
            <a href="#contact" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Login / Register</a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-content">
          <h2>Meet <span className="gradient-text">Abu Khubaib Yaseen</span></h2>
          <br/>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            As the founder of Growth Matrix Digital, I specialize in transforming brands into market leaders. With years of experience as a Meta Ads strategist, I know exactly what it takes to stop the scroll and drive conversions.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Beyond ads, our agency provides the most robust Social Media Marketing solutions. Whether you need an instant boost in credibility through our SMM panel or a long-term growth strategy, Growth Matrix Digital is your ultimate growth partner.
          </p>
          <a href="#contact" className="btn btn-primary">Let's Work Together</a>
        </div>
        <div className="about-image-container">
          <div className="about-image-placeholder">
            👨‍💼
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="footer">
        <div className="footer-content">
          <h3>Ready to Matrix Your Growth?</h3>
          <p>Contact us today and let's discuss your custom marketing strategy.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
             <a href="mailto:contact@growthmatrix.digital" className="btn btn-primary">Email Us</a>
             <a href="https://wa.me/YOUR_NUMBER" className="btn btn-accent" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Growth Matrix Digital. Founded by Abu Khubaib Yaseen. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
