export default function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-5xl font-black text-forest-green mb-6">Thank You!</h1>
        <p className="text-xl mb-8">Your Christmas tree order is confirmed.</p>
        <p className="text-lg text-gray-600 mb-12">
          We’ve received your order and will deliver your beautiful tree from 1st December.
        </p>
        <a href="/" className="bg-primary text-black font-bold px-8 py-4 rounded-lg inline-block">
          Continue Shopping
        </a>
      </div>
    </div>
  );
}
