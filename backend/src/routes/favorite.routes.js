const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const { authenticate } = require('../middlewares/auth');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET favorites (user)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        destination: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            category: true,
            province: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(favorites);
  } catch (error) {
    next(error);
  }
});

// POST add favorite
router.post('/', authenticate, [
  body('destinationId').trim().notEmpty().withMessage('destinationId không được để trống'),
], validate, async (req, res, next) => {
  try {
    const { destinationId } = req.body;

    const existing = await prisma.favorite.findUnique({
      where: { userId_destinationId: { userId: req.user.id, destinationId } },
    });

    if (existing) {
      return res.status(409).json({ error: 'Already in favorites' });
    }

    const favorite = await prisma.favorite.create({
      data: { userId: req.user.id, destinationId },
      include: {
        destination: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            category: true,
          },
        },
      },
    });

    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
});

// DELETE remove favorite
router.delete('/:destinationId', authenticate, async (req, res, next) => {
  try {
    await prisma.favorite.deleteMany({
      where: { userId: req.user.id, destinationId: req.params.destinationId },
    });
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
});

// CHECK if favorite
router.get('/check/:destinationId', authenticate, async (req, res, next) => {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_destinationId: { userId: req.user.id, destinationId: req.params.destinationId } },
    });
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
