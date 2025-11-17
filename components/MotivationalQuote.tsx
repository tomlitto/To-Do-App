import React, { useState, useEffect } from 'react';

const quotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "It’s not the load that breaks you down, it’s the way you carry it.",
    author: "Lou Holtz"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    text: "You don’t have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso"
  },
  {
    text: "Well done is better than well said.",
    author: "Benjamin Franklin"
  },
  {
    text: "The key is not to prioritize what’s on your schedule, but to schedule your priorities.",
    author: "Stephen Covey"
  },
  {
    text: "Do the hard jobs first. The easy jobs will take care of themselves.",
    author: "Dale Carnegie"
  },
  {
    text: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
    author: "Paul J. Meyer"
  },
  {
    text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
    author: "Stephen King"
  }
];

const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState({ text: '', author: '' });

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="sticky top-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-center items-center text-center">
      <blockquote className="text-gray-700 italic text-lg leading-relaxed">
        “{quote.text}”
      </blockquote>
      <cite className="mt-4 block font-semibold text-gray-500 not-italic">
        - {quote.author}
      </cite>
    </div>
  );
};

export default MotivationalQuote;
