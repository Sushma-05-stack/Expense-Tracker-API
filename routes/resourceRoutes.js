const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// Mock Third-Party SDK Initialization
class ThirdPartySDK {
  constructor({ apiKey }) {
    this.apiKey = apiKey;
  }
  async createExternalResource(data) {
    // Simulating an external API call delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return { id: `ext_${Math.floor(Math.random() * 100000)}`, ...data };
  }
}
const client = new ThirdPartySDK({ apiKey: process.env.API_KEY });

// CREATE a resource
router.post('/', async (req, res) => {
  try {
    const { name, description, status } = req.body;
    
    // 1. Call the third-party SDK securely on the backend
    const externalResponse = await client.createExternalResource({ name, description });
    
    // 2. Save the new resource to the database with the externalId
    const newResource = new Resource({
      name,
      description,
      status,
      externalId: externalResponse.id
    });
    
    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a resource
router.put('/:id', async (req, res) => {
  try {
    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedResource) return res.status(404).json({ message: 'Resource not found' });
    res.status(200).json(updatedResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a resource
router.delete('/:id', async (req, res) => {
  try {
    const deletedResource = await Resource.findByIdAndDelete(req.params.id);
    if (!deletedResource) return res.status(404).json({ message: 'Resource not found' });
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
