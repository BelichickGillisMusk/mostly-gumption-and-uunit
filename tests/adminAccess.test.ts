import assert from 'node:assert/strict';
import { canAccessOwnerAdmin } from '../src/adminAccess';

assert.equal(canAccessOwnerAdmin('1225'), true, 'accepts the owner/admin password');
assert.equal(canAccessOwnerAdmin(' 1225 '), true, 'trims surrounding whitespace');
assert.equal(canAccessOwnerAdmin('1224'), false, 'rejects an incorrect password');
assert.equal(canAccessOwnerAdmin(''), false, 'rejects an empty password');
assert.equal(canAccessOwnerAdmin(null), false, 'rejects a cancelled prompt');

console.log('admin access password checks passed');
