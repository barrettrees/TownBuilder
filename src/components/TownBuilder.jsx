import React, { useState, useRef, useEffect } from 'react';
import { Trash2, User } from 'lucide-react';

const TownBuilder = () => {
  const [selectedSprite, setSelectedSprite] = useState(0);
  const [placedSprites, setPlacedSprites] = useState({
    1: [], // Act 1
    2: [], // Act 2
    3: []  // Act 3
  });
  const [playerPos, setPlayerPos] = useState({
    1: { x: 0, y: 0 },
    2: { x: 0, y: 0 },
    3: { x: 0, y: 0 }
  });
  const [mode, setMode] = useState('build'); // 'build' or 'play'
  const [dialogue, setDialogue] = useState(null);
  const [placingPlayer, setPlacingPlayer] = useState(false);
  const [editingDialogue, setEditingDialogue] = useState(null);
  const [currentAct, setCurrentAct] = useState(1); // 1, 2, or 3
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const GRID_SIZE = 50;
  const GRID_WIDTH = 40;
  const GRID_HEIGHT = 15;

  // Apply CSS reset
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
      #root { width: 100%; height: 100%; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Sprite data with multiple dialogue options
  const sprites = [
    { 
      color: '#C0C0C0', 
      name: 'Knight', 
      dialogues: [
        "Honor and valor guide my blade!",
        "The kingdom's safety is my sworn duty.",
        "I have fought in many battles for our realm.",
        "A true knight never abandons their post.",
        "May your journey be blessed with courage."
      ]
    },
    { 
      color: '#8B7355', 
      name: 'Squire', 
      dialogues: [
        "One day I'll be a knight like my master!",
        "I'm still learning, but I'll do my best!",
        "Polishing armor is harder than it looks...",
        "The knight's code is something I aspire to follow.",
        "Can you teach me some sword techniques?"
      ]
    },
    { 
      color: '#FF6B6B', 
      name: 'Villager', 
      dialogues: [
        "Hello traveler! Welcome to our humble village.",
        "Beautiful day, isn't it? Perfect for a stroll.",
        "Have you seen the sunrise today? Simply magnificent!",
        "The harvest this year has been wonderful!",
        "Welcome, friend! Make yourself at home."
      ]
    },
    { 
      color: '#4ECDC4', 
      name: 'Merchant', 
      dialogues: [
        "Looking to buy some wares? I've got the finest goods!",
        "Special prices today only! Come take a look!",
        "I've traveled far and wide to bring you these treasures.",
        "Business is booming! What can I get for you?",
        "Rare items from distant lands, right here!"
      ]
    },
    { 
      color: '#45B7D1', 
      name: 'Guard', 
      dialogues: [
        "Halt! State your business... oh, you're friendly. Carry on.",
        "Stay vigilant. There are dangers on the roads.",
        "Everything is secure here. You may pass.",
        "I protect this town with my life!",
        "Keep your wits about you, traveler."
      ]
    },
    { 
      color: '#FFD700', 
      name: 'Queen', 
      dialogues: [
        "Welcome to my court. What brings you here?",
        "The kingdom prospers under wise leadership.",
        "I rule with both strength and compassion.",
        "My people's welfare is my highest priority.",
        "Speak freely, you are among friends here."
      ]
    },
    { 
      color: '#8B0000', 
      name: 'Evil Guard', 
      dialogues: [
        "Move along... or face the consequences.",
        "The old ways are gone. New order prevails now.",
        "Don't test my patience, stranger.",
        "You ask too many questions...",
        "Keep walking if you know what's good for you."
      ]
    },
    { 
      color: '#9370DB', 
      name: 'Advisor', 
      dialogues: [
        "I counsel the throne on matters of state.",
        "Wisdom comes from careful observation.",
        "The political landscape shifts like sand...",
        "Knowledge is the greatest power of all.",
        "I've seen many rulers come and go."
      ]
    },
    { 
      color: '#2F4F4F', 
      name: 'Assassin', 
      dialogues: [
        "You saw nothing. Understood?",
        "Some secrets are worth dying for...",
        "Everyone has a price. What's yours?",
        "The shadows are my domain.",
        "Trust no one in this place."
      ]
    }
  ];

  const handleCanvasClick = (e) => {
    if (mode !== 'build') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate grid position based on percentage
    const gridX = Math.floor((x / rect.width) * GRID_WIDTH);
    const gridY = Math.floor((y / rect.height) * GRID_HEIGHT);
    
    // Check if within grid bounds
    if (gridX < 0 || gridX >= GRID_WIDTH || gridY < 0 || gridY >= GRID_HEIGHT) {
      return;
    }
    
    // If placing player starting position
    if (placingPlayer) {
      setPlayerPos({ ...playerPos, [currentAct]: { x: gridX, y: gridY } });
      setPlacingPlayer(false);
      return;
    }
    
    // Check if there's already a sprite at this position
    const currentSprites = placedSprites[currentAct];
    const existingIndex = currentSprites.findIndex(s => s.x === gridX && s.y === gridY);
    
    if (existingIndex !== -1) {
      // Replace existing sprite
      const updated = [...currentSprites];
      updated[existingIndex] = {
        x: gridX,
        y: gridY,
        spriteIndex: selectedSprite,
        id: Date.now()
      };
      setPlacedSprites({ ...placedSprites, [currentAct]: updated });
    } else {
      // Add new sprite
      setPlacedSprites({ 
        ...placedSprites, 
        [currentAct]: [...currentSprites, {
          x: gridX,
          y: gridY,
          spriteIndex: selectedSprite,
          id: Date.now()
        }]
      });
    }
  };

  const clearAll = () => {
    setPlacedSprites({ ...placedSprites, [currentAct]: [] });
  };

  const removeSprite = (id) => {
    setPlacedSprites({ 
      ...placedSprites, 
      [currentAct]: placedSprites[currentAct].filter(s => s.id !== id) 
    });
  };

  const updateDialogue = (id, newDialogue) => {
    setPlacedSprites({
      ...placedSprites,
      [currentAct]: placedSprites[currentAct].map(s => 
        s.id === id ? { ...s, customDialogue: newDialogue } : s
      )
    });
    setEditingDialogue(null);
  };

  const randomizeDialogue = (sprite) => {
    const dialogues = sprites[sprite.spriteIndex].dialogues;
    const currentDialogue = sprite.customDialogue || dialogues[0];
    const availableDialogues = dialogues.filter(d => d !== currentDialogue);
    const randomDialogue = availableDialogues[Math.floor(Math.random() * availableDialogues.length)];
    
    setPlacedSprites({
      ...placedSprites,
      [currentAct]: placedSprites[currentAct].map(s => 
        s.id === sprite.id ? { ...s, customDialogue: randomDialogue } : s
      )
    });
  };

  const exportCSV = () => {
    const currentSprites = placedSprites[currentAct];
    const headers = ['Type', 'X', 'Y', 'Dialogue'];
    const rows = currentSprites.map(sprite => [
      sprites[sprite.spriteIndex].name,
      sprite.x,
      sprite.y,
      (sprite.customDialogue || sprites[sprite.spriteIndex].dialogues[0]).replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map((cell, idx) => idx === 3 ? `"${cell}"` : cell).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `town-act${currentAct}-dialogue.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header row
      const dataLines = lines.slice(1);
      
      const imported = dataLines.map((line, index) => {
        // Parse CSV line (handle quoted fields)
        const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
        if (!matches || matches.length < 4) return null;
        
        const [type, x, y, dialogue] = matches.map(m => m.replace(/^"|"$/g, '').replace(/""/g, '"'));
        
        // Find sprite index by name
        const spriteIndex = sprites.findIndex(s => s.name === type);
        if (spriteIndex === -1) return null;
        
        return {
          x: parseInt(x),
          y: parseInt(y),
          spriteIndex,
          customDialogue: dialogue !== sprites[spriteIndex].dialogues[0] ? dialogue : undefined,
          id: Date.now() + index
        };
      }).filter(Boolean);

      setPlacedSprites({ ...placedSprites, [currentAct]: imported });
      e.target.value = ''; // Reset input
    };

    reader.readAsText(file);
  };

  // Handle keyboard movement in play mode
  useEffect(() => {
    if (mode !== 'play') return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const currentPlayerPos = playerPos[currentAct];
      let newX = currentPlayerPos.x;
      let newY = currentPlayerPos.y;

      if (key === 'arrowup' || key === 'w') {
        newY = Math.max(0, currentPlayerPos.y - 1);
        e.preventDefault();
      } else if (key === 'arrowdown' || key === 's') {
        newY = Math.min(GRID_HEIGHT - 1, currentPlayerPos.y + 1);
        e.preventDefault();
      } else if (key === 'arrowleft' || key === 'a') {
        newX = Math.max(0, currentPlayerPos.x - 1);
        e.preventDefault();
      } else if (key === 'arrowright' || key === 'd') {
        newX = Math.min(GRID_WIDTH - 1, currentPlayerPos.x + 1);
        e.preventDefault();
      }

      if (newX !== currentPlayerPos.x || newY !== currentPlayerPos.y) {
        setPlayerPos({ ...playerPos, [currentAct]: { x: newX, y: newY } });
        
        // Check if player is adjacent to any sprite
        const adjacent = placedSprites[currentAct].find(sprite => {
          const dx = Math.abs(sprite.x - newX);
          const dy = Math.abs(sprite.y - newY);
          return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
        });

        if (adjacent) {
          setDialogue({
            name: sprites[adjacent.spriteIndex].name,
            text: adjacent.customDialogue || sprites[adjacent.spriteIndex].dialogues[0]
          });
        } else {
          setDialogue(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, playerPos, placedSprites, currentAct]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', background: 'linear-gradient(to bottom right, #d1fae5, #dbeafe)' }}>
      <div style={{ width: '100%', height: '100%', background: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(to right, #d97706, #b45309)', padding: '1rem', color: 'white', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ minWidth: '200px' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>🏘️ Town Builder</h1>
              <p style={{ color: '#fde68a', margin: '0.25rem 0 0 0' }}>
                {mode === 'build' ? 'Click to place townsfolk' : 'Use arrow keys or WASD to move'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap' }}>
              <div style={{ display: 'flex', gap: '0.25rem', background: '#92400e', borderRadius: '0.5rem', padding: '0.25rem' }}>
                {[1, 2, 3].map(act => (
                  <button
                    key={act}
                    onClick={() => setCurrentAct(act)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: 'pointer',
                      background: currentAct === act ? 'white' : 'transparent',
                      color: currentAct === act ? '#b45309' : '#fde68a'
                    }}
                  >
                    Act {act}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setMode(mode === 'build' ? 'play' : 'build')}
                style={{
                  background: 'white',
                  color: '#b45309',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {mode === 'build' ? '▶️ Play' : '🔨 Build'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area with Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: mode === 'build' ? '280px minmax(60%, 1fr) 340px' : '1fr',
          gap: 0,
          flex: 1,
          overflow: 'hidden',
          minHeight: 0,
          width: '100%'
        }}>
          {/* Left Sidebar - Sprite Palette */}
          {mode === 'build' && (
            <div style={{ background: '#f9fafb', padding: '1rem', borderRight: '1px solid #e5e7eb', overflowY: 'auto' }}>
              <h2 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem', color: '#374151' }}>Townsfolk</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sprites.map((sprite, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSprite(idx)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      border: 'none',
                      cursor: 'pointer',
                      background: selectedSprite === idx ? '#3b82f6' : 'white',
                      color: selectedSprite === idx ? 'white' : '#374151',
                      transform: selectedSprite === idx ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: selectedSprite === idx ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                    }}
                  >
                    <div
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '0.25rem',
                        border: '2px solid #d1d5db',
                        backgroundColor: sprite.color
                      }}
                    />
                    <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{sprite.name}</span>
                  </button>
                ))}
              </div>
              
              <div style={{ marginTop: '0rem', paddingTop: '0rem', borderTop: '1px solid #e5e7eb' }}>
                <button
                  onClick={() => setPlacingPlayer(!placingPlayer)}
                  style={{
                    width: '100%',
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    background: placingPlayer ? '#eab308' : '#3b82f6',
                    color: 'white'
                  }}
                >
                  <User size={20} />
                  {placingPlayer ? 'Click to Place Player' : 'Set Player Start'}
                </button>
                <button
                  onClick={clearAll}
                  style={{
                    width: '100%',
                    background: '#ef4444',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={20} />
                  Clear Town
                </button>
              </div>
            </div>
          )}

          {/* Center - Canvas Area */}
          <div style={{ padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {mode === 'build' && (
              <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#4b5563', flexShrink: 0 }}>
                {placingPlayer ? (
                  <span style={{ color: '#ca8a04', fontWeight: 'bold' }}>👆 Click on the grid to set player starting position for Act {currentAct}</span>
                ) : (
                  <>
                    <span style={{ fontWeight: 'bold', color: '#9333ea' }}>Act {currentAct}</span>
                    {' | '}
                    Selected: <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{sprites[selectedSprite].name}</span>
                    {' | '}
                    Population: <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{placedSprites[currentAct].length}</span>
                  </>
                )}
              </div>
            )}

            {mode === 'play' && (
              <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#4b5563', flexShrink: 0 }}>
                <span style={{ fontWeight: 'bold', color: '#9333ea' }}>Act {currentAct}</span>
                {' | '}
                Position: <span style={{ fontWeight: 'bold', color: '#1f2937' }}>({playerPos[currentAct].x / GRID_SIZE}, {playerPos[currentAct].y / GRID_SIZE})</span>
                {' | '}
                <span style={{ color: '#2563eb' }}>Walk next to townsfolk to talk to them!</span>
              </div>
            )}
            
            <div
              ref={canvasRef}
              onClick={handleCanvasClick}
              style={{
                width: '100%',
                height:'100%',
                maxWidth: GRID_WIDTH * GRID_SIZE,
                aspectRatio: `${GRID_WIDTH} / ${GRID_HEIGHT}`,
                background: 'linear-gradient(to bottom right, #bbf7d0, #86efac)',
                borderRadius: '0.5rem',
                position: 'relative',
                boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                cursor: mode === 'build' ? (placingPlayer ? 'pointer' : 'crosshair') : 'default',
                backgroundImage: mode === 'build' ? `
                  repeating-linear-gradient(0deg, transparent, transparent calc(${100 / GRID_HEIGHT}% - 1px), rgba(0,0,0,0.2) calc(${100 / GRID_HEIGHT}% - 1px), rgba(0,0,0,0.2) calc(${100 / GRID_HEIGHT}%)),
                  repeating-linear-gradient(90deg, transparent, transparent calc(${100 / GRID_WIDTH}% - 1px), rgba(0,0,0,0.2) calc(${100 / GRID_WIDTH}% - 1px), rgba(0,0,0,0.2) calc(${100 / GRID_WIDTH}%))
                ` : 'none',
                backgroundSize: `${100 / GRID_WIDTH}% ${100 / GRID_HEIGHT}%`,
                backgroundPosition: '0 0'
              }}
            >
              {/* Placed sprites */}
              {placedSprites[currentAct].map((sprite) => (
                <div
                  key={sprite.id}
                  className="group"
                  style={{
                    position: 'absolute',
                    left: `${(sprite.x / GRID_WIDTH) * 100}%`,
                    top: `${(sprite.y / GRID_HEIGHT) * 100}%`,
                    width: `${(1 / GRID_WIDTH) * 100}%`,
                    height: `${(1 / GRID_HEIGHT) * 100}%`
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '0.5rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      border: '2px solid white',
                      backgroundColor: sprites[sprite.spriteIndex].color
                    }}
                  />
                  {mode === 'build' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSprite(sprite.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '-0.5rem',
                        right: '-0.5rem',
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '1.5rem',
                        height: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        fontSize: '1.25rem',
                        lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              {/* Player character */}
              {(mode === 'play' || (mode === 'build' && !placingPlayer)) && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${(playerPos[currentAct].x / GRID_WIDTH) * 100}%`,
                    top: `${(playerPos[currentAct].y / GRID_HEIGHT) * 100}%`,
                    width: `${(1 / GRID_WIDTH) * 100}%`,
                    height: `${(1 / GRID_HEIGHT) * 100}%`,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: '#facc15',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    border: '4px solid #ca8a04',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: mode === 'build' ? 0.5 : 1
                  }}>
                    <User size={30} style={{ color: '#92400e' }} />
                  </div>
                </div>
              )}

              {/* Dialogue box */}
              {dialogue && mode === 'play' && (
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  padding: '1rem',
                  maxWidth: '28rem',
                  border: '4px solid #1f2937'
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#1f2937' }}>{dialogue.name}</div>
                  <div style={{ color: '#374151' }}>{dialogue.text}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Spreadsheet */}
          {mode === 'build' && (
            <div style={{ background: '#f9fafb', padding: '1rem', borderLeft: '1px solid #e5e7eb', overflowY: 'auto' }}>
              <h2 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem', color: '#374151' }}>Act {currentAct} Townsfolk</h2>
              
              {placedSprites[currentAct].length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: '0.875rem', fontStyle: 'italic' }}>No townsfolk placed yet</p>
              ) : (
                <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                      <thead style={{ background: '#e5e7eb' }}>
                        <tr>
                          <th style={{ padding: '0.5rem', textAlign: 'left' }}>Type</th>
                          <th style={{ padding: '0.5rem', textAlign: 'left' }}>X</th>
                          <th style={{ padding: '0.5rem', textAlign: 'left' }}>Y</th>
                          <th style={{ padding: '0.5rem' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {placedSprites[currentAct].map((sprite, idx) => (
                          <React.Fragment key={sprite.id}>
                            <tr style={{ background: idx % 2 === 0 ? '#f9fafb' : 'white' }}>
                              <td style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div
                                  style={{
                                    width: '1.5rem',
                                    height: '1.5rem',
                                    borderRadius: '0.25rem',
                                    border: '1px solid #e5e7eb',
                                    flexShrink: 0,
                                    backgroundColor: sprites[sprite.spriteIndex].color
                                  }}
                                />
                                <span style={{ fontSize: '0.75rem' }}>{sprites[sprite.spriteIndex].name}</span>
                              </td>
                              <td style={{ padding: '0.5rem', color: '#4b5563' }}>{sprite.x}</td>
                              <td style={{ padding: '0.5rem', color: '#4b5563' }}>{sprite.y}</td>
                              <td style={{ padding: '0.5rem' }}>
                                <button
                                  onClick={() => removeSprite(sprite.id)}
                                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                            <tr style={{ background: idx % 2 === 0 ? '#f9fafb' : 'white' }}>
                              <td colSpan="4" style={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
                                {editingDialogue === sprite.id ? (
                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                      type="text"
                                      defaultValue={sprite.customDialogue || sprites[sprite.spriteIndex].dialogues[0]}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          updateDialogue(sprite.id, e.target.value);
                                        } else if (e.key === 'Escape') {
                                          setEditingDialogue(null);
                                        }
                                      }}
                                      style={{
                                        flex: 1,
                                        fontSize: '0.75rem',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.25rem',
                                        outline: 'none'
                                      }}
                                      autoFocus
                                      onBlur={(e) => updateDialogue(sprite.id, e.target.value)}
                                    />
                                    <button
                                      onClick={() => setEditingDialogue(null)}
                                      style={{
                                        padding: '0 0.5rem',
                                        background: '#d1d5db',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.75rem',
                                        border: 'none',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <div 
                                      onClick={() => setEditingDialogue(sprite.id)}
                                      style={{
                                        flex: 1,
                                        fontSize: '0.75rem',
                                        color: '#4b5563',
                                        fontStyle: 'italic',
                                        background: '#f3f4f6',
                                        padding: '0.5rem',
                                        borderRadius: '0.25rem',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      💬 "{sprite.customDialogue || sprites[sprite.spriteIndex].dialogues[0]}"
                                    </div>
                                    <button
                                      onClick={() => randomizeDialogue(sprite)}
                                      style={{
                                        padding: '0.25rem 0.5rem',
                                        background: '#a855f7',
                                        color: 'white',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        cursor: 'pointer'
                                      }}
                                      title="Randomize dialogue"
                                    >
                                      🎲
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <h3 style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#374151' }}>Export / Import</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={exportCSV}
                    disabled={placedSprites[currentAct].length === 0}
                    style={{
                      width: '100%',
                      background: placedSprites[currentAct].length === 0 ? '#d1d5db' : '#3b82f6',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      border: 'none',
                      cursor: placedSprites[currentAct].length === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    📊 Export Act {currentAct} CSV
                  </button>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={importCSV}
                      style={{ display: 'none' }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: '100%',
                        background: '#a855f7',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      📂 Import to Act {currentAct}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <h3 style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#374151' }}>Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
                  {sprites.map((sprite, idx) => {
                    const count = placedSprites[currentAct].filter(s => s.spriteIndex === idx).length;
                    if (count === 0) return null;
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div
                            style={{
                              width: '1rem',
                              height: '1rem',
                              borderRadius: '0.25rem',
                              border: '1px solid #e5e7eb',
                              backgroundColor: sprite.color
                            }}
                          />
                          <span style={{ color: '#374151' }}>{sprite.name}</span>
                        </div>
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TownBuilder;