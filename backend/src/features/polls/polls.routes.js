import { Router } from 'express';

import { HttpError } from '../../lib/errors.js';

// Every route here runs behind requireAuth. Only the creator may edit or delete a poll.
const router = Router();
const todo = () => {
  throw new HttpError(501, 'Not implemented yet');
};

router.get('/', todo); //               polls I created or voted in
router.post('/', todo); //              create
router.get('/:id', todo); //            poll + comparison (via findSummariesByIds) + tallies
router.put('/:id', todo); //            update (creator only)
router.delete('/:id', todo); //         delete (creator only)
router.post('/:id/vote', todo); //      cast or change my one vote

export default router;
