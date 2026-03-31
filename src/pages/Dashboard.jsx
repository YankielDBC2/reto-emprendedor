import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

function formatMoney(amount) {
  return '$' + (amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function calculatePerformance(userData) {
  if (!userData?.meta || !userData?.fechaObjetivo) return null;
  
  const ahora = new Date();
  const objetivo = new Date(userData.fechaObjetivo);
  const inicio = new Date(userData.createdAt);
  
  const diasTotales = (objetivo - inicio) / (1000 * 60 * 60 * 24);
  const diasTranscurridos = (ahora - inicio) / (1000 * 60 * 60 * 24);
  
  if (diasTranscurridos <= 0) return null;
  
  const esperado = (userData.meta / diasTotales) * diasTranscurridos;
  const real = userData.balance || 0;
  
  const diff = real - esperado;
  const percentage = esperado > 0 ? ((diff / esperado) * 100) : 0;
  
  return {
    esperado,
    real,
    diff,
    percentage,
    diasTranscurridos: Math.floor(diasTranscurridos),
    diasTotales: Math.floor(diasTotales)
  };
}

export default function Dashboard() {
  const { user, userData, logout, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('income');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (userData && !userData.hasSetup) {
      navigate('/setup');
    }
  }, [user, userData, navigate]);

  const performance = calculatePerformance(userData);

  async function addTransaction(e) {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    
    setLoading(true);
    try {
      const newTransaction = {
        type,
        amount: parseFloat(amount),
        description: description || (type === 'income' ? 'Ingreso' : 'Gasto'),
        date: new Date().toISOString()
      };
      
      const newBalance = type === 'income' 
        ? (userData.balance || 0) + parseFloat(amount)
        : (userData.balance || 0) - parseFloat(amount);
      
      await updateDoc(doc(db, 'users', user.uid), {
        balance: newBalance,
        transactions: [newTransaction, ...(userData.transactions || [])]
      });
      
      updateUserData({
        ...userData,
        balance: newBalance,
        transactions: [newTransaction, ...(userData.transactions || [])]
      });
      
      setAmount('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  if (!userData) return <div className="page">Cargando...</div>;

  return (
    <div className="page dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Reto <span>Emprendedor</span></h1>
          <p className="user-email">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">Salir</button>
      </header>

      {/* Meta Card */}
      <div className="card meta-card">
        <div className="meta-label">Meta</div>
        <div className="meta-value">{formatMoney(userData.meta)}</div>
        <div className="meta-date">Objetivo: {new Date(userData.fechaObjetivo).toLocaleDateString('es')}</div>
      </div>

      {/* Balance Card */}
      <div className={`card balance-card ${(userData.balance || 0) >= 0 ? 'positive' : 'negative'}`}>
        <div className="balance-label">Balance Actual</div>
        <div className="balance-value">{formatMoney(userData.balance)}</div>
      </div>

      {/* Performance Card */}
      {performance && (
        <div className={`card performance-card ${performance.diff >= 0 ? 'ahead' : 'behind'}`}>
          <div className="performance-label">
            {performance.diff >= 0 ? '✓ Adelantado' : '⚠ Atrasado'}
          </div>
          <div className="performance-value">
            {performance.percentage >= 0 ? '+' : ''}{performance.percentage.toFixed(1)}%
          </div>
          <div className="performance-detail">
            Esperado: {formatMoney(performance.esperado)} | Real: {formatMoney(performance.real)}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${Math.min(Math.max((performance.diasTranscurridos / performance.diasTotales) * 100, 0), 100)}%`
              }}
            />
          </div>
          <div className="progress-text">
            Día {performance.diasTranscurridos} de {performance.diasTotales}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Por día</div>
          <div className="stat-value">{performance ? formatMoney(performance.esperado / performance.diasTranscurridos) : '$0'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Por semana</div>
          <div className="stat-value">{performance ? formatMoney((performance.esperado / performance.diasTranscurridos) * 7) : '$0'}</div>
        </div>
      </div>

      {/* Add Transaction */}
      <div className="card transaction-card">
        <div className="card-title">Agregar movimiento</div>
        <form onSubmit={addTransaction}>
          <div className="type-toggle">
            <button 
              type="button"
              className={`type-btn ${type === 'income' ? 'active income' : ''}`}
              onClick={() => setType('income')}
            >
              + Ingreso
            </button>
            <button 
              type="button"
              className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
              onClick={() => setType('expense')}
            >
              - Gasto
            </button>
          </div>
          
          <div className="input-group">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Cantidad"
              required
              min="1"
            />
          </div>
          
          <div className="input-group">
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción (opcional)"
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '...' : 'Agregar'}
          </button>
        </form>
      </div>

      {/* Recent Transactions */}
      <div className="card transactions-card">
        <div className="card-title">Historial</div>
        {(!userData.transactions || userData.transactions.length === 0) ? (
          <p className="no-data">Sin movimientos aún</p>
        ) : (
          <div className="transactions-list">
            {userData.transactions.slice(0, 10).map((tx, index) => (
              <div key={index} className={`transaction-item ${tx.type}`}>
                <div className="tx-info">
                  <span className="tx-desc">{tx.description}</span>
                  <span className="tx-date">{new Date(tx.date).toLocaleDateString('es')}</span>
                </div>
                <span className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}