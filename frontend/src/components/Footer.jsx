import { Link } from "react-router-dom";
import { FaGlobe, FaFacebook, FaInstagram, FaTwitter, FaGraduationCap } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <FaGraduationCap style={{ marginRight: 8, color: 'var(--accent)' }} />
              LearnHub
            </div>
            <p className="footer-tagline">
              Learn anytime, anywhere with top instructors. Build your future with our online courses.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-list">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/my-learning" className="footer-link">My Learning</Link></li>
              <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h6 className="footer-heading">Support</h6>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Help Center</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms &amp; Conditions</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="footer-col">
            <h6 className="footer-heading">Follow Us</h6>
            <div className="footer-socials">
              <a href="#" className="footer-social-icon" title="Website"><FaGlobe /></a>
              <a href="#" className="footer-social-icon" title="Facebook"><FaFacebook /></a>
              <a href="#" className="footer-social-icon" title="Instagram"><FaInstagram /></a>
              <a href="#" className="footer-social-icon" title="Twitter"><FaTwitter /></a>
            </div>
          </div>

        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} LearnHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}