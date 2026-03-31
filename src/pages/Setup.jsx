import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Setup() {
  const [meta, setMeta] = useState('');
  const [fecha, setFecha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    
    if (!meta || meta <= 0) {
      setError('Ingresa una meta válida');
      return;
    }
    if (!fecha) {
      setError('Ingresa una fecha objetivo');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        meta: parseFloat(meta),
        fechaObjetivo: fecha,
        hasSetup: true,
        createdAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'users', user.uid), userData);
      updateUserData({ ...userData, balance: 0, transactions: [] });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="page">
      <div className="setup-container">
        <h1>Configura tu <span>Reto</span></h1>
        <p className="subtitle">¿Cuál es tu meta financiera?</p>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Meta financiera ($)</label>
            <div className="input-prefix">
              <input 
                type="number" 
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                required
                min="1"
                placeholder="10000"
              />
            </div>
          </div>
          
          <div className="input-group">
            <label>Fecha objetivo</label>
            <input 
              type="date" 
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              min={today}
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '...' : 'Crear Reto'}
          </button>
        </form>
      </div>
    </div>
  );
}