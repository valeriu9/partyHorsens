import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, RotateCcw, Wine } from "lucide-react";
import "./App.css";
import SwipeCard from "./components/SwipeCard";
import { partyPeople } from "./data/partyPeople";

function App() {
  const [cards, setCards] = useState([...partyPeople]);
  const [swipedCards, setSwipedCards] = useState([]);

  const handleSwipe = useCallback((direction) => {
    setCards((prev) => {
      if (prev.length === 0) return prev;
      const [swiped, ...rest] = prev;
      setSwipedCards((s) => [...s, { ...swiped, direction }]);
      return rest;
    });
  }, []);

  const handleButtonSwipe = (direction) => {
    if (cards.length > 0) {
      handleSwipe(direction);
    }
  };

  const handleReset = () => {
    setCards([...partyPeople]);
    setSwipedCards([]);
  };

  return (
    <div className="app-container" data-testid="app-container">
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />

      {/* Header */}
      <header className="app-header">
        <div className="app-logo" data-testid="app-logo">
          <Wine size={24} style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
          PARTY SWIPE
        </div>
      </header>

      {/* Card Stack */}
      <div className="card-stack" data-testid="card-stack">
        <AnimatePresence mode="popLayout">
          {cards.length > 0 ? (
            // Show top 3 cards for stack effect
            cards.slice(0, 3).map((person, index) => (
              <SwipeCard
                key={person.id}
                person={person}
                onSwipe={handleSwipe}
                isTop={index === 0}
                style={{
                  zIndex: 3 - index,
                  scale: 1 - index * 0.05,
                  y: index * 10,
                }}
              />
            ))
          ) : (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              data-testid="empty-state"
            >
              <Wine size={64} color="#FF0055" />
              <h2>No More Parties!</h2>
              <p>You've seen everyone in your area</p>
              <button 
                className="reset-btn" 
                onClick={handleReset}
                data-testid="reset-button"
              >
                Start Over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe hint */}
      {cards.length > 0 && (
        <p className="swipe-hint">Swipe or use buttons below</p>
      )}

      {/* Action Buttons */}
      {cards.length > 0 && (
        <div className="action-buttons">
          <motion.button
            className="action-btn nope"
            onClick={() => handleButtonSwipe("left")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Pass"
            data-testid="pass-button"
          >
            <X size={32} strokeWidth={3} />
          </motion.button>
          
          <motion.button
            className="action-btn like"
            onClick={() => handleButtonSwipe("right")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Like"
            data-testid="like-button"
          >
            <Heart size={32} strokeWidth={3} />
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default App;
