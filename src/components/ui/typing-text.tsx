import { useState, useEffect } from "react";

interface TypingTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  startTyping?: boolean;
}

const TypingText = ({ 
  text, 
  delay = 0, 
  speed = 100, 
  className = "", 
  onComplete,
  startTyping = false 
}: TypingTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!startTyping) return;

    const delayTimeout = setTimeout(() => {
      const typingInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex < text.length) {
            setDisplayText(text.slice(0, prevIndex + 1));
            return prevIndex + 1;
          } else {
            clearInterval(typingInterval);
            onComplete?.();
            return prevIndex;
          }
        });
      }, speed);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
    };
  }, [text, delay, speed, onComplete, startTyping]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={className}>
      {displayText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
        |
      </span>
    </span>
  );
};

export default TypingText;