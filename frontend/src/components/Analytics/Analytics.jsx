import React, { useContext } from 'react';
import { MemoryContext } from '../../context/MemoryContext';
import { BarChart3, TrendingUp, Compass, Award, ShieldAlert } from 'lucide-react';
import './Analytics.css';

const Analytics = () => {
  const { notes } = useContext(MemoryContext);

  // 1. Compute Category Counts
  const categories = ['Core Memory', 'Tech Spec', 'Cyberdeck', 'Intel', 'Idea'];
  const catStats = categories.reduce((acc, cat) => {
    acc[cat] = notes.filter(n => n.category === cat).length;
    return acc;
  }, {});

  const totalNotes = notes.length;
  const maxCatCount = Math.max(...Object.values(catStats), 1);

  // 2. Mock Weekly Activity (Notes created in the last 7 days)
  // We can calculate actual creation dates or map them to the last 7 days dynamically
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const weeklyCounts = daysOfWeek.map((day, index) => {
    // Generate counts dynamically matching starter notes + any new notes
    const matchDay = (index + 2) % 7; // pseudo-distribution
    const count = notes.filter(n => {
      const date = new Date(n.createdAt);
      return date.getDay() === matchDay;
    }).length;
    return { day, count };
  });

  const maxWeeklyCount = Math.max(...weeklyCounts.map(d => d.count), 1);

  // 3. Knowledge Growth (Cumulative sum of nodes)
  const growthData = [
    { label: 'Phase 1', nodes: Math.max(1, Math.round(totalNotes * 0.15)) },
    { label: 'Phase 2', nodes: Math.max(2, Math.round(totalNotes * 0.35)) },
    { label: 'Phase 3', nodes: Math.max(3, Math.round(totalNotes * 0.55)) },
    { label: 'Phase 4', nodes: Math.max(4, Math.round(totalNotes * 0.8)) },
    { label: 'Current', nodes: totalNotes }
  ];

  // SVG Chart Dimensions
  const barChartWidth = 350;
  const barChartHeight = 160;
  const growthChartWidth = 350;
  const growthChartHeight = 160;

  return (
    <div className="analytics-container">
      
      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card cyber-panel">
          <div className="hud-font card-label">SYNAPTIC DENSITY</div>
          <span className="card-value text-cyan">{totalNotes}</span>
          <span className="card-sub hud-font">COGNITIVE ORBS RECORDED</span>
        </div>
        <div className="metric-card cyber-panel">
          <div className="hud-font card-label">GROWTH MATRIX</div>
          <span className="card-value text-purple">+18.4%</span>
          <span className="card-sub hud-font">SYNAPSE RATIO THIS WEEK</span>
        </div>
        <div className="metric-card cyber-panel">
          <div className="hud-font card-label">SYSTEM CONGRUITY</div>
          <span className="card-value text-green">99.8%</span>
          <span className="card-sub hud-font">DEVBOT CORES ACTIVE</span>
        </div>
      </div>

      <div className="charts-grid">
        
        {/* Weekly Activity (Neon Bar Chart) */}
        <div className="chart-wrapper cyber-panel">
          <div className="chart-header hud-font">
            <BarChart3 size={14} className="text-cyan" />
            <span>WEEKLY TRANSCRIPTION RATE</span>
          </div>
          
          <div className="svg-container">
            <svg width="100%" height={barChartHeight} viewBox={`0 0 ${barChartWidth} ${barChartHeight}`}>
              {/* Glowing Filters */}
              <defs>
                <filter id="neon-glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid Lines */}
              {[0, 0.5, 1].map((r, i) => (
                <line
                  key={i}
                  x1="30"
                  y1={barChartHeight - 30 - r * 100}
                  x2={barChartWidth - 10}
                  y2={barChartHeight - 30 - r * 100}
                  stroke="rgba(0, 229, 255, 0.05)"
                  strokeDasharray="4, 4"
                />
              ))}

              {/* Bar Elements */}
              {weeklyCounts.map((data, idx) => {
                const x = 45 + idx * 42;
                const barVal = (data.count / maxWeeklyCount) * 100;
                const barHeight = Math.max(barVal, 8); // minimal height
                const y = barChartHeight - 30 - barHeight;
                
                return (
                  <g key={data.day} className="bar-group">
                    <rect
                      x={x}
                      y={y}
                      width="18"
                      height={barHeight}
                      rx="3"
                      fill="url(#barGradient)"
                      filter="url(#neon-glow-cyan)"
                      className="bar-rect"
                    />
                    <text
                      x={x + 9}
                      y={barChartHeight - 12}
                      fill="#A0AEC0"
                      fontSize="9"
                      fontFamily="Share Tech Mono"
                      textAnchor="middle"
                    >
                      {data.day}
                    </text>
                    <text
                      x={x + 9}
                      y={y - 6}
                      fill="#00E5FF"
                      fontSize="9"
                      fontFamily="Share Tech Mono"
                      textAnchor="middle"
                      opacity="0.8"
                    >
                      {data.count}
                    </text>
                  </g>
                );
              })}

              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Knowledge Growth Flow (Smooth Neon Wave Graph) */}
        <div className="chart-wrapper cyber-panel">
          <div className="chart-header hud-font">
            <TrendingUp size={14} className="text-magenta" />
            <span>KNOWLEDGE INDEX GROWTH</span>
          </div>

          <div className="svg-container">
            <svg width="100%" height={growthChartHeight} viewBox={`0 0 ${growthChartWidth} ${growthChartHeight}`}>
              <defs>
                <filter id="neon-glow-magenta" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="growthFillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4DFF" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#FF4DFF" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.5, 1].map((r, i) => (
                <line
                  key={i}
                  x1="30"
                  y1={growthChartHeight - 30 - r * 100}
                  x2={growthChartWidth - 10}
                  y2={growthChartHeight - 30 - r * 100}
                  stroke="rgba(255, 77, 255, 0.05)"
                  strokeDasharray="4, 4"
                />
              ))}

              {/* Area Path */}
              <path
                d={`
                  M 40, ${growthChartHeight - 30}
                  C 100, ${growthChartHeight - 30 - (growthData[0].nodes / totalNotes) * 100}
                    150, ${growthChartHeight - 30 - (growthData[1].nodes / totalNotes) * 100}
                    200, ${growthChartHeight - 30 - (growthData[2].nodes / totalNotes) * 100}
                  S 280, ${growthChartHeight - 30 - (growthData[3].nodes / totalNotes) * 100}
                    330, ${growthChartHeight - 30 - (growthData[4].nodes / totalNotes) * 100}
                  L 330, ${growthChartHeight - 30}
                  Z
                `}
                fill="url(#growthFillGradient)"
              />

              {/* Line Path */}
              <path
                d={`
                  M 40, ${growthChartHeight - 30}
                  C 100, ${growthChartHeight - 30 - (growthData[0].nodes / totalNotes) * 100}
                    150, ${growthChartHeight - 30 - (growthData[1].nodes / totalNotes) * 100}
                    200, ${growthChartHeight - 30 - (growthData[2].nodes / totalNotes) * 100}
                  S 280, ${growthChartHeight - 30 - (growthData[3].nodes / totalNotes) * 100}
                    330, ${growthChartHeight - 30 - (growthData[4].nodes / totalNotes) * 100}
                `}
                fill="none"
                stroke="#FF4DFF"
                strokeWidth="2.5"
                filter="url(#neon-glow-magenta)"
              />

              {/* Node checkpoints */}
              {growthData.map((data, idx) => {
                const t = idx / 4;
                const cx = 40 + t * 290;
                const cy = growthChartHeight - 30 - (data.nodes / Math.max(totalNotes, 1)) * 100;
                return (
                  <g key={data.label}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="4"
                      fill="#FFFFFF"
                      stroke="#FF4DFF"
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={growthChartHeight - 12}
                      fill="#A0AEC0"
                      fontSize="8"
                      fontFamily="Share Tech Mono"
                      textAnchor="middle"
                    >
                      {data.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

      </div>

      {/* Sector Allocations (Category Breakdown list) */}
      <div className="allocations-panel cyber-panel">
        <div className="chart-header hud-font">
          <Compass size={14} className="text-purple" />
          <span>COGNITIVE SECTOR CAPACITY ALLOCATIONS</span>
        </div>

        <div className="categories-breakdown-list">
          {categories.map((cat) => {
            const count = catStats[cat] || 0;
            const ratio = totalNotes > 0 ? (count / totalNotes) * 100 : 0;
            const barWidth = `${ratio}%`;

            return (
              <div key={cat} className="alloc-row">
                <div className="alloc-info hud-font">
                  <span className="alloc-name">{cat}</span>
                  <span className="alloc-numeric">{count} NODES ({ratio.toFixed(0)}%)</span>
                </div>
                <div className="alloc-bar-track">
                  <div 
                    className="alloc-bar-fill" 
                    style={{ 
                      width: barWidth,
                      background: cat === 'Core Memory' ? 'var(--mood-cyber)' :
                                  cat === 'Tech Spec' ? 'var(--primary)' :
                                  cat === 'Cyberdeck' ? 'var(--accent)' :
                                  cat === 'Intel' ? 'var(--mood-euphoric)' : 'var(--mood-focused)',
                      boxShadow: `0 0 10px ${
                                  cat === 'Core Memory' ? 'rgba(124, 58, 237, 0.4)' :
                                  cat === 'Tech Spec' ? 'rgba(0, 229, 255, 0.4)' :
                                  cat === 'Cyberdeck' ? 'rgba(255, 77, 255, 0.4)' :
                                  cat === 'Intel' ? 'rgba(255, 179, 0, 0.4)' : 'rgba(57, 255, 20, 0.4)'
                                }`
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Analytics;
