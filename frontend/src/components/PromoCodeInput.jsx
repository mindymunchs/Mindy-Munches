import { useState } from 'react';

const PromoCodeInput = ({ subtotal, onApply }) => {
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter a promo code' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/promo-codes/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: promoCode,
          subtotal
        })
      });

      const data = await response.json();

      if (data.success) {
        setAppliedPromo(data.promoCode);
        setMessage({ 
          type: 'success', 
          text: `🎉 Promo code applied! You saved ₹${data.promoCode.discount}` 
        });
        onApply(data.promoCode);
      } else {
        setMessage({ type: 'error', text: data.message });
        setAppliedPromo(null);
        onApply(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to validate promo code' });
      console.error('Promo code validation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setAppliedPromo(null);
    setMessage(null);
    onApply(null);
  };

  return (
    <div className="mb-4">
      {/* Title */}
      <h3 className="text-base font-semibold text-neutral-800 mb-3">Have a promo code?</h3>
      
      {/* Input with Button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          disabled={appliedPromo}
          className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed uppercase text-sm"
          onKeyPress={(e) => e.key === 'Enter' && !appliedPromo && validatePromoCode()}
        />
        
        {!appliedPromo ? (
          <button
            onClick={validatePromoCode}
            disabled={loading || !promoCode.trim()}
            className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Checking...' : 'Apply'}
          </button>
        ) : (
          <button
            onClick={removePromoCode}
            className="px-6 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition whitespace-nowrap"
          >
            Remove
          </button>
        )}
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`mt-3 p-3 rounded-lg text-sm flex items-start gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <span className="text-base">
            {message.type === 'success' ? '🎉' : '⚠️'}
          </span>
          <span className="flex-1">{message.text}</span>
        </div>
      )}
    </div>
  );
};

export default PromoCodeInput;
