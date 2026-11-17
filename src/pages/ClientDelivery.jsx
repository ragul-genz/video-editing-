import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ArrowRight, Download, Loader2 } from 'lucide-react';
import './ClientDelivery.css';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TWTH9nOKea11hk';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const GoogleDriveLogo = ({ size = 110, className = '' }) => (
  <svg
    viewBox="0 0 87.3 78"
    width={size}
    height={(size * 78) / 87.3}
    className={`gdrive-logo-svg ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Blue segment */}
    <path
      d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
      fill="#0066da"
    />
    <path
      d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
      fill="#2684fc"
    />
    {/* Green segment */}
    <path
      d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z"
      fill="#00ac47"
    />
    <path
      d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
      fill="#00832d"
    />
    {/* Yellow/Orange segment */}
    <path
      d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
      fill="#ffba00"
    />
    <path
      d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
      fill="#ea4335"
    />
  </svg>
);

const IdBadgeIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="id-badge-icon"
  >
    {/* Lanyard Clip */}
    <rect x="11.5" y="1" width="5" height="3" rx="1.5" fill="#adb5bd" />
    <path d="M14 4V7" stroke="#adb5bd" strokeWidth="1.5" />
    {/* ID Card Outer */}
    <rect
      x="4"
      y="6"
      width="20"
      height="19"
      rx="3.5"
      fill="#ffffff"
      stroke="#dee2e6"
      strokeWidth="1.2"
    />
    {/* Avatar photo box */}
    <rect x="7" y="9.5" width="6.5" height="7.5" rx="1.5" fill="#0080ff" />
    <circle cx="10.25" cy="12.5" r="1.8" fill="#ffffff" />
    <path d="M8 16.5c0-1.2 1-2 2.25-2s2.25.8 2.25 2" stroke="#ffffff" strokeWidth="0.8" />
    {/* Text lines on card */}
    <rect x="15" y="10.5" width="6.5" height="1.5" rx="0.75" fill="#adb5bd" />
    <rect x="15" y="13.5" width="5" height="1.5" rx="0.75" fill="#ced4da" />
    {/* Green verified checkmark badge */}
    <circle cx="21" cy="21" r="4.5" fill="#00c853" stroke="#ffffff" strokeWidth="1.2" />
    <path
      d="M19.3 21l1.2 1.2 2.4-2.4"
      stroke="#ffffff"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const isOrderMatch = (order, query) => {
  if (!order || !query) return false;
  const cleanQ = String(query).trim().replace(/^#/, '');
  const orderId = String(order.id || '').trim();
  const txId = String(order.transactionId || '').trim();
  const rzpOrderId = String(order.razorpayOrderId || '').trim();

  // 1. Exact match on id, transactionId, or razorpayOrderId
  if (orderId.toLowerCase() === cleanQ.toLowerCase()) return true;
  if (txId && txId.toLowerCase() === cleanQ.toLowerCase()) return true;
  if (rzpOrderId && rzpOrderId.toLowerCase() === cleanQ.toLowerCase()) return true;

  // 2. Normalized match (without hyphens, underscores, or spaces)
  const normQ = cleanQ.replace(/[-_\s]/g, '').toLowerCase();
  const normId = orderId.replace(/[-_\s]/g, '').toLowerCase();
  if (normId && normQ && (normId === normQ || normId.includes(normQ))) return true;

  // 3. Sequential number match (e.g. searching '001' or '1' matches '17112026-001')
  const matchSeq = orderId.match(/[_-](\d+)$/);
  if (matchSeq) {
    const seqNum = matchSeq[1];
    if (cleanQ === seqNum || parseInt(cleanQ, 10) === parseInt(seqNum, 10)) {
      return true;
    }
  }

  return false;
};

const ClientDelivery = () => {
  const [searchParams] = useSearchParams();
  const { orders, fetchOrders, updateOrder, addToast, currentUser } = useContext(AppContext);

  const [orderIdInput, setOrderIdInput] = useState(() => {
    return (searchParams.get('orderId') || searchParams.get('id') || '').trim();
  });
  const [matchedOrder, setMatchedOrder] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handleLookup = useCallback(async (idToSearch) => {
    const query = (idToSearch || orderIdInput).trim();
    if (!query) {
      addToast('Please enter your Order ID', 'info');
      return;
    }

    setIsSearching(true);

    // 1. Check local state first
    let found = (orders || []).find((o) => isOrderMatch(o, query));

    // 2. If not found in local state, fetch from server
    if (!found && fetchOrders) {
      try {
        const freshOrders = await fetchOrders();
        found = (freshOrders || []).find((o) => isOrderMatch(o, query));
      } catch (err) {
        console.warn('Order lookup error:', err);
      }
    }

    setIsSearching(false);

    if (found) {
      setMatchedOrder(found);
      addToast(`Order #${found.id} located!`, 'success');
    } else {
      setMatchedOrder(null);
      addToast(`Order #${query} not found. Please double-check your Order ID.`, 'error');
    }
  }, [orderIdInput, orders, fetchOrders, addToast]);

  // Auto-fill from query param (?orderId=... or ?id=...)
  useEffect(() => {
    const paramId = (searchParams.get('orderId') || searchParams.get('id') || '').trim();
    if (paramId) {
      handleLookup(paramId);
    } else if (currentUser && orders && orders.length > 0) {
      // If logged in, find their most recent order
      const userOrder = orders.find(o => o.userEmail?.toLowerCase() === currentUser.email?.toLowerCase());
      if (userOrder && userOrder.id) {
        setOrderIdInput(userOrder.id);
        setMatchedOrder(userOrder);
      }
    }
  }, [searchParams, currentUser, orders, handleLookup]);

  const handleAction = async () => {
    if (!orderIdInput.trim()) {
      addToast('Please enter your Order ID first', 'info');
      return;
    }

    // If order is not matched yet, search for it
    if (!matchedOrder) {
      await handleLookup();
      return;
    }

    // If already Delivered or Approved, open Google Drive files
    const isReady = ['Approved', 'Delivered'].includes(matchedOrder.status);
    const driveLink =
      matchedOrder.deliveryLink ||
      matchedOrder.items?.[0]?.driveLink ||
      'https://drive.google.com';

    if (isReady && driveLink) {
      window.open(driveLink, '_blank', 'noopener,noreferrer');
      addToast('Opening your Google Drive files...', 'success');
      return;
    }

    // Otherwise, initiate Razorpay payment for pending order
    await handlePayment();
  };

  const handlePayment = async () => {
    if (!matchedOrder) return;

    setIsPaying(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setIsPaying(false);
      addToast('Could not load payment gateway. Please check your connection.', 'error');
      return;
    }

    const priceNum = parseFloat(String(matchedOrder.total || '').replace(/[^0-9.]/g, '')) || 0;
    const amountInPaise = Math.round(priceNum * 100);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise > 0 ? amountInPaise : 100,
      currency: 'INR',
      name: 'DS3 STUDIO',
      description: `Delivery Settlement - Order #${matchedOrder.id}`,
      image: '/ds3_logo.jpg',
      prefill: {
        name: matchedOrder.name || 'Client',
        email: matchedOrder.userEmail || currentUser?.email || ''
      },
      theme: { color: '#00aaff' },
      handler: async function (response) {
        setIsPaying(false);
        try {
          await updateOrder(matchedOrder.id, {
            status: 'Approved',
            transactionId: response.razorpay_payment_id
          });
          setMatchedOrder((prev) => ({
            ...prev,
            status: 'Approved',
            transactionId: response.razorpay_payment_id
          }));
          addToast('Payment successful! Your Google Drive files are unlocked.', 'success');
        } catch (err) {
          console.error(err);
          addToast('Payment received! Contact studio if download does not open automatically.', 'info');
        }
      },
      modal: {
        ondismiss: function () {
          setIsPaying(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setIsPaying(false);
      console.error(err);
      addToast('Payment gateway failed to open.', 'error');
    }
  };

  const isDeliveredOrApproved = matchedOrder && ['Approved', 'Delivered'].includes(matchedOrder.status);
  const targetDriveLink =
    matchedOrder?.deliveryLink ||
    matchedOrder?.items?.[0]?.driveLink ||
    'https://drive.google.com';

  return (
    <div className="client-delivery-page">
      <div className="delivery-bg-glow" />

      {/* Main Theater Card (Exact design from screenshot) */}
      <div className="delivery-cinema-card">
        <div className="cinema-backdrop-overlay" />
        <div className="cinema-vignette" />

        <div className="delivery-card-content">
          {/* Top Heading */}
          <h1 className="delivery-title">FINAL OUTPUT</h1>
          <p className="delivery-subtitle">THANK YOU FOR CHOOSING DS3 STUDIO!</p>

          {/* Center Google Drive Logo */}
          <div
            className={`gdrive-logo-wrap ${isDeliveredOrApproved ? 'interactive' : ''}`}
            onClick={() => {
              if (isDeliveredOrApproved && targetDriveLink) {
                window.open(targetDriveLink, '_blank', 'noopener,noreferrer');
              }
            }}
            style={{ cursor: isDeliveredOrApproved ? 'pointer' : 'default' }}
            title={isDeliveredOrApproved ? 'Click to open Google Drive Final Files' : 'Google Drive Storage'}
          >
            <GoogleDriveLogo size={120} />
          </div>

          {/* ORDER ID Label */}
          <div className="order-id-label">ORDER ID</div>

          {/* Capsule Input Row with ID Badge Icon */}
          <div className="order-input-capsule-row">
            <IdBadgeIcon />
            <input
              type="text"
              className="order-id-capsule-input"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAction();
              }}
              placeholder="ENTER YOUR ORDER ID (e.g. 17112026-001)"
              aria-label="Order ID Input"
            />
          </div>

          {/* Matched Order Preview (if found) */}
          {matchedOrder && (
            <div className="order-matched-details">
              <div className="order-detail-row">
                <span>Client:</span>
                <strong>{matchedOrder.name || matchedOrder.userEmail || 'Valued Client'}</strong>
              </div>
              <div className="order-detail-row">
                <span>Total Amount:</span>
                <strong style={{ color: '#27c93f' }}>{matchedOrder.total}</strong>
              </div>
              <div className="order-detail-row">
                <span>Status:</span>
                <span
                  className={`order-detail-badge ${
                    isDeliveredOrApproved ? 'delivered' : 'pending'
                  }`}
                >
                  {isDeliveredOrApproved ? 'Ready for Download' : 'Payment Pending'}
                </span>
              </div>
              {matchedOrder.items && matchedOrder.items.length > 0 && (
                <div className="order-detail-row" style={{ marginTop: '4px' }}>
                  <span>Asset:</span>
                  <strong style={{ color: 'var(--secondary)' }}>
                    {matchedOrder.items[0].title}
                  </strong>
                </div>
              )}
            </div>
          )}

          {/* Action Button: PAY NOW or DOWNLOAD OUTPUT */}
          <button
            type="button"
            className={`pay-now-pill-btn ${isDeliveredOrApproved ? 'success-download' : ''}`}
            onClick={handleAction}
            disabled={isSearching || isPaying}
          >
            {isSearching ? (
              <>
                <Loader2 size={18} className="spin-animation" />
                <span>SEARCHING...</span>
              </>
            ) : isPaying ? (
              <>
                <Loader2 size={18} className="spin-animation" />
                <span>PROCESSING...</span>
              </>
            ) : isDeliveredOrApproved ? (
              <>
                <Download size={18} />
                <span>ACCESS DRIVE FILES</span>
              </>
            ) : matchedOrder ? (
              <>
                <span>PAY NOW</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <span>PAY NOW</span>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Appreciation Message (Exact wording from screenshot) */}
      <footer className="delivery-footer-message">
        <p className="delivery-appreciation-p">
          WE SINCERELY APPRECIATE YOUR TRUST IN OUR SERVICES. IT WAS A PLEASURE WORKING WITH YOU, AND WE HOPE YOU'RE HAPPY WITH THE FINAL RESULT.
        </p>

        <p className="delivery-appreciation-p">
          YOUR SUPPORT MEANS A LOT TO US, AND WE LOOK FORWARD TO COLLABORATING WITH YOU AGAIN ON FUTURE PROJECTS.
        </p>

        <p className="delivery-appreciation-p">
          THANK YOU FOR BEING A VALUED CLIENT!
        </p>

        <div className="delivery-signoff-wrap">
          <span className="delivery-signoff-title">BEST REGARDS,</span>
          <span className="delivery-signoff-team">TEAM DS3 STUDIO</span>
          <span className="delivery-signoff-motto">YOUR VISION, OUR CREATIVITY.</span>
        </div>
      </footer>
    </div>
  );
};

export default ClientDelivery;
