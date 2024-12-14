import React from 'react';
import outdoors from '../../Assests/outdoors.png';
import study from '../../Assests/study.png';
import outside from '../../Assests/outside.png';
import eventpic from '../../Assests/eventpic.png';

const styles = {
  hero: {
    width: '100%',
    minHeight: '100vh',
    background: `url(${eventpic}) center/cover no-repeat`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'aliceblue',
    justifyContent: 'center',
  },
  heroText: {
    textAlign: 'center',
    maxWidth: '800px',
  },
  title: {
    textAlign: 'center',
    color: '#212e21',
    fontSize: '15px',
    fontWeight: '600',
    textTransform: 'uppercase',
    margin: '70px 0 30px',
  },
  titleH2: {
    fontSize: '32px',
    color: '#000F38',
    margin: '5px 0',
    textTransform: 'none',
  },
  programs: {
    margin: '80px auto',
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  programImg: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  program: {
    flexBasis: '31%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#27172c',
    padding: '1rem',
    borderTop: '1px solid #ddd',
    fontSize: '0.9rem',
    textAlign: 'center',
    marginTop: '50px', // Adds spacing above footer
  },
};

const Hero = () => {
  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroText}>
          <h1>Welcome to Campus Connect: Your Ultimate Event Management Hub</h1>
          <p>
            Experience seamless event planning and management with Campus
            Connect, your go-to platform for organizing and tracking campus
            events.
          </p>
        </div>
      </div>

      {/* Title Section */}
      <div style={styles.title}>
        <h2 style={styles.titleH2}>Our Events</h2>
        <p>What we offer</p>
      </div>

      {/* Programs Section */}
      <div style={styles.programs}>
        <div style={styles.program}>
          <img
            src={outdoors}
            alt="Outdoor workshop"
            style={styles.programImg}
          ></img>
          <h2>Workshops</h2>
          <p>
            Unlock your potential with our expertly organized workshops! We
            specialize in crafting hands-on learning experiences that inspire
            creativity and skill development. From planning to execution, we
            ensure every detail is tailored to deliver impactful sessions for
            participants, making learning interactive and memorable.
          </p>
        </div>
        <div style={styles.program}>
          <img src={study} alt="Seminar" style={styles.programImg}></img>
          <h2>Seminars</h2>
          <p>
            Host thought-provoking seminars that leave a lasting impression.
            Our team manages everything from sourcing inspiring speakers to
            coordinating logistics, creating an environment where ideas flourish
            and knowledge is shared seamlessly.
          </p>
        </div>
        <div style={styles.program}>
          <img
            src={outside}
            alt="Club activity"
            style={styles.programImg}
          ></img>
          <h2>Club Activities</h2>
          <p>
            Bring your club’s vision to life with engaging and well-coordinated
            activities. Whether it’s a cultural showcase, a team-building event,
            or a recreational meet-up, we handle the planning and execution to
            ensure your members have an unforgettable experience.
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default Hero;
