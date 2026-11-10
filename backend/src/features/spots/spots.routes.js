import { Router } from 'express';

import { HttpError } from '../../lib/errors.js';

// Every route here runs behind requireAuth; scope all queries by req.user.id.
const router = Router();
const todo = () => {
  throw new HttpError(501, 'Not implemented yet');
};

router.get('/', todo); //        my lists
router.post('/', todo); //       create
router.get('/:id', todo); //     one list with restaurant summaries
router.put('/:id', todo); //     update (name, description, items + notes)
router.delete('/:id', todo); //  delete

export default router;
