import React, { useEffect, useState } from "react";
import { ShoppingCart, X, Plus, Minus, Sparkles } from "lucide-react";

// Fetch catalog from API
const getCatalog = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/Catalog');
    if (!response.ok) {
      throw new Error('Failed to fetch catalog');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching catalog:', error);
    throw error;
  }
};

const addToBasket = async (userId, { productId, quantity, productName, price, image }) => {
  try {
    // First, get the current basket
    const getResponse = await fetch(`http://localhost:8001/api/v1/Basket?userName=${userId}`);
    let basketData;
    
    if (getResponse.ok) {
      basketData = await getResponse.json();
    } else {
      // Create new basket if doesn't exist
      basketData = {
        userName: userId,
        items: []
      };
    }
    
    // Check if item already exists in basket
    const existingItemIndex = basketData.items?.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== undefined && existingItemIndex >= 0) {
      // Update quantity if item exists
      basketData.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to basket
      if (!basketData.items) {
        basketData.items = [];
      }
      basketData.items.push({
        productId: productId,
        productName: productName,
        price: price,
        quantity: quantity,
        imageUrl: image
      });
    }
    
    // Update the basket
    const response = await fetch('http://localhost:8001/api/v1/Basket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(basketData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add to basket');
    }
    
    const data = await response.json();
    console.log(`Added product ${productId} quantity ${quantity} for user ${userId}`);
    return data;
  } catch (error) {
    console.error('Error adding to basket:', error);
    throw error;
  }
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0520 0%, #2d1b4e 50%, #0f0520 100%)',
    color: '#ffffff',
    position: 'relative',
  },
  backgroundEffect1: {
    position: 'fixed',
    top: '25%',
    left: '25%',
    width: '384px',
    height: '384px',
    background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    animation: 'pulse 3s ease-in-out infinite',
  },
  backgroundEffect2: {
    position: 'fixed',
    bottom: '25%',
    right: '25%',
    width: '384px',
    height: '384px',
    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    animation: 'pulse 3s ease-in-out infinite 1s',
  },
  header: {
    position: 'sticky',
    top: 0,
    backdropFilter: 'blur(20px)',
    background: 'rgba(59, 7, 100, 0.3)',
    borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
    zIndex: 40,
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoText: {
    fontSize: '30px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #c084fc, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  basketButton: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    background: 'linear-gradient(90deg, #9333ea, #7c3aed)',
    borderRadius: '9999px',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 10px 40px rgba(147, 51, 234, 0.5)',
    transition: 'all 0.3s',
  },
  basketBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#ec4899',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '9999px',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'bounce 1s infinite',
  },
  mainContent: {
    position: 'relative',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '48px 24px',
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '16px',
    background: 'linear-gradient(90deg, #d8b4fe, #a78bfa, #d8b4fe)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    color: '#d8b4fe',
    fontSize: '18px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
  },
  card: {
    position: 'relative',
    backdropFilter: 'blur(16px)',
    background: 'rgba(88, 28, 135, 0.2)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  cardHover: {
    transform: 'scale(1.05)',
    border: '1px solid rgba(168, 85, 247, 0.5)',
    boxShadow: '0 20px 60px rgba(147, 51, 234, 0.3)',
  },
  cardOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), transparent)',
    opacity: 0,
    transition: 'opacity 0.3s',
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '224px',
    objectFit: 'cover',
    transition: 'transform 0.5s',
  },
  imageGradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(59, 7, 100, 0.8), transparent)',
  },
  cardContent: {
    position: 'relative',
    padding: '24px',
  },
  productName: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#e9d5ff',
    transition: 'color 0.3s',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  price: {
    fontSize: '30px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #c084fc, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  currency: {
    color: '#c084fc',
    fontSize: '14px',
  },
  addButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(90deg, #9333ea, #7c3aed)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)',
    transition: 'all 0.3s',
  },
  sidebar: {
    position: 'fixed',
    right: 0,
    top: 0,
    height: '100%',
    width: '100%',
    maxWidth: '448px',
    background: 'linear-gradient(135deg, #0f0520 0%, #2d1b4e 50%, #0f0520 100%)',
    borderLeft: '1px solid rgba(168, 85, 247, 0.3)',
    boxShadow: '-10px 0 50px rgba(0, 0, 0, 0.5)',
    zIndex: 50,
    overflowY: 'auto',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 40,
  },
  sidebarContent: {
    padding: '24px',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sidebarTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#e9d5ff',
  },
  closeButton: {
    padding: '8px',
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background 0.3s',
  },
  emptyBasket: {
    textAlign: 'center',
    padding: '48px 0',
  },
  basketItem: {
    backdropFilter: 'blur(16px)',
    background: 'rgba(88, 28, 135, 0.2)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
  },
  basketItemContent: {
    display: 'flex',
    gap: '16px',
  },
  basketItemImage: {
    width: '81px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  basketItemDetails: {
    flex: 1,
  },
  basketItemName: {
    fontWeight: '600',
    color: '#e9d5ff',
    marginBottom: '4px',
  },
  basketItemPrice: {
    color: '#c084fc',
    fontWeight: 'bold',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
  },
  quantityButton: {
    padding: '4px',
    background: 'rgba(126, 34, 206, 0.5)',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  quantity: {
    color: '#e9d5ff',
    fontWeight: '600',
    width: '32px',
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 'auto',
    padding: '4px',
    background: 'transparent',
    border: 'none',
    color: '#f87171',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
  totalSection: {
    borderTop: '1px solid rgba(168, 85, 247, 0.3)',
    paddingTop: '16px',
    marginTop: '24px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  totalLabel: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#e9d5ff',
  },
  totalAmount: {
    fontSize: '30px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #c084fc, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  checkoutButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(90deg, #9333ea, #7c3aed)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    cursor: 'pointer',
    boxShadow: '0 10px 40px rgba(147, 51, 234, 0.5)',
    transition: 'all 0.3s',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '48px 0',
  },
  loadingSpinner: {
    width: '64px',
    height: '64px',
    border: '4px solid rgba(168, 85, 247, 0.3)',
    borderTop: '4px solid #a855f7',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite',
  },
};

export default function CatalogPage() {
  const [items, setItems] = useState([]);
  const [basket, setBasket] = useState([]);
  const [showBasket, setShowBasket] = useState(false);
  const [loading, setLoading] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    getCatalog().then(setItems).catch(console.error);
  }, []);

  const handleAddToBasket = async (item) => {
    setLoading(prev => ({ ...prev, [item.id]: true }));
    try {
      await addToBasket("user1", { 
        productId: item.id, 
        quantity: 1,
        productName: item.name,
        price: item.price,
        image: item.image || item.imageUrl
      });
      
      setBasket(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
          return prev.map(i => 
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
      
      // Show success feedback
      alert('Item added to basket!');
    } catch (err) {
      console.error('Failed to add to basket:', err);
      alert('Failed to add item to basket. Check console for details.');
    } finally {
      setLoading(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const updateQuantity = (itemId, delta) => {
    setBasket(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromBasket = (itemId) => {
    setBasket(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    // Navigate to basket page
    window.location.href = '/basket';
  };

  const basketCount = basket.reduce((sum, item) => sum + item.quantity, 0);
  const basketTotal = basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.backgroundEffect1}></div>
      <div style={styles.backgroundEffect2}></div>

      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <Sparkles color="#c084fc" size={32} />
            <h1 style={styles.logoText}>CloudMatrixtest</h1>
          </div>
          <button
            onClick={() => setShowBasket(!showBasket)}
            style={styles.basketButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(147, 51, 234, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(147, 51, 234, 0.5)';
            }}
          >
            <ShoppingCart size={24} />
            {basketCount > 0 && (
              <span style={styles.basketBadge}>{basketCount}</span>
            )}
            <span>Basket</span>
          </button>
        </div>
      </header>

      <div style={styles.mainContent}>
        <div style={styles.heroSection}>
          <h2 style={styles.heroTitle}>Next-Gen Technology</h2>
          <p style={styles.heroSubtitle}>Experience the future today</p>
        </div>

        {items.length === 0 ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={{ color: '#d8b4fe' }}>Loading catalog...</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.card,
                  ...(hoveredCard === item.id ? styles.cardHover : {})
                }}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{
                  ...styles.cardOverlay,
                  opacity: hoveredCard === item.id ? 1 : 0
                }}></div>
                
                <div style={styles.imageContainer}>
                  <img
                    src={item.image || item.imageUrl || `https://via.placeholder.com/400x300/1a0b2e/9333ea?text=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                    style={{
                      ...styles.image,
                      transform: hoveredCard === item.id ? 'scale(1.1)' : 'scale(1)'
                    }}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x300/1a0b2e/9333ea?text=${encodeURIComponent(item.name)}`;
                    }}
                  />
                  <div style={styles.imageGradient}></div>
                </div>

                <div style={styles.cardContent}>
                  <h3 style={{
                    ...styles.productName,
                    color: hoveredCard === item.id ? '#f3e8ff' : '#e9d5ff'
                  }}>{item.name}</h3>
                  <div style={styles.priceContainer}>
                    <span style={styles.price}>${item.price}</span>
                    <span style={styles.currency}>USD</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToBasket(item)}
                    disabled={loading[item.id]}
                    style={{
                      ...styles.addButton,
                      opacity: loading[item.id] ? 0.5 : 1,
                      cursor: loading[item.id] ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading[item.id]) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(147, 51, 234, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(147, 51, 234, 0.3)';
                    }}
                  >
                    {loading[item.id] ? (
                      <div style={styles.spinner}></div>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        Add to Basket
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showBasket && (
        <>
          <div style={styles.overlay} onClick={() => setShowBasket(false)}></div>
          <div style={styles.sidebar}>
            <div style={styles.sidebarContent}>
              <div style={styles.sidebarHeader}>
                <h2 style={styles.sidebarTitle}>Your Basket</h2>
                <button
                  onClick={() => setShowBasket(false)}
                  style={styles.closeButton}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(126, 34, 206, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <X size={24} />
                </button>
              </div>

              {basket.length === 0 ? (
                <div style={styles.emptyBasket}>
                  <ShoppingCart size={64} color="rgba(168, 85, 247, 0.5)" style={{ margin: '0 auto 16px' }} />
                  <p style={{ color: '#d8b4fe' }}>Your basket is empty</p>
                </div>
              ) : (
                <>
                  <div>
                    {basket.map((item) => (
                      <div key={item.id} style={styles.basketItem}>
                        <div style={styles.basketItemContent}>
                          <img
                            src={item.image || item.imageUrl || `https://via.placeholder.com/80x80/1a0b2e/9333ea?text=${encodeURIComponent(item.name)}`}
                            alt={item.name}
                            style={styles.basketItemImage}
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/80x80/1a0b2e/9333ea?text=${encodeURIComponent(item.name)}`;
                            }}
                          />
                          <div style={styles.basketItemDetails}>
                            <h3 style={styles.basketItemName}>{item.name}</h3>
                            <p style={styles.basketItemPrice}>${item.price}</p>
                            <div style={styles.quantityControls}>
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                style={styles.quantityButton}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#7e22ce'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(126, 34, 206, 0.5)'}
                              >
                                <Minus size={16} />
                              </button>
                              <span style={styles.quantity}>{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                style={styles.quantityButton}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#7e22ce'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(126, 34, 206, 0.5)'}
                              >
                                <Plus size={16} />
                              </button>
                              <button
                                onClick={() => removeFromBasket(item.id)}
                                style={styles.removeButton}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#fca5a5'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#f87171'}
                              >
                                <X size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={styles.totalSection}>
                    <div style={styles.totalRow}>
                      <span style={styles.totalLabel}>Total</span>
                      <span style={styles.totalAmount}>${basketTotal.toFixed(2)}</span>
                    </div>
                    <button
                      style={styles.checkoutButton}
                      onClick={handleCheckout}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 15px 50px rgba(147, 51, 234, 0.7)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 40px rgba(147, 51, 234, 0.5)';
                      }}
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}