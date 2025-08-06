'use client';
import './style.css';
import InitScrollScript from './script';

export default function ContactPage() {
  return (
    <div className="main-container">
      <InitScrollScript />

      <div className="scroll-section">
        <div className="scroll-track" id="scroll-track"></div>
      </div>

      <div className="form-section">
        <h2>Contact Us</h2>
        <form id="contact-form">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="full"
            required
          />
          <div className="row">
            <input
              type="email"
              id="email"
              placeholder="E-Mail"
              required
            />
            <input
              type="text"
              id="phone"
              placeholder="Phone"
              required
            />
          </div>
          <textarea
            id="typeMessage"
            placeholder="Type Message"
            required
          ></textarea>
          <div className="button-wrap">
            <button type="submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}
