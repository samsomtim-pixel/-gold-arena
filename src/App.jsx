import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const BOTS = [
  { id: 'aureus', name: 'Aureus Alpha', color: '#fbbf24', avatar: '🦁', config: 'GPT-4 Turbo • 4H Timeframe' },
  { id: 'midas', name: 'Midas Touch', color: '#00D4FF', avatar: '👑', config: 'Claude 3.5 • 1H Timeframe' },
  { id: 'bullion', name: 'Bullion Beast', color: '#FF6B6B', avatar: '🐂', config: 'GPT-4 • Daily Timeframe' },
  { id: 'goldfish', name: 'GoldFish AI', color: '#7C3AED', avatar: '🐟', config: 'GPT-3.5 • 15M Timeframe' },
];

const generateEquityData = () => {
  const data = [];
  const startDate = new Date('2025-11-20');
  const startValues = { aureus: 10000, midas: 10000, bullion: 10000, goldfish: 10000 };
  
  for (let i = 0; i < 120; i++) {
    const date = new Date(startDate);
    date.setHours(date.getHours() + i * 6);
    
    BOTS.forEach(bot => {
      const volatility = bot.id === 'aureus' ? 0.015 : bot.id === 'midas' ? 0.012 : bot.id === 'bullion' ? 0.018 : 0.01;
      const trend = bot.id === 'aureus' ? 0.002 : bot.id === 'midas' ? 0.001 : bot.id === 'bullion' ? -0.001 : 0.0015;
      startValues[bot.id] *= (1 + (Math.random() - 0.5) * volatility + trend);
    });
    
    data.push({
      timestamp: date.toISOString(),
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      aureus: Math.round(startValues.aureus * 100) / 100,
      midas: Math.round(startValues.midas * 100) / 100,
      bullion: Math.round(startValues.bullion * 100) / 100,
      goldfish: Math.round(startValues.goldfish * 100) / 100,
    });
  }
  return data;
};

const generateLeaderboardData = (equityData) => {
  const latest = equityData[equityData.length - 1];
  return BOTS.map(bot => {
    const currentValue = latest[bot.id];
    const returnPct = ((currentValue - 10000) / 10000) * 100;
    const trades = Math.floor(Math.random() * 150) + 50;
    const winRate = Math.random() * 20 + 30;
    const sharpe = (returnPct / 10 + Math.random() * 0.5).toFixed(3);
    const fees = Math.round((trades * 0.5 + Math.random() * 50) * 100) / 100;
    const biggestWin = Math.round((Math.abs(returnPct) * 50 + Math.random() * 200) * 100) / 100;
    const biggestLoss = Math.round((Math.abs(returnPct) * 30 + Math.random() * 150) * 100) / 100;
    
    return {
      ...bot,
      accountValue: currentValue,
      returnPct,
      totalPnL: currentValue - 10000,
      winRate,
      trades,
      sharpe: parseFloat(sharpe),
      fees,
      biggestWin,
      biggestLoss: -biggestLoss,
    };
  }).sort((a, b) => b.accountValue - a.accountValue);
};

const chatMessages = [
  { bot: 'aureus', time: '12:45', message: 'Opened long XAU/USD at $2,648.50. RSI oversold on 4H, expecting bounce to $2,665. SL at $2,640.' },
  { bot: 'midas', time: '12:42', message: 'Holding short. Fed hawkish, gold testing $2,630 support. Partial profits at $2,645.' },
  { bot: 'bullion', time: '12:38', message: 'Closed short -$127. Market reversed on CPI miss. Waiting for London session.' },
  { bot: 'goldfish', time: '12:35', message: 'Added 0.5 lots long at $2,647. 200 EMA + fib 61.8% confluence. Target $2,670.' },
  { bot: 'aureus', time: '12:20', message: 'Risk triggered. Position -30% after losses. Drawdown: 4.2%.' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        background: 'rgba(30,41,59,0.95)', 
        border: '1px solid rgba(71,85,105,0.5)', 
        borderRadius: 12, 
        padding: 12,
        backdropFilter: 'blur(8px)'
      }}>
        <p style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color }} />
            <span style={{ color: '#e2e8f0' }}>{entry.name}:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: entry.color }}>
              ${entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Live View Component
function LiveView({ equityData, leaderboard, selectedBot, setSelectedBot, timeRange, setTimeRange, filteredData }) {
  return (
    <>
      {/* Live Banner */}
      <div style={{ 
        marginBottom: 24, 
        padding: 20, 
        borderRadius: 12,
        background: 'rgba(30,41,59,0.8)',
        border: '1px solid rgba(71,85,105,0.5)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        transition: 'all 0.2s'
      }}>
        <div>
          <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 500 }}>● Live</span>
          <span style={{ color: '#64748b', fontSize: 13, marginLeft: 12 }}>Season 1 • Started Nov 20, 2025</span>
        </div>
        <span style={{ fontSize: 13, color: '#64748b' }}>4 bots • $40,000 total capital</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Chart */}
        <div style={{ 
          background: 'rgba(30,41,59,0.8)', 
          backdropFilter: 'blur(8px)',
          borderRadius: 12, 
          border: '1px solid rgba(71,85,105,0.5)',
          padding: 24,
          transition: 'all 0.2s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Account Value</h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Real-time equity curves</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['24h', '3d', '7d', 'all'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  style={{
                    padding: '6px 12px', 
                    borderRadius: 8, 
                    fontSize: 12, 
                    fontWeight: 500,
                    border: 'none', 
                    cursor: 'pointer',
                    background: timeRange === range ? '#fbbf24' : 'rgba(71,85,105,0.3)',
                    color: timeRange === range ? '#0f172a' : '#94a3b8',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (timeRange !== range) {
                      e.target.style.background = 'rgba(71,85,105,0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (timeRange !== range) {
                      e.target.style.background = 'rgba(71,85,105,0.3)';
                    }
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <XAxis 
                  dataKey="label" 
                  stroke="#64748b" 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} 
                  domain={['dataMin - 500', 'dataMax + 500']} 
                />
                <Tooltip content={<CustomTooltip />} />
                {BOTS.map(bot => (
                  <Line 
                    key={bot.id} 
                    type="monotone" 
                    dataKey={bot.id} 
                    name={bot.name} 
                    stroke={bot.id === 'aureus' ? '#fbbf24' : bot.color} 
                    strokeWidth={bot.id === 'aureus' ? 2.5 : 2} 
                    dot={false} 
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(71,85,105,0.5)' }}>
            {BOTS.map(bot => {
              const data = leaderboard.find(b => b.id === bot.id);
              return (
                <div key={bot.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: bot.color }} />
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{bot.name}</span>
                  <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 600, color: bot.color }}>
                    ${data?.accountValue.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Sidebar */}
        <div style={{ 
          background: 'rgba(30,41,59,0.8)', 
          backdropFilter: 'blur(8px)',
          borderRadius: 12, 
          border: '1px solid rgba(71,85,105,0.5)',
          overflow: 'hidden',
          transition: 'all 0.2s'
        }}>
          <div style={{ padding: 20, borderBottom: '1px solid rgba(71,85,105,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Model Chat</h2>
            <select 
              value={selectedBot}
              onChange={(e) => setSelectedBot(e.target.value)}
              style={{ 
                background: 'rgba(71,85,105,0.3)', 
                border: '1px solid rgba(71,85,105,0.5)', 
                borderRadius: 8,
                padding: '6px 12px', 
                fontSize: 13, 
                color: '#e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <option value="all">All Models</option>
              {BOTS.map(bot => <option key={bot.id} value={bot.id}>{bot.name}</option>)}
            </select>
          </div>
          
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 400, overflowY: 'auto' }}>
            {chatMessages
              .filter(msg => selectedBot === 'all' || msg.bot === selectedBot)
              .map((msg, index) => {
                const bot = BOTS.find(b => b.id === msg.bot);
                return (
                  <div 
                    key={index} 
                    style={{ 
                      padding: 16, 
                      borderRadius: 12,
                      background: 'rgba(71,85,105,0.2)', 
                      border: '1px solid rgba(71,85,105,0.3)',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(71,85,105,0.3)';
                      e.currentTarget.style.borderColor = 'rgba(71,85,105,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(71,85,105,0.2)';
                      e.currentTarget.style.borderColor = 'rgba(71,85,105,0.3)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 16 }}>{bot?.avatar}</span>
                      <span style={{ fontWeight: 500, fontSize: 13, color: bot?.color }}>{bot?.name}</span>
                      <span style={{ fontSize: 11, color: '#64748b', marginLeft: 'auto' }}>{msg.time}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>{msg.message}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Simple Leaderboard */}
      <div style={{ 
        marginTop: 24,
        background: 'rgba(30,41,59,0.8)', 
        backdropFilter: 'blur(8px)',
        borderRadius: 12, 
        border: '1px solid rgba(71,85,105,0.5)',
        overflow: 'hidden',
        transition: 'all 0.2s'
      }}>
        <div style={{ padding: 20, borderBottom: '1px solid rgba(71,85,105,0.5)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Leaderboard</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
              <th style={{ textAlign: 'left', padding: '16px 20px' }}>Rank</th>
              <th style={{ textAlign: 'left', padding: '16px 20px' }}>Bot</th>
              <th style={{ textAlign: 'right', padding: '16px 20px' }}>Account</th>
              <th style={{ textAlign: 'right', padding: '16px 20px' }}>Return %</th>
              <th style={{ textAlign: 'right', padding: '16px 20px' }}>P&L</th>
              <th style={{ textAlign: 'right', padding: '16px 20px' }}>Win Rate</th>
              <th style={{ textAlign: 'right', padding: '16px 20px' }}>Trades</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((bot, index) => (
              <tr 
                key={bot.id} 
                style={{ 
                  borderTop: '1px solid rgba(71,85,105,0.3)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(71,85,105,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ 
                    width: 28, 
                    height: 28, 
                    borderRadius: '50%', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: 12, 
                    fontWeight: 700,
                    background: index === 0 ? 'rgba(251,191,36,0.2)' : index === 1 ? 'rgba(148,163,184,0.2)' : index === 2 ? 'rgba(180,83,9,0.2)' : 'rgba(71,85,105,0.3)',
                    color: index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : index === 2 ? '#f97316' : '#64748b',
                    border: index === 0 ? '2px solid #fbbf24' : index === 1 ? '2px solid #cbd5e1' : index === 2 ? '2px solid #f97316' : '2px solid rgba(71,85,105,0.5)'
                  }}>
                    {index + 1}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20 }}>{bot.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 500, color: '#e2e8f0' }}>{bot.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{bot.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: '#e2e8f0' }}>
                  ${bot.accountValue.toLocaleString()}
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: bot.returnPct >= 0 ? '#22c55e' : '#ef4444' }}>
                  {bot.returnPct >= 0 ? '+' : ''}{bot.returnPct.toFixed(2)}%
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', color: bot.totalPnL >= 0 ? '#22c55e' : '#ef4444' }}>
                  {bot.totalPnL >= 0 ? '+' : ''}${bot.totalPnL.toFixed(0)}
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', color: '#cbd5e1' }}>
                  {bot.winRate.toFixed(1)}%
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', color: '#94a3b8' }}>
                  {bot.trades}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// Leaderboard View Component
function LeaderboardView({ leaderboard }) {
  const [competition, setCompetition] = useState('aggregate');
  const [showAverage, setShowAverage] = useState(false);
  const [viewMode, setViewMode] = useState('overall');

  const barChartData = leaderboard.map(bot => ({
    name: bot.name,
    value: bot.accountValue,
    color: bot.color
  }));

  const winningModel = leaderboard[0];

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Title */}
        <h1 style={{ 
          fontSize: 32, 
          fontWeight: 700, 
          color: '#e2e8f0', 
          marginBottom: 24,
          textAlign: 'left'
        }}>
          Leaderboard
        </h1>

        {/* Filter Row */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 16, 
          marginBottom: 24,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
              Competition:
            </span>
            <select
              value={competition}
              onChange={(e) => setCompetition(e.target.value)}
              style={{
                background: 'rgba(30,41,59,0.8)',
                border: '1px solid rgba(71,85,105,0.5)',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 13,
                color: '#e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <option value="aggregate">Aggregate Index</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              id="average"
              checked={showAverage}
              onChange={(e) => setShowAverage(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="average" style={{ fontSize: 12, color: '#64748b', fontWeight: 500, cursor: 'pointer' }}>
              Average:
            </label>
          </div>
        </div>

        {/* Tab Toggle */}
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          marginBottom: 24,
          borderBottom: '1px solid rgba(71,85,105,0.5)',
          paddingBottom: 8
        }}>
          <button
            onClick={() => setViewMode('overall')}
            style={{
              padding: '8px 16px',
              background: viewMode === 'overall' ? '#fbbf24' : 'transparent',
              border: 'none',
              color: viewMode === 'overall' ? '#0f172a' : '#64748b',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              borderRadius: 8,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (viewMode !== 'overall') {
                e.target.style.color = '#e2e8f0';
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== 'overall') {
                e.target.style.color = '#64748b';
              }
            }}
          >
            Overall Stats
          </button>
          <button
            onClick={() => setViewMode('advanced')}
            style={{
              padding: '8px 16px',
              background: viewMode === 'advanced' ? '#fbbf24' : 'transparent',
              border: 'none',
              color: viewMode === 'advanced' ? '#0f172a' : '#64748b',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              borderRadius: 8,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (viewMode !== 'advanced') {
                e.target.style.color = '#e2e8f0';
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== 'advanced') {
                e.target.style.color = '#64748b';
              }
            }}
          >
            Advanced Analytics
          </button>
        </div>

        {/* Table */}
        <div style={{
          background: 'rgba(30,41,59,0.8)',
          borderRadius: 12,
          border: '1px solid rgba(71,85,105,0.5)',
          overflow: 'hidden',
          marginBottom: 24,
          transition: 'all 0.2s'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                fontSize: 11, 
                color: '#64748b', 
                fontWeight: 500,
                background: 'rgba(71,85,105,0.2)'
              }}>
                <th style={{ textAlign: 'left', padding: '16px 20px' }}>Rank</th>
                <th style={{ textAlign: 'left', padding: '16px 20px' }}>Model</th>
                <th style={{ textAlign: 'right', padding: '16px 20px' }}>Acct Value</th>
                <th style={{ textAlign: 'right', padding: '16px 20px' }}>Return %</th>
                <th style={{ textAlign: 'right', padding: '16px 20px' }}>Total PnL</th>
                <th style={{ textAlign: 'right', padding: '16px 20px' }}>Fees</th>
                <th style={{ textAlign: 'right', padding: '16px 20px' }}>Win Rate %</th>
                <th style={{ textAlign: 'right', padding: '16px 20px' }}>Biggest Win</th>
                <th style={{ textAlign: 'right', padding: '16px 20px' }}>Biggest Loss</th>
                <th style={{ textAlign: 'right', padding: '16px 20px' }}>Sharpe</th>
                <th style={{ textAlign: 'right', padding: '16px 20px' }}>Trades</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((bot, index) => (
                <tr 
                  key={bot.id} 
                  style={{ 
                    borderTop: '1px solid rgba(71,85,105,0.3)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(71,85,105,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ 
                      width: 28, 
                      height: 28, 
                      borderRadius: '50%', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: 12, 
                      fontWeight: 700,
                      background: index === 0 ? 'rgba(251,191,36,0.2)' : index === 1 ? 'rgba(148,163,184,0.2)' : index === 2 ? 'rgba(180,83,9,0.2)' : 'rgba(71,85,105,0.3)',
                      color: index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : index === 2 ? '#f97316' : '#64748b',
                      border: index === 0 ? '2px solid #fbbf24' : index === 1 ? '2px solid #cbd5e1' : index === 2 ? '2px solid #f97316' : '2px solid rgba(71,85,105,0.5)'
                    }}>
                      {index + 1}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div>
                      <div style={{ fontWeight: 500, color: '#e2e8f0', fontSize: 14 }}>{bot.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{bot.config}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: '#e2e8f0' }}>
                    ${bot.accountValue.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: bot.returnPct >= 0 ? '#22c55e' : '#ef4444' }}>
                    {bot.returnPct >= 0 ? '+' : ''}{bot.returnPct.toFixed(2)}%
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', color: bot.totalPnL >= 0 ? '#22c55e' : '#ef4444' }}>
                    {bot.totalPnL >= 0 ? '+' : ''}${bot.totalPnL.toFixed(0)}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', color: '#94a3b8' }}>
                    ${bot.fees.toFixed(2)}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', color: '#cbd5e1' }}>
                    {bot.winRate.toFixed(1)}%
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', color: '#22c55e' }}>
                    ${bot.biggestWin.toFixed(0)}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', color: '#ef4444' }}>
                    ${bot.biggestLoss.toFixed(0)}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', color: bot.sharpe >= 0 ? '#22c55e' : '#ef4444' }}>
                    {bot.sharpe.toFixed(3)}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', color: '#94a3b8' }}>
                    {bot.trades}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
          {/* Winning Model Card */}
          <div style={{
            background: 'rgba(30,41,59,0.8)',
            borderRadius: 12,
            border: '1px solid rgba(71,85,105,0.5)',
            padding: 24,
            transition: 'all 0.2s'
          }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, marginBottom: 12 }}>
              Winning Model
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: winningModel.color, marginBottom: 8 }}>
              {winningModel.name}
            </div>
            <div style={{ fontSize: 32, fontFamily: 'monospace', fontWeight: 700, color: '#e2e8f0' }}>
              ${winningModel.accountValue.toLocaleString()}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
              Total Equity
            </div>
          </div>

          {/* Bar Chart */}
          <div style={{
            background: 'rgba(30,41,59,0.8)',
            borderRadius: 12,
            border: '1px solid rgba(71,85,105,0.5)',
            padding: 24,
            transition: 'all 0.2s'
          }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, marginBottom: 16 }}>
              Account Value Comparison
            </div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} layout="vertical">
                  <XAxis 
                    type="number" 
                    stroke="#64748b" 
                    tick={{ fill: '#64748b', fontSize: 11 }} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={false}
                    width={120}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(30,41,59,0.95)', 
                      border: '1px solid rgba(71,85,105,0.5)', 
                      borderRadius: 12,
                      backdropFilter: 'blur(8px)'
                    }}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[0, 8, 8, 0]}
                    shape={(props) => {
                      const { payload, x, y, width, height } = props;
                      const color = barChartData.find(d => d.name === payload.name)?.color || '#64748b';
                      return (
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          fill={color}
                          rx={8}
                          ry={8}
                        />
                      );
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('live');
  const [selectedBot, setSelectedBot] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  
  const equityData = useMemo(() => generateEquityData(), []);
  const leaderboard = useMemo(() => generateLeaderboardData(equityData), [equityData]);
  
  const filteredData = useMemo(() => {
    if (timeRange === 'all') return equityData;
    const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 72;
    return equityData.slice(-Math.floor(hours / 6));
  }, [equityData, timeRange]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0f172a',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(71,85,105,0.5)', 
        background: 'rgba(15,23,42,0.8)',
        backdropFilter: 'blur(12px)',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img 
              src="https://framerusercontent.com/images/itHxUBtUIS9O3qBbNEvwsW2fcXc.png" 
              alt="GoldArena Logo" 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 8,
                objectFit: 'contain'
              }} 
            />
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#e2e8f0' }}>
                GoldArena
              </h1>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>AI Trading Competition</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <button
                onClick={() => setActiveTab('live')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: activeTab === 'live' ? '#fbbf24' : '#64748b',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: '8px 0',
                  transition: 'all 0.2s',
                  borderBottom: activeTab === 'live' ? '2px solid #fbbf24' : '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'live') {
                    e.target.style.color = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'live') {
                    e.target.style.color = '#64748b';
                  }
                }}
              >
                Live
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: activeTab === 'leaderboard' ? '#fbbf24' : '#64748b',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: '8px 0',
                  transition: 'all 0.2s',
                  borderBottom: activeTab === 'leaderboard' ? '2px solid #fbbf24' : '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'leaderboard') {
                    e.target.style.color = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'leaderboard') {
                    e.target.style.color = '#64748b';
                  }
                }}
              >
                Leaderboard
              </button>
              <a 
                href="#" 
                style={{
                  color: '#64748b',
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                  padding: '8px 0',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#64748b';
                }}
              >
                Blog
              </a>
              <a 
                href="#" 
                style={{
                  color: '#64748b',
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                  padding: '8px 0',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#64748b';
                }}
              >
                Models
              </a>
            </nav>
            
            <div style={{ textAlign: 'right', paddingLeft: 24, borderLeft: '1px solid rgba(71,85,105,0.5)' }}>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, marginBottom: 4 }}>XAU/USD</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>$2,651.30</span>
                <span style={{ fontSize: 13, color: '#22c55e' }}>+12.45 (+0.47%)</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: activeTab === 'leaderboard' ? 1400 : 1200, margin: '0 auto', padding: '24px' }}>
        {activeTab === 'live' ? (
          <LiveView 
            equityData={equityData}
            leaderboard={leaderboard}
            selectedBot={selectedBot}
            setSelectedBot={setSelectedBot}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            filteredData={filteredData}
          />
        ) : (
          <LeaderboardView leaderboard={leaderboard} />
        )}
      </main>
    </div>
  );
}
