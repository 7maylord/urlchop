import { Router } from 'express';
import path from 'path';

const router = Router();

// Serve the Postman collection JSON file
router.get('/api-docs', (req, res) => {
  res.sendFile(path.join(__dirname, '../postman_collection.json'));
});

export default router;
