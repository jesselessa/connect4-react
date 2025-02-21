// REACT
import React, { createRef } from "react";
// AUDIO
import bgMusic from "../assets/audio/80s-music-electric-dreams.mp3";
//IMAGES
import soundOn from "../assets/images/sound-on.png";
import soundOff from "../assets/images/sound-off.png";

class Speaker extends React.Component {
  constructor(props) {
    super(props);
    // Create a reference
    this.audioRef = createRef();
    // Initialize states
    this.state = {
      isPlaying: false,
      caption: "",
    };
  }

  // Update image caption when component mounts
  componentDidMount() {
    this.updateCaption();
    // Add event listener for window resize
    window.addEventListener("resize", this.updateCaption);
  }

  // Remove event listener when component unmounts
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateCaption);
  }

  // Toggle background music on/off
  handleBgMusic = () => {
    if (this.audioRef.current.paused) {
      this.audioRef.current.play();
      this.setState({ isPlaying: true }, this.updateCaption);
    } else {
      this.audioRef.current.pause();
      this.setState({ isPlaying: false }, this.updateCaption);
    }
  };

  // Stop the background music completely
  stopMusic = () => {
    if (this.audioRef.current) {
      this.audioRef.current.pause();
      this.audioRef.current.currentTime = 0; // Reset to start
      this.setState({ isPlaying: false }, this.updateCaption);
    }
  };

  // Update image caption based on window width and music state
  updateCaption = () => {
    this.setState({
      caption:
        window.innerWidth > 500
          ? this.state.isPlaying
            ? "Sound off"
            : "Sound on"
          : "",
    });
  };

  render() {
    return (
      <div id="toggle" onClick={this.handleBgMusic}>
        {/* Audio element with reference */}
        <audio ref={this.audioRef} src={bgMusic} loop />
        {/* Toggle button*/}
        <img
          src={this.state.isPlaying ? soundOff : soundOn}
          id="toggle-music"
          alt="loudspeaker"
        />
        {/* Display caption based on state */}
        <figcaption>{this.state.caption}</figcaption>
      </div>
    );
  }
}

export default Speaker;
