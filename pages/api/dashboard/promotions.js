// pages/api/dashboard/promotions.js
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      const { id } = req.query;

      if (id) {
        // Get single promotion
        const promotion = await prisma.savedPromotion.findUnique({
          where: { id },
        });

        if (!promotion) {
          return res.status(404).json({ message: 'Promotion not found' });
        }

        if (promotion.userId !== user.userId) {
          return res.status(403).json({ message: 'Forbidden' });
        }

        return res.status(200).json({ promotion });
      }

      // Get all promotions
      const promotions = await prisma.savedPromotion.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({ promotions });
    }

    if (req.method === 'POST') {
      const { name, imageData, mimeType, promotionType, analysis, notes } = req.body;

      if (!imageData) {
        return res.status(400).json({ message: 'Image data required' });
      }

      const promotion = await prisma.savedPromotion.create({
        data: {
          userId: user.userId,
          name: name || 'Untitled Promotion',
          imageData,
          mimeType: mimeType || 'image/png',
          promotionType,
          analysis: analysis || null,
          notes,
        },
      });

      return res.status(201).json({ promotion });
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, notes, analysis } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Promotion ID required' });
      }

      // Verify ownership
      const existing = await prisma.savedPromotion.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({ message: 'Promotion not found' });
      }

      if (existing.userId !== user.userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const promotion = await prisma.savedPromotion.update({
        where: { id },
        data: {
          name: name !== undefined ? name : existing.name,
          notes: notes !== undefined ? notes : existing.notes,
          analysis: analysis !== undefined ? analysis : existing.analysis,
        },
      });

      return res.status(200).json({ promotion });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'Promotion ID required' });
      }

      // Verify ownership
      const promotion = await prisma.savedPromotion.findUnique({
        where: { id },
      });

      if (!promotion) {
        return res.status(404).json({ message: 'Promotion not found' });
      }

      if (promotion.userId !== user.userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      await prisma.savedPromotion.delete({
        where: { id },
      });

      return res.status(200).json({ message: 'Promotion deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Promotions API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
