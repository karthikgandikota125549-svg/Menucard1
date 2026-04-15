export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { customer, items, total } = req.body;

      // Validation — check before accessing properties
      if (!customer || !customer.name || !customer.phone || !customer.address) {
        return res.status(400).json({ message: 'Customer details are required' });
      }

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      console.log('📦 Order received: %d items, total: ₹%s', items.length, total);

      res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        orderId: 'ORD-' + Date.now(),
        orderDetails: {
          customer,
          items: items.length,
          total,
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Order error:', error);
      res.status(500).json({ message: 'Failed to place order' });
    }
  } else {
    res.status(404).json({ message: 'Endpoint not found' });
  }
}
