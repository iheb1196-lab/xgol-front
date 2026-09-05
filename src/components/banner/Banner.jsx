import "./banner.scss";

const Banner = () => {
  return (
    <div className="banner">
      <h2>Welcome to XGOL</h2>
      <h4>High-Quality Pitching Within Everyone’s Reach!
      </h4>
      <div>
        <div className="header-container">
          <img src={`/assets/icons/landing/banner1.svg`} />
          <h3>Comprehensive Admin Control
          </h3>
        </div>
        <p>
        Sponsors can easily manage licenses, track engagement, and maintain a high-quality coaching environment using user ratings and performance insights. 
        </p>
      </div>
      <div>
        <div className="header-container">
          <img src={`/assets/icons/landing/banner2.svg`} />
          <h3>Snacking Coaching
          </h3>
        </div>
        <p>
        Request short, targeted video feedback from experts. These concise, personalized reviews help you strengthen specific skills quickly and effectively.
        </p>
      </div>
      <div>
        <div className="header-container">
          <img src={`/assets/icons/landing/banner3.svg`} />
          <h3>Quality Assurance</h3>
        </div>
        <p>
        Rate and review your coaching experience, ensuring high standards and continuous improvement for all expert interactions. 
        </p>
      </div>
      <div>
        <div className="header-container">
          <img src={`/assets/icons/landing/banner3.svg`} />
          <h3>AI-Enhanced Speech Development</h3>
        </div>
        <p>
        Refine your communication skills with real-time feedback on accuracy, fluency, and more. Get instant guidance to ensure your speech is clear, confident, and impactful.  
        </p>
      </div>
    </div>
  );
};

export default Banner;
