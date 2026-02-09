import { useState, useEffect } from "react";

export default function ConsoleText({ text }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;

    let index = 0;
    let currentText = ""; // local string to accumulate characters

    const interval = setInterval(() => {
      currentText += text[index]; // add character at current index
      setDisplayedText(currentText); // update state
      index++;
      if (index === text.length) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="text-slate-300 font-mono">
      {displayedText}
      <span className="animate-pulse">|</span>
    </p>
  );
}
