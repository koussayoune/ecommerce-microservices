import React, { useEffect, useState } from "react";
import { ShoppingCart, Trash2, ArrowLeft, CreditCard, Sparkles } from "lucide-react";
import { getBasket, removeItemFromBasket, clearBasket } from "./services/api";

// Update basket function (you'll need to add this to your api.js)
const updateBasket = async (basketData) => {
  try {
    const response = await fetch('http://localhost:8001/api/v1/Basket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(basketData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update basket');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating basket:', error);
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
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(147, 51, 234, 0.2)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '9999px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s',
    textDecoration: 'none',
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
  basketSection: {
    backdropFilter: 'blur(16px)',
    background: 'rgba(88, 28, 135, 0.2)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '16px',
    padding: '32px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#e9d5ff',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  emptyBasket: {
    textAlign: 'center',
    padding: '64px 24px',
  },
  emptyIcon: {
    margin: '0 auto 24px',
  },
  basketItem: {
    display: 'flex',
    gap: '24px',
    padding: '24px',
    background: 'rgba(59, 7, 100, 0.3)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '12px',
    marginBottom: '16px',
    transition: 'all 0.3s',
  },
  itemImage: {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '12px',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#e9d5ff',
    marginBottom: '8px',
  },
  itemPrice: {
    fontSize: '24px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #c084fc, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '16px',
  },
  quantityInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
    color: '#d8b4fe',
  },
  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  removeButton: {
    padding: '8px',
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#f87171',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTotal: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#c084fc',
  },
  summarySection: {
    backdropFilter: 'blur(16px)',
    background: 'rgba(88, 28, 135, 0.2)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '16px',
    padding: '32px',
    position: 'sticky',
    top: '100px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
  },
  summaryLabel: {
    color: '#d8b4fe',
    fontSize: '16px',
  },
  summaryValue: {
    color: '#e9d5ff',
    fontSize: '18px',
    fontWeight: '600',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 0',
    marginTop: '16px',
  },
  totalLabel: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#e9d5ff',
  },
  totalAmount: {
    fontSize: '36px',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '24px',
  },
  clearButton: {
    width: '100%',
    padding: '12px',
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    color: '#f87171',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '12px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '64px 0',
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

export default function BasketPage() {
  const [basketItems, setBasketItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const userName = "user1";

  const fetchBasket = async () => {
    setLoading(true);
    try {
      const data = await getBasket(userName);
      setBasketItems(data.items || []);
    } catch (err) {
      console.error("Failed to fetch basket:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBasket();
  }, []);

  const handleRemoveItem = async (productId) => {
    setUpdating(true);
    try {
      await removeItemFromBasket(userName, productId);
      await fetchBasket();
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert("Failed to remove item");
    } finally {
      setUpdating(false);
    }
  };

  const handleClearBasket = async () => {
    if (!window.confirm("Are you sure you want to clear your basket?")) {
      return;
    }

    setUpdating(true);
    try {
      await clearBasket(userName);
      setBasketItems([]);
    } catch (err) {
      console.error("Failed to clear basket:", err);
      alert("Failed to clear basket");
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    alert("Checkout functionality coming soon!");
  };

  const calculateTotal = () => {
    return basketItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return basketItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
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
            <h1 style={styles.logoText}>CloudMatrixtestjenkins</h1>
          </div>
          <a
            href="/"
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(147, 51, 234, 0.4)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(147, 51, 234, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <ArrowLeft size={20} />
            <span>Back to Catalog</span>
          </a>
        </div>
      </header>

      <div style={styles.mainContent}>
        <div style={styles.heroSection}>
          <h2 style={styles.heroTitle}>Your Basket</h2>
          <p style={styles.heroSubtitle}>Review and manage your selected items</p>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={{ color: '#d8b4fe' }}>Loading your basket...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: basketItems.length === 0 ? '1fr' : '2fr 1fr', gap: '32px' }}>
            <div style={styles.basketSection}>
              <h3 style={styles.sectionTitle}>
                <ShoppingCart size={28} />
                Items ({getTotalItems()})
              </h3>

              {basketItems.length === 0 ? (
                <div style={styles.emptyBasket}>
                  <ShoppingCart size={80} color="rgba(168, 85, 247, 0.5)" style={styles.emptyIcon} />
                  <h3 style={{ color: '#e9d5ff', fontSize: '24px', marginBottom: '12px' }}>
                    Your basket is empty
                  </h3>
                  <p style={{ color: '#d8b4fe', marginBottom: '24px' }}>
                    Add some amazing products to get started!
                  </p>
                  <a
                    href="/"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      background: 'linear-gradient(90deg, #9333ea, #7c3aed)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                    }}
                  >
                    <ArrowLeft size={20} />
                    Continue Shopping
                  </a>
                </div>
              ) : (
                <>
                  {basketItems.map((item) => (
                    <div
                      key={item.productId}
                      style={styles.basketItem}
                    >
                      <img
                        src={item.pictureUrl || item.imageUrl || item.image || `https://via.placeholder.com/120x120/1a0b2e/9333ea?text=${encodeURIComponent(item.productName)}`}
                        alt={item.productName}
                        style={styles.itemImage}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/120x120/1a0b2e/9333ea?text=${encodeURIComponent(item.productName)}`;
                        }}
                      />
                      <div style={styles.itemDetails}>
                        <h4 style={styles.itemName}>{item.productName}</h4>
                        <p style={styles.itemPrice}>${item.price.toFixed(2)}</p>
                        <div style={styles.quantityInfo}>
                          <span>Quantity: {item.quantity}</span>
                        </div>
                      </div>
                      <div style={styles.itemActions}>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={updating}
                          style={{
                            ...styles.removeButton,
                            opacity: updating ? 0.5 : 1,
                            cursor: updating ? 'not-allowed' : 'pointer'
                          }}
                          onMouseEnter={(e) => !updating && (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)')}
                        >
                          <Trash2 size={20} />
                        </button>
                        <p style={styles.itemTotal}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {basketItems.length > 0 && (
              <div>
                <div style={styles.summarySection}>
                  <h3 style={{ ...styles.sectionTitle, marginBottom: '24px' }}>Order Summary</h3>
                  
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Subtotal</span>
                    <span style={styles.summaryValue}>${calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Shipping</span>
                    <span style={styles.summaryValue}>Free</span>
                  </div>
                  
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Tax</span>
                    <span style={styles.summaryValue}>${(calculateTotal() * 0.1).toFixed(2)}</span>
                  </div>

                  <div style={styles.totalRow}>
                    <span style={styles.totalLabel}>Total</span>
                    <span style={styles.totalAmount}>
                      ${(calculateTotal() * 1.1).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={updating}
                    style={{
                      ...styles.checkoutButton,
                      opacity: updating ? 0.5 : 1,
                      cursor: updating ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!updating) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 15px 50px rgba(147, 51, 234, 0.7)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(147, 51, 234, 0.5)';
                    }}
                  >
                    <CreditCard size={24} />
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={handleClearBasket}
                    disabled={updating}
                    style={{
                      ...styles.clearButton,
                      opacity: updating ? 0.5 : 1,
                      cursor: updating ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => !updating && (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)')}
                  >
                    Clear Basket
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}