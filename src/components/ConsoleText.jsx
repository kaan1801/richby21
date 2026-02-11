import { useState, useEffect } from "react";

export default function ConsoleText({ text }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;

    let index = 0;
    let currentText = "";

    const interval = setInterval(() => {
      currentText += text[index];
      setDisplayedText(currentText);
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
