import { useState } from 'react';
import { X, Mail, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EmailCaptureModalProps {
  eventId: string;
  eventTitle: string;
  redirectUrl: string;
  onClose: () => void;
}

export function EmailCaptureModal({ eventId, eventTitle, redirectUrl, onClose }: EmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: insertError } = await supabase
        .from('email_captures')
        .insert([{ email, event_id: eventId }]);

      if (insertError) throw insertError;

      window.open(redirectUrl, '_blank');
      onClose();
    } catch (err) {
      console.error('Error saving email:', err);
      setError('Failed to save email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex items-center justify-center w-16 h-16 mb-6 bg-blue-100 rounded-full mx-auto">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Get Your Tickets
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Enter your email to continue to <span className="font-semibold">{eventTitle}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                disabled={isSubmitting}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Continue to Tickets'
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              We'll only use your email to send you updates about Sydney events. You can unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
