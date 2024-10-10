// pages/api/payloads/[id]/route.js
import connectDB from '../../../lib/mongodb';
import Payloads from '../../../models/Payloads';

export default async function handler(req, res) {
  await connectDB();

  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const payload = await Payloads.findOne({ id });
        if (!payload) {
          return res.status(404).json({ success: false, message: 'Payload not found' });
        }
        res.status(200).json(payload);
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    case 'PUT':
      try {
        const payload = await Payloads.findOneAndUpdate({ id }, req.body, {
          new: true,
          runValidators: true,
        });
        if (!payload) {
          return res.status(404).json({ success: false, message: 'Payload not found' });
        }
        res.status(200).json({ success: true, data: payload });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'DELETE':
      try {
        const deletedPayload = await Payloads.deleteOne({ id });
        if (!deletedPayload.deletedCount) {
          return res.status(404).json({ success: false, message: 'Payload not found' });
        }
        res.status(200).json({ success: true, message: 'Payload deleted' });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}