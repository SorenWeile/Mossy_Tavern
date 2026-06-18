import React, { useState } from 'react';
import '../styles/dice.css';

// Dice component for individual die
const Die = ({ faces, value, rolling, onClick }) => {
  const diceUnicode = {
    4: ['⚃', '⚁', '⚂', '⚀'],
    6: ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'],
    10: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    20: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
          '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    100: ['1'] // d100 typically shows 1-100 as numbers
  };

  const displayValue = diceUnicode[faces] ? diceUnicode[faces][value - 1] || value : value;

  return (
    <button 
      className={`dice dice-d${faces} ${rolling ? 'rolling' : ''}`}
      onClick={onClick}
      disabled={rolling}
    >
      <span className="dice-face">{value > 0 ? (faces === 100 ? value : displayValue) : '?'}</span>
      <span className="dice-label">d{faces}</span>
    </button>
  );
};

// Main DiceRoller component
const DiceRoller = () => {
  const [rolls, setRolls] = useState([]);
  const [rolling, setRolling] = useState(false);
  const [selectedDie, setSelectedDie] = useState(null);

  // Available dice types
  const diceTypes = [4, 6, 10, 20, 100];

  // Roll a die
  const rollDie = (faces) => {
    if (rolling) return;
    
    setRolling(true);
    setSelectedDie(faces);
    
    // Show rolling animation
    const rollInterval = setInterval(() => {
      setRolls(prev => [
        ...prev.slice(0, -1),
        { faces, value: Math.floor(Math.random() * faces) + 1 }
      ]);
    }, 100);

    // Stop after 1 second and show final result
    setTimeout(() => {
      clearInterval(rollInterval);
      const result = Math.floor(Math.random() * faces) + 1;
      setRolls(prev => [
        ...prev.slice(-4), // Keep last 4 rolls
        { faces, value: result }
      ]);
      setRolling(false);
      setSelectedDie(null);
    }, 1000);
  };

  // Roll all dice
  const rollAll = () => {
    if (rolling) return;
    
    setRolling(true);
    
    // Roll each die type after a short delay
    diceTypes.forEach((faces, index) => {
      setTimeout(() => {
        const result = Math.floor(Math.random() * faces) + 1;
        setRolls(prev => [
          ...prev.filter(r => r.faces !== faces),
          { faces, value: result }
        ]);
        if (index === diceTypes.length - 1) {
          setTimeout(() => setRolling(false), 500);
        }
      }, index * 150);
    });
  };

  // Clear rolls
  const clearRolls = () => {
    setRolls([]);
  };

  return (
    <div className="dice-roller-container">
      <h2>🎲 The Tavern Dice</h2>
      
      <div className="dice-grid">
        {diceTypes.map(faces => (
          <Die
            key={faces}
            faces={faces}
            value={rolls.find(r => r.faces === faces)?.value || 0}
            rolling={rolling && selectedDie === faces}
            onClick={() => rollDie(faces)}
          />
        ))}
      </div>

      <div className="dice-actions">
        <button 
          className="dice-button roll-all"
          onClick={rollAll}
          disabled={rolling}
        >
          {rolling ? 'Rolling...' : 'Roll All Dice'}
        </button>
        <button 
          className="dice-button clear"
          onClick={clearRolls}
          disabled={rolls.length === 0}
        >
          Clear Rolls
        </button>
      </div>

      {rolls.length > 0 && (
        <div className="dice-history">
          <h3>📜 Last Rolls:</h3>
          <ul>
            {rolls.slice().reverse().map((roll, index) => (
              <li key={index}>
                <span className="dice-result">d{roll.faces}: {roll.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
