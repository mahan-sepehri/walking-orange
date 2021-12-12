import React, { useState, useEffect, useRef, useCallback } from "react";
import Lottie from "lottie-web";

// import backButton from "../assets/left-arrow.svg";
// import forwardButton from "../assets/right-arrow.svg";
import "./LottieChar.css";

let walkingOrange;
let movementCount;
let charContainerWidth;

const SPEED_RATIO = 20;
const BARRIER_RATIO = 20;
const MOVEMENT_REFRESH = 45;
const MOVEMENT_SPEED = 0.25;
const ANIMATION_SPEED = 2;

const LottieChar = () => {
  const lottieContainerRef = useRef();
  const charContainerRef = useRef();
  const [dimension, updateDimention] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [walkingBack, setWalkingBack] = useState(false);
  const [walkingForward, setWalkingForward] = useState(false);

  //getting width of screen and character container

  useEffect(() => {
    charContainerWidth = charContainerRef.current.offsetWidth;
    console.log(charContainerWidth);
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

  const pointZero = dimension.width / 2 - 120;

  const [orangePosition, setOrangePosition] = useState(pointZero);

  const [movement, setMovement] = useState(0);
  const onMovementStart = (num) => {
    movementCount = setInterval(
      () => setMovement((prev) => prev + num),
      MOVEMENT_REFRESH
    );
  };

  //conditions for left and right barriers so orange can't walk off screen

  useEffect(() => {
    if (walkingBack && orangePosition < -70) {
      setMovement((orangePosition - pointZero) / SPEED_RATIO);
      return;
    }
    if (walkingForward && orangePosition > charContainerWidth - 130) {
      setMovement((orangePosition - pointZero) / SPEED_RATIO);
      return;
    }
    setOrangePosition(pointZero + movement * SPEED_RATIO);
  }, [
    movement,
    pointZero,
    walkingBack,
    orangePosition,
    walkingForward,
    dimension.width,
  ]);

  //pushing left and right at the same time causes multiple intervals
  //and character won't stop. so we have to clear the last 10 intervals
  //that may be created

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
    onMovementStart(MOVEMENT_SPEED);
  }, []);

  const backwardWalkHandler = useCallback(() => {
    lottieContainerRef.current.classList.add("backward");
    setWalkingBack(true);
    setWalkingForward(false);

    walkingOrange.play();

    onMovementStart(0 - MOVEMENT_SPEED);
  }, []);

  useEffect(() => {
    //disabling browser right-click/long-press menu

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
    walkingOrange.setSpeed(ANIMATION_SPEED);

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
          className="left-barrier"
          style={{
            backgroundColor: "blue",
            width: `${100 / BARRIER_RATIO}vw`,
          }}
        ></div>
        <div
          className="char-container"
          style={{ position: "relative", width: "100%" }}
          ref={charContainerRef}
        >
          <div
            style={{
              left: `${orangePosition}px`,
            }}
            className="lottie-container"
            ref={lottieContainerRef}
          ></div>
        </div>
        <div
          className="right-barrier"
          style={{
            backgroundColor: "red",
            width: `${100 / BARRIER_RATIO}vw`,
          }}
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
