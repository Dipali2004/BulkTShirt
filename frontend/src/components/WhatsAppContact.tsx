import { FC } from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppContact: FC = () => {
  const phoneNumber = '911234567890'; // Replace with actual phone number
  const message = 'Hello, I have an enquiry about bulk plain t-shirts.';

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 z-50 animate-bounce group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="h-8 w-8" />
      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Chat with us!
      </span>
    </button>
  );
};

export default WhatsAppContact;
