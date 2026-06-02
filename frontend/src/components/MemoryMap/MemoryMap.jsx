import React, { useContext, useRef, useEffect, useState } from 'react';
import { MemoryContext } from '../../context/MemoryContext';
import { Network, Activity, Info, X } from 'lucide-react';
import './MemoryMap.css';

const MemoryMap = () => {
  const { notes, setSelectedNote } = useContext(MemoryContext);
  const canvasRef = useRef(null);
  const [hoveredNote, setHoveredNote] = useState(null);
  const [clickedNoteForModal, setClickedNoteForModal] = useState(null);

  // Maintain physics nodes
  const nodesRef = useRef([]);
  const draggedNodeIndexRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Map mood values to CSS/Hex colors
  const getColorForMood = (mood) => {
    switch (mood.toLowerCase()) {
      case 'calm': return '#00E5FF';
      case 'energetic': return '#FF4DFF';
      case 'euphoric': return '#FFB300';
      case 'cyber': return '#7C3AED';
      case 'focused': return '#39FF14';
      default: return '#FFFFFF';
    }
  };

  useEffect(() => {
    // Initialize nodes
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight || 500;
    canvas.width = width;
    canvas.height = height;

    // Build node elements
    nodesRef.current = notes.map((note, index) => {
      // Check if node already exists to keep position, else randomize
      const existing = nodesRef.current.find(n => n.id === note.id);
      if (existing) {
        existing.note = note; // update note info
        return existing;
      }

      // Orbital spacing
      const angle = (index / notes.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.3;
      return {
        id: note.id,
        note: note,
        x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
        y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 50,
        vx: 0,
        vy: 0,
        radius: 18 + Math.min(note.content.length / 30, 10), // size by content weight
        color: getColorForMood(note.mood),
        label: note.title
      };
    });
  }, [notes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight || 500;
    };
    window.addEventListener('resize', handleResize);

    // Physics Loop
    const updatePhysicsAndDraw = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw neural mesh grid dots in background
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const nodes = nodesRef.current;

      // 2. Physics calculations: Force-directed
      const k = 0.08; // spring constant
      const gravity = 0.015; // pull to center
      const repulsion = 400; // push apart

      // Center force attraction
      nodes.forEach((node, i) => {
        if (i === draggedNodeIndexRef.current) return;
        
        node.vx += (width / 2 - node.x) * gravity;
        node.vy += (height / 2 - node.y) * gravity;

        // Repel from other nodes
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          let dist = Math.hypot(dx, dy);
          if (dist === 0) dist = 0.1;

          if (dist < 220) {
            const force = repulsion / (dist * dist);
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }
        }
      });

      // Attract connected nodes (sharing tags or category)
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          
          // Connection strength based on shared categories and tags
          let sharesConnection = false;
          let strength = 0;

          if (nodeA.note.category === nodeB.note.category) {
            sharesConnection = true;
            strength += 0.35;
          }

          // Check common tags
          const commonTags = nodeA.note.tags.filter(t => nodeB.note.tags.includes(t));
          if (commonTags.length > 0) {
            sharesConnection = true;
            strength += commonTags.length * 0.55;
          }

          if (sharesConnection) {
            const dx = nodeB.x - nodeA.x;
            const dy = nodeB.y - nodeA.y;
            const dist = Math.hypot(dx, dy);
            
            // Draw connection cord
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            
            const isHighlighted = (hoveredNote && (hoveredNote.id === nodeA.id || hoveredNote.id === nodeB.id));
            
            ctx.strokeStyle = isHighlighted
              ? 'rgba(0, 229, 255, 0.45)'
              : 'rgba(124, 58, 237, 0.1)';
            
            ctx.lineWidth = isHighlighted ? 2.5 : 1;
            ctx.stroke();

            // Apply spring pull
            if (i !== draggedNodeIndexRef.current) {
              nodeA.vx += (dx / dist) * (dist - 140) * k * strength;
              nodeA.vy += (dy / dist) * (dist - 140) * k * strength;
            }
            if (j !== draggedNodeIndexRef.current) {
              nodeB.vx -= (dx / dist) * (dist - 140) * k * strength;
              nodeB.vy -= (dy / dist) * (dist - 140) * k * strength;
            }
          }
        }
      }

      // Update positions and handle boundary collision
      nodes.forEach((node, i) => {
        if (i === draggedNodeIndexRef.current) {
          // Smooth drag follow
          node.x += (mouseRef.current.x - node.x) * 0.3;
          node.y += (mouseRef.current.y - node.y) * 0.3;
          node.vx = 0;
          node.vy = 0;
        } else {
          // Friction damping
          node.vx *= 0.82;
          node.vy *= 0.82;

          node.x += node.vx;
          node.y += node.vy;

          // Boundary limits
          const pad = node.radius + 15;
          if (node.x < pad) { node.x = pad; node.vx *= -0.5; }
          if (node.x > width - pad) { node.x = width - pad; node.vx *= -0.5; }
          if (node.y < pad) { node.y = pad; node.vy *= -0.5; }
          if (node.y > height - pad) { node.y = height - pad; node.vy *= -0.5; }
        }

        // Draw node orbital rings
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${hexToRgb(node.color)}, 0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw inner core orb
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.shadowColor = node.color;
        ctx.shadowBlur = (hoveredNote && hoveredNote.id === node.id) ? 22 : 10;
        ctx.fillStyle = `rgba(${hexToRgb(node.color)}, 0.35)`;
        ctx.fill();
        
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // Draw note tag counts inside or node indicator
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 9px Share Tech Mono';
        ctx.textAlign = 'center';
        ctx.fillText(node.note.category.substring(0, 4).toUpperCase(), node.x, node.y + 3);

        // Draw node title
        const isHovered = hoveredNote && hoveredNote.id === node.id;
        ctx.fillStyle = isHovered ? '#00E5FF' : '#A0AEC0';
        ctx.font = isHovered ? 'bold 11px Orbitron' : '9px Orbitron';
        ctx.fillText(
          node.label.length > 18 ? `${node.label.substring(0, 16)}..` : node.label,
          node.x,
          node.y - node.radius - 12
        );
      });

      animationId = requestAnimationFrame(updatePhysicsAndDraw);
    };

    updatePhysicsAndDraw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [hoveredNote]);

  // Utility to convert hex strings to RGB parts
  const hexToRgb = (hex) => {
    let c = hex.substring(1);
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  };

  // Drag & Hover Mouse Interactions
  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    const mouse = getMousePos(e);
    const nodes = nodesRef.current;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const dist = Math.hypot(mouse.x - node.x, mouse.y - node.y);
      if (dist < node.radius + 10) {
        draggedNodeIndexRef.current = i;
        mouseRef.current = mouse;
        break;
      }
    }
  };

  const handleMouseMove = (e) => {
    const mouse = getMousePos(e);
    mouseRef.current = mouse;
    const nodes = nodesRef.current;

    if (draggedNodeIndexRef.current !== null) {
      return; // currently dragging
    }

    // Hover detection
    let foundHover = null;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const dist = Math.hypot(mouse.x - node.x, mouse.y - node.y);
      if (dist < node.radius + 12) {
        foundHover = node;
        break;
      }
    }
    setHoveredNote(foundHover);
  };

  const handleMouseUp = (e) => {
    if (draggedNodeIndexRef.current !== null) {
      const node = nodesRef.current[draggedNodeIndexRef.current];
      const mouse = getMousePos(e);
      const dist = Math.hypot(mouse.x - node.x, mouse.y - node.y);
      
      // If click (did not drag far), open detail modal
      if (dist < 8) {
        setClickedNoteForModal(node.note);
        setSelectedNote(node.note);
      }
    }
    draggedNodeIndexRef.current = null;
  };

  return (
    <div className="memory-map-container cyber-panel">
      <div className="map-header hud-font">
        <div className="header-title">
          <Network className="net-icon text-cyan" size={16} />
          <span>NEURAL SYNAPSE CONNECTOME</span>
        </div>
        <div className="header-meta">
          <Activity className="text-magenta pulse-glow" size={12} />
          <span>MESH DYNAMICS ACTIVE</span>
        </div>
      </div>

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="map-canvas"
        />

        {/* Hover Information Tooltip Overlay */}
        {hoveredNote && (
          <div 
            className="map-tooltip cyber-panel"
            style={{
              left: `${Math.min(hoveredNote.x + 20, canvasRef.current.width - 240)}px`,
              top: `${Math.min(hoveredNote.y - 40, canvasRef.current.height - 180)}px`,
              borderLeftColor: hoveredNote.color
            }}
          >
            <div className="tooltip-header hud-font">
              <span className="tooltip-cat">{hoveredNote.note.category}</span>
              <span className="tooltip-mood" style={{ color: hoveredNote.color }}>{hoveredNote.note.mood}</span>
            </div>
            <h4 className="tooltip-title hud-font">{hoveredNote.note.title}</h4>
            <p className="tooltip-preview">
              {hoveredNote.note.content.substring(0, 90)}...
            </p>
            <div className="tooltip-footer">
              {hoveredNote.note.tags.slice(0, 3).map(tag => (
                <span key={tag} className="tooltip-tag">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Action Help Tag */}
        <div className="map-help-hud hud-font">
          <Info size={12} />
          <span>DRAG TO MANIPULATE NEURAL GRAVITY // CLICK NODE TO DECRYPT MEMORY CAPSULE</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryMap;
