import React from 'react';
import participating from '../../Assests/participating.png';
import Navbar from '../NavBar/Navbar';

function AboutUs() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#27172c', paddingTop: '-0px' }}>
      <section style={{ background: '#f3f4f6', padding: '50px 0' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 15px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '400', margin: '0', color: '#222' }}>About Us</h1>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ flex: '1', paddingRight: '20px' }}>
            <img src={participating} alt="About Us" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
          </div>
          <div style={{ flex: '2' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '400', color: '#333' }}>Learn More About Us</h2>
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#666' }}>
              Welcome to Campus Connect — your one-stop portal for all campus happenings! Designed with students in mind, 
              our platform aims to streamline the organization and discovery of campus events, making it easier than ever to stay connected and engaged with your university community.
              Whether you're looking to join a workshop, participate in a club, or attend a seminar,
              our user-friendly system ensures you have all the information at your fingertips. 
              Powered by innovative technology and a passion for enriching student life, 
              Campus Connect is committed to enhancing your campus experience by providing comprehensive, 
              up-to-date event listings and seamless registration processes. Join us in making every campus event accessible, enjoyable, and memorable!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
