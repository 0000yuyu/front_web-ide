import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/authHandlers';
import { teamHandlers } from './handlers/teamHandlers';
import { questHandlers } from './handlers/questHandlers';
import { codeHandlers } from './handlers/codeHandlers';
import { userHandlers } from './handlers/userHandlers';

export const worker = setupWorker(
  ...authHandlers,
  ...teamHandlers,
  ...questHandlers,
  ...codeHandlers,
  ...userHandlers
);
