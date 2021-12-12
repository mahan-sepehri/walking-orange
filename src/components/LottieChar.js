import React, { useState, useEffect, useRef, useCallback } from "react";
import Lottie from "lottie-web";

// import backButton from "../assets/left-arrow.svg";
// import forwardButton from "../assets/right-arrow.svg";
import "./LottieChar.css";

let walkingOrange;
let movementCount;

const SPEED_RATIO = 17;

const LottieChar = () => {
  const lottieContainerRef = useRef();
  const [dimension, updateDimention] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [walkingBack, setWalkingBack] = useState(false);
  const [walkingForward, setWalkingForward] = useState(false);

  useEffect(() => {
    const dimensionTimer = () =>
      setTimeout(() => {
        updateDimention({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 1000);
    window.addEventListener("resize", dimensionTimer);

    return () => window.removeEventListener("resize", dimensionTimer);
  }, [dimension]);

  const pointZero = dimension.width / 2;

  const [orangePosition, setOrangePosition] = useState(pointZero - 120);

  const [movement, setMovement] = useState(0);
  const onMovementStart = (num) => {
    movementCount = setInterval(() => setMovement((prev) => prev + num), 100);
  };

  useEffect(() => {
    if (walkingBack && orangePosition < 70) {
      setMovement((190 - pointZero) / SPEED_RATIO);
      return;
    }
    if (walkingForward && orangePosition > dimension.width - 200) {
      setMovement((-80 + pointZero) / SPEED_RATIO);
      return;
    }
    setOrangePosition(pointZero - 120 + movement * SPEED_RATIO);
  }, [
    movement,
    pointZero,
    walkingBack,
    orangePosition,
    walkingForward,
    dimension.width,
  ]);

  const onMovementStop = () => {
    for (let i = movementCount - 10; i < movementCount; i++) {
      if (clearInterval(i)) {
        clearInterval(i);
      }
    }
    clearInterval(movementCount);
  };

  const forwardWalkHandler = useCallback(() => {
    lottieContainerRef.current.classList.remove("backward");
    setWalkingBack(false);
    setWalkingForward(true);

    walkingOrange.play();
    onMovementStart(1);
  }, []);

  const backwardWalkHandler = useCallback(() => {
    lottieContainerRef.current.classList.add("backward");
    setWalkingBack(true);
    setWalkingForward(false);

    walkingOrange.play();

    onMovementStart(-1);
  }, []);

  useEffect(() => {
    window.oncontextmenu = function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };

    const ArrowKeyDownHandler = (e) => {
      if (e.repeat) {
        return;
      }
      if (e.key === "ArrowRight") {
        forwardWalkHandler();
      } else if (e.key === "ArrowLeft") {
        backwardWalkHandler();
      }
    };

    const ArrowKeyUpHandler = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        walkingOrange.stop();
        onMovementStop();
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
  }, [forwardWalkHandler, backwardWalkHandler]);

  return (
    <div>
      <div className="game-screen">
        <div
          style={{
            left: `${orangePosition}px`,
          }}
          className="lottie-container"
          ref={lottieContainerRef}
        ></div>
      </div>
      <div className="button-container">
        <button
          onMouseDown={(e) => backwardWalkHandler(e)}
          onMouseUp={() => {
            walkingOrange.stop();
            onMovementStop();
          }}
          onTouchStart={(e) => backwardWalkHandler(e)}
          onTouchEnd={() => {
            walkingOrange.stop();
            onMovementStop();
          }}
          className="back-button"
        ></button>
        <button
          onMouseDown={(e) => forwardWalkHandler(e)}
          onMouseUp={() => {
            walkingOrange.stop();
            onMovementStop();
          }}
          onTouchStart={(e) => forwardWalkHandler(e)}
          onTouchEnd={() => {
            walkingOrange.stop();
            onMovementStop();
          }}
          className="forward-button"
        ></button>
      </div>
    </div>
  );
};

export default LottieChar;
