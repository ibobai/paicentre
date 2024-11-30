import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { CollapsibleSection } from '../../components/settings/CollapsibleSection';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface WebhookStatus {
  connected: boolean;
  accountId?: string;
  webhookId?: string;
}

export function WebhooksPage() {
  const [stripeStatus, setStripeStatus] = useState<WebhookStatus>(() => {
    const saved = localStorage.getItem('stripeWebhook');
    return saved ? JSON.parse(saved) : { connected: false };
  });

  const [paypalStatus, setPaypalStatus] = useState<WebhookStatus>(() => {
    const saved = localStorage.getItem('paypalWebhook');
    return saved ? JSON.parse(saved) : { connected: false };
  });

  const handleStripeConnect = () => {
    // In a real app, this would redirect to Stripe OAuth
    const stripeOAuthUrl = 'https://connect.stripe.com/oauth/authorize';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: 'your_stripe_client_id',
      scope: 'read_write',
      redirect_uri: `${window.location.origin}/stripe/callback`
    });

    window.location.href = `${stripeOAuthUrl}?${params.toString()}`;
  };

  const handlePayPalConnect = () => {
    // In a real app, this would redirect to PayPal OAuth
    const paypalOAuthUrl = 'https://www.paypal.com/connect';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: 'your_paypal_client_id',
      scope: 'openid email payments',
      redirect_uri: `${window.location.origin}/paypal/callback`
    });

    window.location.href = `${paypalOAuthUrl}?${params.toString()}`;
  };

  const handleStripeDisconnect = () => {
    setStripeStatus({ connected: false });
    localStorage.removeItem('stripeWebhook');
    toast.success('Stripe disconnected successfully');
  };

  const handlePayPalDisconnect = () => {
    setPaypalStatus({ connected: false });
    localStorage.removeItem('paypalWebhook');
    toast.success('PayPal disconnected successfully');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link 
        to="/settings" 
        className="inline-flex items-center text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Settings
      </Link>

      <div className="flex items-center">
        <CreditCard className="h-8 w-8 text-gray-700 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900">Payment Webhooks</h1>
      </div>

      <div className="space-y-6">
        <CollapsibleSection
          title="Stripe Integration"
          icon={<CreditCard className="h-6 w-6" />}
          defaultOpen
        >
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
              <p className="text-sm text-gray-600 mb-4">
                {stripeStatus.connected
                  ? `Connected to Stripe account ${stripeStatus.accountId}`
                  : 'Not connected to Stripe'}
              </p>
              {stripeStatus.connected ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Webhook Active
                        </h3>
                        <p className="text-sm text-green-700 mt-1">
                          Receiving real-time payment updates from Stripe
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleStripeDisconnect}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                  >
                    Disconnect Stripe
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStripeConnect}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Connect Stripe
                </button>
              )}
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="PayPal Integration"
          icon={<CreditCard className="h-6 w-6" />}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
              <p className="text-sm text-gray-600 mb-4">
                {paypalStatus.connected
                  ? `Connected to PayPal account ${paypalStatus.accountId}`
                  : 'Not connected to PayPal'}
              </p>
              {paypalStatus.connected ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Webhook Active
                        </h3>
                        <p className="text-sm text-green-700 mt-1">
                          Receiving real-time payment updates from PayPal
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handlePayPalDisconnect}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                  >
                    Disconnect PayPal
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePayPalConnect}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Connect PayPal
                </button>
              )}
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}