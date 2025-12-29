import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const BOTS = [
  { id: 'aureus', name: 'Aureus Alpha', color: '#FFD700', avatar: '🦁' },
  { id: 'midas', name: 'Midas Touch', color: '#00D4FF', avatar: '👑' },
  { id: 'bullion', name: 'Bullion Beast', color: '#FF6B6B', avatar: '🐂' },
  { id: 'goldfish', name: 'GoldFish AI', color: '#7C3AED', avatar: '🐟' },
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
    
    return {
      ...bot,
      accountValue: currentValue,
      returnPct,
      totalPnL: currentValue - 10000,
      winRate,
      trades,
      sharpe: parseFloat(sharpe),
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
      <div style={{ background: 'rgba(30,41,59,0.95)', border: '1px solid #475569', borderRadius: 8, padding: 12 }}>
        <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 8 }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color }} />
            <span style={{ color: '#cbd5e1' }}>{entry.name}:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: entry.color }}>
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function App() {
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
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #172554 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        borderBottom: '1px solid rgba(71,85,105,0.5)', 
        background: 'rgba(30,41,59,0.5)',
        backdropFilter: 'blur(12px)',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 40, height: 40, borderRadius: 12, 
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 8px 16px rgba(251,191,36,0.2)'
            }}>⚜️</div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                <span style={{ color: '#fbbf24' }}>Gold</span>
                <span style={{ color: '#cbd5e1' }}>Arena</span>
              </h1>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>AI Trading Competition</p>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>XAU/USD</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>$2,651.30</span>
              <span style={{ fontSize: 13, color: '#34d399' }}>+12.45 (+0.47%)</span>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* Live Banner */}
        <div style={{ 
          marginBottom: 24, padding: 16, borderRadius: 12,
          background: 'linear-gradient(90deg, rgba(30,58,138,0.3), rgba(30,41,59,0.3))',
          border: '1px solid rgba(30,64,175,0.3)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <span style={{ color: '#34d399', fontSize: 13, fontWeight: 500 }}>● LIVE</span>
            <span style={{ color: '#64748b', fontSize: 13, marginLeft: 12 }}>Season 1 • Started Nov 20, 2025</span>
          </div>
          <span style={{ fontSize: 13, color: '#64748b' }}>4 bots • $40,000 total capital</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Chart */}
          <div style={{ 
            background: 'rgba(30,41,59,0.5)', 
            backdropFilter: 'blur(8px)',
            borderRadius: 16, 
            border: '1px solid rgba(71,85,105,0.5)',
            padding: 24
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
                      padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                      border: 'none', cursor: 'pointer',
                      background: timeRange === range ? '#2563eb' : '#334155',
                      color: timeRange === range ? 'white' : '#94a3b8'
                    }}
                  >
                    {range.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <XAxis dataKey="label" stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} 
                    tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} domain={['dataMin - 500', 'dataMax + 500']} />
                  <Tooltip content={<CustomTooltip />} />
                  {BOTS.map(bot => (
                    <Line key={bot.id} type="monotone" dataKey={bot.id} name={bot.name} stroke={bot.color} strokeWidth={2} dot={false} />
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
            background: 'rgba(30,41,59,0.5)', 
            backdropFilter: 'blur(8px)',
            borderRadius: 16, 
            border: '1px solid rgba(71,85,105,0.5)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: 16, borderBottom: '1px solid rgba(71,85,105,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Model Chat</h2>
              <select 
                value={selectedBot}
                onChange={(e) => setSelectedBot(e.target.value)}
                style={{ 
                  background: '#334155', border: '1px solid #475569', borderRadius: 8,
                  padding: '6px 12px', fontSize: 13, color: '#cbd5e1'
                }}
              >
                <option value="all">All Models</option>
                {BOTS.map(bot => <option key={bot.id} value={bot.id}>{bot.name}</option>)}
              </select>
            </div>
            
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 400, overflowY: 'auto' }}>
              {chatMessages
                .filter(msg => selectedBot === 'all' || msg.bot === selectedBot)
                .map((msg, index) => {
                  const bot = BOTS.find(b => b.id === msg.bot);
                  return (
                    <div key={index} style={{ 
                      padding: 14, borderRadius: 12,
                      background: 'rgba(51,65,85,0.5)', 
                      border: '1px solid rgba(71,85,105,0.5)'
                    }}>
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

        {/* Leaderboard */}
        <div style={{ 
          marginTop: 24,
          background: 'rgba(30,41,59,0.5)', 
          backdropFilter: 'blur(8px)',
          borderRadius: 16, 
          border: '1px solid rgba(71,85,105,0.5)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: 16, borderBottom: '1px solid rgba(71,85,105,0.5)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Leaderboard</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
                <th style={{ textAlign: 'left', padding: '12px 16px' }}>Rank</th>
                <th style={{ textAlign: 'left', padding: '12px 16px' }}>Bot</th>
                <th style={{ textAlign: 'right', padding: '12px 16px' }}>Account</th>
                <th style={{ textAlign: 'right', padding: '12px 16px' }}>Return %</th>
                <th style={{ textAlign: 'right', padding: '12px 16px' }}>P&L</th>
                <th style={{ textAlign: 'right', padding: '12px 16px' }}>Win Rate</th>
                <th style={{ textAlign: 'right', padding: '12px 16px' }}>Trades</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((bot, index) => (
                <tr key={bot.id} style={{ borderTop: '1px solid rgba(71,85,105,0.3)' }}>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      width: 24, height: 24, borderRadius: '50%', 
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700,
                      background: index === 0 ? 'rgba(251,191,36,0.2)' : index === 1 ? 'rgba(148,163,184,0.2)' : 'rgba(71,85,105,0.5)',
                      color: index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : '#64748b'
                    }}>{index + 1}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 20 }}>{bot.avatar}</span>
                      <div>
                        <div style={{ fontWeight: 500, color: '#e2e8f0' }}>{bot.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{bot.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: '#e2e8f0' }}>
                    ${bot.accountValue.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: bot.returnPct >= 0 ? '#34d399' : '#f87171' }}>
                    {bot.returnPct >= 0 ? '+' : ''}{bot.returnPct.toFixed(2)}%
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', color: bot.totalPnL >= 0 ? '#34d399' : '#f87171' }}>
                    {bot.totalPnL >= 0 ? '+' : ''}${bot.totalPnL.toFixed(0)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', color: '#cbd5e1' }}>
                    {bot.winRate.toFixed(1)}%
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', color: '#94a3b8' }}>
                    {bot.trades}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

