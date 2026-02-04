import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const ValentinePage = () => {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [heartFloat, setHeartFloat] = useState([]);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [showLoveLetters, setShowLoveLetters] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showHeartExplosion, setShowHeartExplosion] = useState(false);
  const [showNameReveal, setShowNameReveal] = useState(false);
  const audioRef = useRef(null);
  
  const yesButtonSize = Math.min(noCount * 20 + 16, 60);

  // Personalized love letters with nicknames
  const loveLetters = [
    "Dear Sudu Manika, you make every day brighter! ✨",
    "Your smile is my favorite thing in the world, Sudu Nona 😊",
    "I'm so lucky to have you in my life, Chalani 🍀",
    "You're not just my Valentine, you're my everything, Sudu Manika 💑",
    "Thank you for being the amazing person you are, Sudu Nona! 💝",
    "With all my love, Your Sudu Mahaththaya ❤️"
  ];

  // Different GIFs for different stages
  const getImage = () => {
    const images = [
      "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif",
      "https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif",
      "https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif",
      "https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif",
      "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
      "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif",
      "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif",
      "https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif",
      "https://media.giphy.com/media/L4fv5eLVk6geaVmkaO/giphy.gif",
      "https://media.giphy.com/media/3oEduOnl5IHM5NRodO/giphy.gif",
    ];
    
    if (noCount < images.length) {
      return images[noCount];
    }
    return images[images.length - 1];
  };

  const getEmoji = () => {
    const emojis = ['🥺', '😢', '😭', '💔', '🥹', '😿', '🙏', '😩', '🥲', '😔'];
    return emojis[Math.min(noCount, emojis.length - 1)];
  };

  // Get random nickname for variety
  const getRandomNickname = () => {
    const nicknames = ["Sudu Manika", "Sudu Nona", "Chalani"];
    return nicknames[Math.floor(Math.random() * nicknames.length)];
  };

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating hearts animation
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartFloat(prev => [
        ...prev.slice(-20),
        {
          id: Date.now(),
          x: Math.random() * 100,
          duration: 3 + Math.random() * 2
        }
      ]);
    }, 300);
    
    return () => clearInterval(interval);
  }, []);

  // Intro sequence
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Love letters reveal sequence
  useEffect(() => {
    if (showLoveLetters && currentLetterIndex < loveLetters.length) {
      const timer = setTimeout(() => {
        setCurrentLetterIndex(currentLetterIndex + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLoveLetters, currentLetterIndex]);

  // Name reveal animation
  useEffect(() => {
    if (yesPressed) {
      setTimeout(() => {
        setShowNameReveal(true);
      }, 1000);
    }
  }, [yesPressed]);

  const getRandomPosition = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonWidth = 200;
    const buttonHeight = 60;
    const padding = 20;
    const maxX = (viewportWidth / 2) - buttonWidth - padding;
    const maxY = (viewportHeight / 2) - buttonHeight - padding;
    const randomX = (Math.random() - 0.5) * maxX * 2;
    const randomY = (Math.random() - 0.5) * maxY * 2;
    return { x: randomX, y: randomY };
  };

  const handleNoClick = () => {
    setNoCount(noCount + 1);
    
    // Shake effect
    if (noCount >= 2) {
      setShowHeartExplosion(true);
      setTimeout(() => setShowHeartExplosion(false), 500);
    }
    
    if (noCount >= 3) {
      setNoButtonPos(getRandomPosition());
    }
  };

  const handleNoHover = () => {
    if (noCount >= 5) {
      setNoButtonPos(getRandomPosition());
    }
  };

  const getNoButtonText = () => {
    const phrases = [
      "No", 
      "Are you sure, Sudu Nona?", 
      "Really sure, Sudu Manika??", 
      "Think again, please!",
      "Chalani... last chance!", 
      "Surely not, Sudu Nona?", 
      "You might regret this, Sudu Manika!",
      "Give it another thought, Chalani!", 
      "Are you absolutely sure?",
      "You're breaking my heart, Sudu Nona 💔",
      "Please reconsider, Sudu Manika 🥺",
      "I'm not giving up, Chalani! 💪",
      "One more chance, Sudu Nona? 🙏",
      "Pretty please, Sudu Manika? 🥹",
      "Still no, Chalani?? 😢"
    ];
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  const handleYesClick = () => {
    setYesPressed(true);
    
    // Epic multi-stage confetti
    const duration = 4000;
    const end = Date.now() + duration;

    const colors = ['#ff4d6d', '#ff85a1', '#f7cad0', '#ffc1cc', '#ff6b9d'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Big confetti burst from center
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
      });
    }, 500);

    // Show love letters after a delay
    setTimeout(() => {
      setShowLoveLetters(true);
    }, 3000);
  };

  // Intro Animation with personalized message
  if (showIntro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-400 via-pink-300 to-rose-200 px-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5 }}
          className="text-9xl mb-6"
        >
          💝
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl text-white font-serif mb-2 text-center"
        >
          Hey Sudu Manika,
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-2xl text-white/90 font-serif text-center"
        >
          My dearest Sudu Nona...
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="text-xl text-white/80 font-serif text-center mt-2"
        >
          I have something special to ask you...
        </motion.p>
      </div>
    );
  }

  // Success Screen with advanced animations
  if (yesPressed) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-rose-200 text-center p-4 overflow-hidden">
        {/* Animated background hearts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "100vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
              animate={{ 
                y: "-20vh", 
                opacity: [0, 1, 1, 0],
                rotate: 360,
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "linear"
              }}
              className="absolute text-4xl"
            >
              {['❤️', '💕', '💖', '💗', '💝', '🌹', '💐'][Math.floor(Math.random() * 7)]}
            </motion.div>
          ))}
        </div>

        {/* Sparkles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
              className="absolute text-yellow-300 text-xl"
            >
              ✨
            </motion.div>
          ))}
        </div>

        {/* Names floating animation */}
        {showNameReveal && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 1 }}
            className="absolute top-20 z-20 px-4"
          >
            <div className="bg-white/90 backdrop-blur px-8 py-4 rounded-full shadow-2xl border-4 border-rose-300">
              <motion.p
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl sm:text-3xl font-bold text-rose-600 font-serif"
              >
                Sudu Mahaththaya 💕 Sudu Manika
              </motion.p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative z-10"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="rounded-3xl shadow-2xl w-80 h-80 mb-8 border-4 border-white bg-white flex items-center justify-center overflow-hidden"
            >
              <img
                src="https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif"
                alt="Happy celebration"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{ display: 'none' }} className="text-9xl items-center justify-center">💕</div>
            </motion.div>

            {/* Orbiting hearts around image */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`orbit-${i}`}
                className="absolute text-3xl"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: Math.cos((i / 6) * Math.PI * 2 + Date.now() / 1000) * 150,
                  y: Math.sin((i / 6) * Math.PI * 2 + Date.now() / 1000) * 150,
                }}
                transition={{
                  duration: 0,
                  repeat: Infinity,
                }}
              >
                💕
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10"
        >
          <motion.h1 
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-7xl font-bold text-rose-600 mb-4 font-serif"
          >
            Yay! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl sm:text-4xl text-rose-500 font-medium mb-2"
          >
            I knew you'd say yes, Sudu Nona!
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-rose-400 text-xl italic font-medium mb-8"
          >
            Can't wait for our special day together! ❤️
          </motion.p>
          
          {/* Love letters appearing one by one */}
          <div className="space-y-4 mt-8">
            <AnimatePresence>
              {showLoveLetters && loveLetters.slice(0, currentLetterIndex).map((letter, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="p-4 bg-white/90 backdrop-blur rounded-2xl shadow-xl max-w-md mx-auto"
                >
                  <p className="text-rose-600 font-serif text-lg">
                    {letter}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Final message after all letters */}
          {currentLetterIndex >= loveLetters.length && (
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", delay: 0.5 }}
              className="mt-8 p-8 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-3xl shadow-2xl max-w-md mx-auto"
            >
              <p className="text-2xl sm:text-3xl font-bold font-serif mb-3">
                You're the best Valentine ever, Sudu Manika! 💖✨
              </p>
              <p className="text-xl font-serif italic">
                Forever yours, Your Sudu Mahaththaya 💝
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // Main Question Screen with advanced effects
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 p-4 overflow-hidden">
      {/* Floating hearts in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {heartFloat.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: "-20vh", opacity: [0, 1, 0] }}
            transition={{ duration: heart.duration, ease: "linear" }}
            className="absolute text-2xl"
            style={{ left: `${heart.x}%` }}
          >
            💕
          </motion.div>
        ))}
      </div>

      {/* Heart explosion effect when clicking No */}
      {showHeartExplosion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`explosion-${i}`}
              initial={{ 
                x: window.innerWidth / 2, 
                y: window.innerHeight / 2,
                opacity: 1,
                scale: 1
              }}
              animate={{ 
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 400,
                y: window.innerHeight / 2 + (Math.random() - 0.5) * 400,
                opacity: 0,
                scale: 0.5
              }}
              transition={{ duration: 0.5 }}
              className="absolute text-3xl"
            >
              💔
            </motion.div>
          ))}
        </div>
      )}

      {/* Mouse follower heart trail (only visible after some No clicks) */}
      {noCount > 2 && (
        <motion.div
          className="fixed pointer-events-none z-0 text-2xl"
          animate={{
            x: mousePos.x - 10,
            y: mousePos.y - 10,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        >
          💕
        </motion.div>
      )}

      {/* Personalized header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-8 bg-white/80 backdrop-blur px-6 py-3 rounded-full shadow-lg"
      >
        <p className="text-rose-600 font-serif text-base sm:text-lg">
          From: Sudu Mahaththaya 💝 To: Sudu Nona
        </p>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={noCount}
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
            transition={{ type: "spring" }}
            className="h-72 w-72 flex items-center justify-center rounded-3xl mb-8 shadow-2xl border-4 border-white bg-white relative"
          >
            <img
              src={getImage()}
              alt={noCount === 0 ? "Waiting hopefully" : "Sad reaction"}
              className="max-h-full max-w-full object-contain rounded-2xl"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{ display: 'none' }} className="text-9xl flex items-center justify-center">
              {getEmoji()}
            </div>

            {/* Teardrops falling from image when sad */}
            {noCount > 0 && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`tear-${i}`}
                    className="absolute text-2xl"
                    style={{ left: `${30 + i * 20}%`, top: '60%' }}
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: 100, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeIn"
                    }}
                  >
                    💧
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        </AnimatePresence>
        
        <motion.h1 
          animate={{ 
            scale: [1, 1.02, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-4xl sm:text-5xl font-bold text-rose-600 mb-4 font-serif text-center px-4"
        >
          Sudu Manika, will you be my Valentine? 💖
        </motion.h1>
        
        {noCount > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-rose-400 text-center mb-8 text-lg italic px-4"
          >
            {noCount >= 7 ? "The 'Yes' button is getting bigger... just saying 👀" : "Please, Sudu Nona? 🥺"}
          </motion.p>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 relative min-h-[100px]">
          <motion.button
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 10px 30px rgba(34, 197, 94, 0.3)",
                "0 15px 40px rgba(34, 197, 94, 0.6)",
                "0 10px 30px rgba(34, 197, 94, 0.3)"
              ]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-4 px-10 rounded-full shadow-2xl transition-all z-20 relative overflow-hidden"
            style={{ fontSize: `${yesButtonSize}px` }}
            onClick={handleYesClick}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative z-10">Yes! 💚</span>
          </motion.button>
          
          <motion.button
            animate={{ 
              x: noButtonPos.x,
              y: noButtonPos.y,
              rotate: noCount >= 5 ? [0, -10, 10, 0] : 0
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              rotate: { duration: 0.3, repeat: noCount >= 5 ? Infinity : 0 }
            }}
            onClick={handleNoClick}
            onMouseEnter={handleNoHover}
            whileHover={{ scale: noCount < 5 ? 1.05 : 0.95 }}
            className="bg-gradient-to-r from-rose-400 to-rose-600 hover:from-rose-500 hover:to-rose-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
            style={{ 
              position: noCount >= 3 ? 'fixed' : 'relative',
              left: noCount >= 3 ? '50%' : 'auto',
              top: noCount >= 3 ? '50%' : 'auto',
            }}
          >
            {getNoButtonText()}
          </motion.button>
        </div>

        {noCount >= 8 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-rose-500 text-center mt-6 text-xl font-bold px-4"
          >
            Your Sudu Mahaththaya is still here waiting, Sudu Manika... 🥺💕
          </motion.p>
        )}

        {/* Progress indicator showing how many times they've said no */}
        {noCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex gap-2 justify-center"
          >
            {[...Array(Math.min(noCount, 10))].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="w-3 h-3 bg-rose-400 rounded-full"
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ValentinePage;