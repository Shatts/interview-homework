import { Router, Request, Response, NextFunction } from 'express';
const express = require('express');
const router: Router = express.Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  console.log('Hello World');
  res.send('Hello World');
});

module.exports = router;
