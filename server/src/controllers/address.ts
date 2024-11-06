import { Response } from 'express';
import { Address } from '../models/Address';
import { AuthRequest } from '../middleware/auth';

export const addressController = {
  // Create a new address
  async createAddress(req: AuthRequest, res: Response): Promise<void> {
    try {
      const address = new Address({
        ...req.body,
        userId: req.user._id
      });
      
      await address.save();
      res.status(201).json(address);
    } catch (error) {
      res.status(400).json({ 
        error: 'Failed to create address',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get all addresses for a user
  async getAddresses(req: AuthRequest, res: Response): Promise<void> {
    try {
      const addresses = await Address.find({ 
        userId: req.user.role === 'admin' ? req.query.userId || req.user._id : req.user._id 
      });
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch addresses',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Update an address
  async updateAddress(req: AuthRequest, res: Response): Promise<void> {
    try {
      const address = await Address.findOneAndUpdate(
        { 
          _id: req.params.id,
          userId: req.user.role === 'admin' ? req.query.userId || req.user._id : req.user._id
        },
        req.body,
        { new: true, runValidators: true }
      );

      if (!address) {
        res.status(404).json({ error: 'Address not found' });
        return;
      }

      res.json(address);
    } catch (error) {
      res.status(400).json({ 
        error: 'Failed to update address',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Delete an address
  async deleteAddress(req: AuthRequest, res: Response): Promise<void> {
    try {
      const address = await Address.findOneAndDelete({ 
        _id: req.params.id,
        userId: req.user.role === 'admin' ? req.query.userId || req.user._id : req.user._id
      });

      if (!address) {
        res.status(404).json({ error: 'Address not found' });
        return;
      }

      res.json({ message: 'Address deleted successfully' });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to delete address',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Admin only: Get all addresses in the system
  async getAllAddresses(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (req.user.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
      }

      const addresses = await Address.find().populate('userId', 'name email');
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch addresses',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};