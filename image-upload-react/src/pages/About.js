import React from "react";
import TeamCard from "./Team/TeamCard";
import teamData from "./Team/TeamData";
import "./About.css";
import "./Team/TeamGrid.css";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="app-container-about">
      <header className="header">
        <h1 className="title">About ExpressInk</h1>
        <p className="subtitle">
          Learn more about our platform, our team, and how to get in touch.
        </p>
      </header>

      <section className="about-section">
        <h2 className="section-title">About ExpressInk</h2>
        <p className="section-content">
          ExpressInk uses advanced AI technology to analyze the emotional
          content of your child's drawings, offering insights into your child's
          mood and mental health. Our sentiment analysis tool can help you
          understand your child's emotional state and provide guidance on how to
          support them. ExpressInk is a powerful tool for parents, teachers, and
          mental health professionals who want to better understand children's
          emotions and help them thrive. ExpressInk is a project developed by a
          team of students at Case Western Reserve University as part of
          HackCWRU 2025. We are passionate about using technology to improve
          mental health and well-being, and we are excited to share our work
          with you.
        </p>
      </section>

      {/* <section className="about-section">
        <h2 className="section-title">Our Team</h2>
        <p className="section-content">
          As part of HackCWRU 2025, we built a webapp based on Node.js and React.
        </p>
        <ul className="team-list">
          <li><strong>Aadhab Bharadwaj</strong> - Full Stack</li>
          <li><strong>Sunveer Chugh</strong> - Full Stack</li>
          <li><strong>Jason Li</strong> - Full Stack</li>
          <li><strong>Dakin Muhlner</strong> - Full Stack</li>
        </ul>
      </section> */}
      <div className="team-grid">
        {teamData.map((member) => (
          <TeamCard
            key={member.id}
            image={member.image}
            name={member.name}
            bio={member.bio}
          />
        ))}
      </div>

      <section className="connect-section">
        <h2 className="section-title">Contact Info</h2>
        <p className="section-content">
          We would love to hear from you! Whether you have questions, feedback,
          or just want to say hello, feel free to reach out!
        </p>
        <p className="section-content">
          <strong>Email:</strong> ssc151@case.edu
        </p>
      </section>
      <Footer />
    </div>
  );
};

export default About;
