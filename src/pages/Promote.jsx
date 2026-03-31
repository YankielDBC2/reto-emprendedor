import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const MAX_TITLE = 100;

export default function Promote() {
  const { user, userData, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || title.length > MAX_TITLE) return;

    setLoading(true);
    try {
      const newPromo = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        createdAt: new Date().toISOString()
      };

      const currentPromos = userData?.promos || [];
      await updateDoc(doc(db, 'users', user.uid), {
        promos: [newPromo, ...currentPromos]
      });

      updateUserData({
        ...userData,
        promos: [newPromo, ...currentPromos]
      });

      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!userData) return <div className="page">Cargando...</div>;

  const promos = userData.promos || [];

  return (
    <div className="page">
      <header className="promote-header">
        <h1>Promover</h1>
        <p className="subtitle">Comparte tu proyecto o link</p>
      </header>

      {/* Form */}
      <div className="promo-form">
        <div className="card-title">Nuevo promocion</div>
        <form onSubmit={handleSubmit}>
          <div className="promo-input">
            <label>Título (máx 100 caracteres)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tu proyecto o negocio..."
              maxLength={MAX_TITLE}
              required
            />
            <div className={`char-count ${title.length > 80 ? 'warning' : ''}`}>
              {title.length}/{MAX_TITLE}
            </div>
          </div>

          <div className="promo-input">
            <label>Descripción corta</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿Qué ofreces?..."
            />
          </div>

          <button type="submit" disabled={loading || !title.trim()} className="btn-primary">
            {loading ? '...' : 'Publicar'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="promo-list">
        {promos.length === 0 ? (
          <div className="no-promos">
            <div className="no-promos-icon">📢</div>
            <p>No hay promociones aún</p>
            <p className="subtitle">¡Crea la primera!</p>
          </div>
        ) : (
          promos.map((promo) => (
            <div key={promo.id} className="promo-card">
              <div className="promo-card-icon">🚀</div>
              <div className="promo-card-content">
                <div className="promo-card-title">{promo.title}</div>
                {promo.description && (
                  <div className="promo-card-desc">{promo.description}</div>
                )}
              </div>
              <button className="promo-card-check">✓ Ver</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}