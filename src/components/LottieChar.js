import React, { useEffect, useRef } from "react";
import Lottie from "lottie-web";

import backButton from "../assets/left-arrow.svg";
import forwardButton from "../assets/right-arrow.svg";
import "./LottieChar.css";

let walkingOrange;

const LottieChar = () => {
  // var animation = bodymovin.loadAnimation({
  //     container: document.getElementById('lottie'), // Required
  //     path: 'data.json', // Required
  //     renderer: 'svg/canvas/html', // Required
  //     loop: true, // Optional
  //     autoplay: true, // Optional
  //     name: "Hello World", // Name for future reference. Optional.
  //   })

  const lottieContainerRef = useRef();

  const forwardWalkHandler = () => {
    lottieContainerRef.current.classList.remove("backward");

    walkingOrange.play();
  };

  const backwardWalkHandler = () => {
    lottieContainerRef.current.classList.add("backward");

    walkingOrange.play();
  };

  useEffect(() => {
    const ArrowKeyDownHandler = (e) => {
      if (e.key === "ArrowRight") {
        forwardWalkHandler();
      } else if (e.key === "ArrowLeft") {
        backwardWalkHandler();
      }
    };

    const ArrowKeyUpHandler = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        walkingOrange.stop();
      }
    };
    document.addEventListener("keydown", ArrowKeyDownHandler);
    document.addEventListener("keyup", ArrowKeyUpHandler);
    walkingOrange = Lottie.loadAnimation({
      container: lottieContainerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: false,
      animationData: require("../assets/walkingOrange.json"),
      name: "walkingOrange",
    });

    return () => {
      document.removeEventListener("keydown", ArrowKeyDownHandler);
      document.removeEventListener("keyup", ArrowKeyUpHandler);
      walkingOrange.destroy();
    };
  }, []);

  return (
    <div>
      <div className="game-screen">
        <div className="lottie-container" ref={lottieContainerRef}></div>
      </div>
      <div className="button-container">
        <img
          src={backButton}
          alt="backward"
          className="back-button"
          onMouseDown={backwardWalkHandler}
          onMouseUp={() => walkingOrange.stop()}
        />
        {/* <button
          onMouseDown={backwardWalkHandler}
          onMouseUp={() => walkingOrange.stop()}
        >
          backward
        </button> */}
        {/* <button
          onMouseDown={forwardWalkHandler}
          onMouseUp={() => walkingOrange.stop()}
        >
          forward
        </button> */}
        <img
          src={forwardButton}
          alt="backward"
          className="back-button"
          onMouseDown={forwardWalkHandler}
          onMouseUp={() => walkingOrange.stop()}
        />
      </div>
    </div>
  );
};

export default LottieChar;
