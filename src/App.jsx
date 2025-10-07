import React, { useState, useEffect } from 'react';
import { Brain, Zap, Trophy, Clock, Heart, ChevronLeft, Medal, User, ArrowRight } from 'lucide-react';

const quizData = {
  basic: [
    {
      question: "What is Rialo?",
      options: ["A cryptocurrency exchange", "A Layer 1 blockchain", "A wallet app", "A mining software"],
      correct: 1
    },
    {
      question: "Who created Rialo?",
      options: ["Subzero Labs", "Bitcoin Foundation", "Ethereum Labs", "Solana Team"],
      correct: 0
    },
    {
      question: "What makes Rialo special?",
      options: ["Slow transactions", "High fees", "Web2-like speed", "Proof of Work"],
      correct: 2
    },
    {
      question: "What is a blockchain?",
      options: ["A type of cryptocurrency", "A digital ledger", "An internet browser", "A mining pool"],
      correct: 1
    },
    {
      question: "What does 'decentralized' mean?",
      options: ["Controlled by one company", "No single point of control", "Faster than centralized", "Located in one place"],
      correct: 1
    },
    {
      question: "What is a smart contract?",
      options: ["A legal document", "Self-executing code on blockchain", "A mining agreement", "A wallet password"],
      correct: 1
    },
    {
      question: "What is Rialo designed for?",
      options: ["Gaming only", "Internet-scale dApps", "File storage", "Video streaming"],
      correct: 1
    },
    {
      question: "What does dApp stand for?",
      options: ["Digital Application", "Decentralized Application", "Download App", "Developer App"],
      correct: 1
    }
  ],
  medium: [
    {
      question: "What VM does Rialo support?",
      options: ["Only EVM", "Only Solana VM", "Both Solana VM and RISC-V", "Neither"],
      correct: 2
    },
    {
      question: "What is RISC-V in Rialo?",
      options: ["A programming language", "An instruction set architecture", "A consensus mechanism", "A token standard"],
      correct: 1
    },
    {
      question: "What key feature does Rialo offer developers?",
      options: ["Slow deployment", "High gas fees", "Native web connectivity", "Manual transactions"],
      correct: 2
    },
    {
      question: "What is the main goal of Rialo?",
      options: ["Replace Bitcoin", "Internet-scale performance", "Centralized control", "Slow and secure only"],
      correct: 1
    },
    {
      question: "What does 'Layer 1' blockchain mean?",
      options: ["First blockchain ever", "Base blockchain protocol", "Testing network", "Second layer solution"],
      correct: 1
    },
    {
      question: "What advantage does Rialo have over traditional blockchains?",
      options: ["Slower speed", "Higher latency", "Web2-like responsiveness", "More complex"],
      correct: 2
    },
    {
      question: "What can developers build on Rialo?",
      options: ["Only simple transfers", "Complex internet-scale apps", "Just games", "Only NFTs"],
      correct: 1
    },
    {
      question: "What does 'native web connectivity' mean?",
      options: ["Needs third-party bridges", "Direct blockchain-web integration", "Only works offline", "Requires VPN"],
      correct: 1
    }
  ],
  pro: [
    {
      question: "How does Rialo achieve Web2-like responsiveness?",
      options: ["By sacrificing decentralization", "Through optimized architecture and parallel processing", "Using centralized servers", "By limiting users"],
      correct: 1
    },
    {
      question: "What is the significance of RISC-V smart contracts in Rialo?",
      options: ["They're slower but secure", "They offer performance and flexibility", "They only work with Rust", "They require more gas"],
      correct: 1
    },
    {
      question: "How does Rialo handle transaction throughput?",
      options: ["Sequential processing only", "Optimized for high-volume parallel execution", "Limited to 10 TPS", "Requires off-chain solutions"],
      correct: 1
    },
    {
      question: "What developer advantage does Solana VM compatibility provide?",
      options: ["Slower execution", "Ecosystem portability and familiar tooling", "More complexity", "Higher costs"],
      correct: 1
    },
    {
      question: "How does Rialo's architecture differ from traditional L1s?",
      options: ["It's exactly the same", "Designed for internet-scale from ground up", "It's slower by design", "It's centralized"],
      correct: 1
    },
    {
      question: "What is the primary use case for Rialo?",
      options: ["Simple token transfers", "Decentralized apps requiring Web2 performance", "Proof of Work mining", "Storage only"],
      correct: 1
    },
    {
      question: "What does 'internet-scale' mean for Rialo?",
      options: ["Available on internet", "Handles massive concurrent users smoothly", "Works with ISPs", "Needs internet connection"],
      correct: 1
    },
    {
      question: "How does Rialo balance speed and decentralization?",
      options: ["Sacrifices decentralization", "Advanced consensus and architecture optimization", "Uses centralized validators", "Limits node count"],
      correct: 1
    }
  ]
};

export default function RialoQuiz() {
  const [screen, setScreen] = useState('menu');
  const [difficulty, setDifficulty] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(5);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const [nameError, setNameError] = useState('');
  const [leaderboard, setLeaderboard] = useState([
    { name: "CryptoMaster", score: 240, mode: "Pro" },
    { name: "BlockchainPro", score: 230, mode: "Pro" },
    { name: "RialoFan", score: 200, mode: "Good" },
    { name: "WebSpeed", score: 180, mode: "Good" },
    { name: "Newbie123", score: 80, mode: "Basic" }
  ]);
  const [timeoutId, setTimeoutId] = useState(null);

  const getTimeForDifficulty = (level) => {
    if (level === 'basic') return 5;
    if (level === 'medium') return 8;
    return 10;
  };

  const updateLeaderboard = (name, finalScore, mode) => {
    const newEntry = { name, score: finalScore, mode };
    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    setLeaderboard(updated);
  };

  useEffect(() => {
    if (screen === 'game' && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && screen === 'game' && !showResult) {
      handleWrongAnswer();
    }
  }, [timeLeft, screen, showResult]);

  const showNamePrompt = (level) => {
    setSelectedMode(level);
    setShowNameInput(true);
  };

  const startGameWithName = () => {
    if (playerName.trim() === '') {
      setNameError('Please enter your name!');
      return;
    }
    setNameError('');
    setShowNameInput(false);
    startGame(selectedMode);
  };

  const startGame = (level) => {
    setDifficulty(level);
    setQuestions(quizData[level]);
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setTimeLeft(getTimeForDifficulty(level));
    setSelectedAnswer(null);
    setShowResult(false);
    setScreen('game');
  };

  const goBack = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (screen === 'game') {
      setScreen('menu');
      setQuestions([]);
      setScore(0);
      setLives(3);
    } else if (screen === 'gameover' || screen === 'victory') {
      setScreen('menu');
    }
  };

  const handleAnswer = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = index === questions[currentQuestion].correct;
    
    const id = setTimeout(() => {
      if (isCorrect) {
        setScore(score + (difficulty === 'basic' ? 10 : difficulty === 'medium' ? 20 : 30));
        nextQuestion();
      } else {
        handleWrongAnswer();
      }
    }, 1500);
    setTimeoutId(id);
  };

  const handleWrongAnswer = () => {
    const newLives = lives - 1;
    setLives(newLives);
    
    if (newLives === 0) {
      if (timeoutId) clearTimeout(timeoutId);
      const modeText = difficulty === 'basic' ? 'Basic' : difficulty === 'medium' ? 'Good' : 'Pro';
      updateLeaderboard(playerName, score, modeText);
      setTimeout(() => setScreen('gameover'), 1000);
    } else {
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    if (timeoutId) clearTimeout(timeoutId);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(getTimeForDifficulty(difficulty));
    } else {
      const modeText = difficulty === 'basic' ? 'Basic' : difficulty === 'medium' ? 'Good' : 'Pro';
      const isLastAnswerCorrect = selectedAnswer === questions[currentQuestion].correct;
      const pointsForLastAnswer = isLastAnswerCorrect ? (difficulty === 'basic' ? 10 : difficulty === 'medium' ? 20 : 30) : 0;
      const finalScore = score + pointsForLastAnswer;
      updateLeaderboard(playerName, finalScore, modeText);
      setTimeout(() => setScreen('victory'), 1000);
    }
  };

  const getDifficultyColor = () => {
    if (difficulty === 'basic') return 'from-green-500 to-emerald-600';
    if (difficulty === 'medium') return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getMedalColor = (index) => {
    if (index === 0) return 'text-yellow-400';
    if (index === 1) return 'text-gray-400';
    if (index === 2) return 'text-amber-600';
    return 'text-purple-400';
  };

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/70 backdrop-blur rounded-lg p-8">
          <button
            onClick={() => setShowNameInput(false)}
            className="mb-4 flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          
          <div className="text-center mb-6">
            <User className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h2 className="text-3xl font-bold text-white mb-2">What's your name?</h2>
            <p className="text-purple-300">Enter your name to start the quiz</p>
          </div>

          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setNameError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && startGameWithName()}
            placeholder="Enter your name..."
            className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            maxLength={20}
            autoFocus
          />
          {nameError && <p className="text-red-400 text-sm mb-4 text-center">{nameError}</p>}

          <button
            onClick={startGameWithName}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 mt-2"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Menu */}
            <div className="md:col-span-2">
              <div className="mb-8 text-center">
                <Brain className="w-24 h-24 mx-auto mb-4 text-yellow-400" />
                <h1 className="text-6xl font-bold text-white mb-2">Rialo Quiz Hub</h1>
                <p className="text-purple-300 text-xl">Test Your Rialo & Blockchain Knowledge!</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => showNamePrompt('basic')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-6 px-8 rounded-xl text-2xl transition-all transform hover:scale-105 shadow-lg"
                >
                  🌱 Basic Mode
                  <div className="text-sm opacity-90 mt-1">Easy questions • 5 seconds per question</div>
                </button>

                <button
                  onClick={() => showNamePrompt('medium')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-6 px-8 rounded-xl text-2xl transition-all transform hover:scale-105 shadow-lg"
                >
                  ⚡ Good Knowledge Mode
                  <div className="text-sm opacity-90 mt-1">Medium difficulty • 8 seconds per question</div>
                </button>

                <button
                  onClick={() => showNamePrompt('pro')}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-6 px-8 rounded-xl text-2xl transition-all transform hover:scale-105 shadow-lg"
                >
                  🔥 Pro Knowledge Mode
                  <div className="text-sm opacity-90 mt-1">Hard questions • 10 seconds per question</div>
                </button>
              </div>

              <div className="mt-6 text-center text-purple-300">
                <p className="text-sm">Powered by Sumit</p>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Top Players</h3>
              </div>
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-3 flex items-center gap-3">
                    <Medal className={`w-5 h-5 ${getMedalColor(index)}`} />
                    <div className="flex-1">
                      <div className="text-white font-semibold text-sm">{player.name}</div>
                      <div className="text-purple-300 text-xs">{player.mode} Mode</div>
                    </div>
                    <div className="text-yellow-400 font-bold text-lg">{player.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'game') {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          {/* Back Button */}
          <button
            onClick={goBack}
            className="mb-4 flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Menu</span>
          </button>

          {/* Header */}
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">{playerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold text-xl">{score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className={`text-white font-bold text-xl ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : ''}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
                  />
                ))}
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${getDifficultyColor()} transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-slate-800/70 backdrop-blur rounded-lg p-8 mb-4">
            <div className="text-purple-300 text-sm mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <h2 className="text-white text-2xl font-bold mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                let bgColor = 'bg-slate-700/50 hover:bg-slate-600/50';
                
                if (showResult) {
                  if (index === question.correct) {
                    bgColor = 'bg-green-600';
                  } else if (index === selectedAnswer) {
                    bgColor = 'bg-red-600';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full ${bgColor} text-white font-semibold py-4 px-6 rounded-lg text-left transition-all transform hover:scale-102 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && index === question.correct && (
                        <span className="text-2xl">✓</span>
                      )}
                      {showResult && index === selectedAnswer && index !== question.correct && (
                        <span className="text-2xl">✗</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
             {/* Next Question Button */}
            {showResult && (
              <div className="mt-6 text-right">
                <button 
                  onClick={nextQuestion}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 ml-auto"
                >
                  Next Question <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="text-center">
            <span className={`inline-block px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r ${getDifficultyColor()}`}>
              {difficulty === 'basic' ? '🌱 Basic' : difficulty === 'medium' ? '⚡ Good Knowledge' : '🔥 Pro Knowledge'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'gameover') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button
            onClick={goBack}
            className="mb-4 flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Menu</span>
          </button>
          
          <div className="text-center bg-slate-800/70 backdrop-blur rounded-lg p-8">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
            <div className="text-purple-300 text-lg mb-2">
              Nice try, {playerName}!
            </div>
            <div className="text-purple-400 text-sm mb-6">
              You ran out of lives, but you still learned something!
            </div>
            <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
              <div className="text-yellow-400 text-sm mb-2">Final Score</div>
              <div className="text-5xl font-bold text-white">{score}</div>
            </div>
            <button
              onClick={() => { setScreen('menu'); setPlayerName(''); }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'victory') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button
            onClick={goBack}
            className="mb-4 flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Menu</span>
          </button>

          <div className="text-center bg-slate-800/70 backdrop-blur rounded-lg p-8">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-white mb-4">Victory!</h2>
            <div className="text-purple-300 text-lg mb-2">
              Congratulations, {playerName}!
            </div>
            <div className="text-purple-400 text-sm mb-6">
              You've mastered {difficulty === 'basic' ? 'the basics' : difficulty === 'medium' ? 'good knowledge' : 'pro level'} of Rialo!
            </div>
            <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
              <div className="text-yellow-400 text-sm mb-2">Final Score</div>
              <div className="text-5xl font-bold text-white">{score}</div>
              <div className="text-purple-300 text-sm mt-2">
                {lives} {lives === 1 ? 'life' : 'lives'} remaining
              </div>
            </div>
            <div className="space-y-3">
              {difficulty !== 'pro' && (
                <button
                  onClick={() => { setShowNameInput(false); startGame(difficulty === 'basic' ? 'medium' : 'pro'); }}
                  className={`w-full bg-gradient-to-r ${difficulty === 'basic' ? 'from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700' : 'from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'} text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105`}
                >
                  {difficulty === 'basic' ? '⚡ Try Good Knowledge Mode' : '🔥 Try Pro Mode'}
                </button>
              )}
              <button
                onClick={() => { setScreen('menu'); setPlayerName(''); }}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

