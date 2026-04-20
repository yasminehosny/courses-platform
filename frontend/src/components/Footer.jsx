import { Link } from "react-router-dom";
import { FaGlobe, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">

  
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">LearnHub</h5>
            <p className="text-secondary small">
              Learn anytime, anywhere with top instructors. Build your future with our online courses.
            </p>
          </div>

          
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none text-secondary">Home</Link></li>
              <li><Link to="/my-learning" className="text-decoration-none text-secondary">My Learning</Link></li>
              <li><Link to="/dashboard" className="text-decoration-none text-secondary">Dashboard</Link></li>
            </ul>
          </div>

        
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Support</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none text-secondary">Help Center</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Privacy Policy</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Terms & Conditions</a></li>
            </ul>
          </div>

        
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Follow Us</h6>
            <div className="d-flex gap-3 mt-2">
              <a href="#" className="text-light fs-5" title="Website">
                <FaGlobe />
              </a>
              <a href="#" className="text-light fs-5" title="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="text-light fs-5" title="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="text-light fs-5" title="Twitter">
                <FaTwitter />
              </a>
            </div>
          </div>

        </div>

      
        <hr className="border-secondary" />

        
        <div className="text-center small text-secondary">
          &copy; {new Date().getFullYear()} Courses Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}