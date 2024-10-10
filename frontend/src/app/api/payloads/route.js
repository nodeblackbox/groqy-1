// pages/api/payloads/route.js
import connectDB from '../../../lib/mongodb';
import Payloads from '../../../models/Payloads';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const payloads = await Payloads.find({});
        res.status(200).json(payloads);
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        const payload = new Payloads(req.body);
        await payload.save();
        res.status(201).json({ success: true, data: payload });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}