# SeedIQ Firestore Security Specification (Phase 0)

## 1. Data Invariants

1. **Zero Public PII & Strict Owner Isolation**: Every user document (`/users/{userId}`) and all subcollections (`/goals`, `/notes`, `/threads`, `/threads/{threadId}/messages`, `/flashcards`, `/quizAttempts`, `/activityDays`) belong strictly to `{userId}`. Only an authenticated user with `request.auth.uid == userId` can read or mutate their own data.
2. **Email Verification Enforcement**: Every write operation (`create`, `update`, `delete`) requires `request.auth.token.email_verified == true`.
3. **Master Gate Relational Integrity**:
   - Subcollections under `/users/{userId}` require the parent `/users/{userId}` document to exist (`existsAfter` on `create` so atomic initial workspace seeding batches succeed; `exists` on `get`/`update`/`delete`).
   - `/users/{userId}/threads/{threadId}/messages/{messageId}` requires the parent `/users/{userId}/threads/{threadId}` thread document to exist (`existsAfter` on `create`, `exists` on `get`/`update`/`delete`).
   - Every subcollection document stores `userId == request.auth.uid`, and `userId` and `id` are immutable after creation.
4. **Temporal Integrity**: `createdAt` / `serverCreatedAt` on `create` must equal `request.time` and remain immutable thereafter; `updatedAt` / `serverUpdatedAt` on `update` must equal `request.time`.
5. **Bounded Arrays & Strict String Size Limits**:
   - All path IDs (`userId`, `goalId`, `noteId`, `threadId`, `messageId`, `cardId`, `attemptId`, `dateId`) pass `isValidId()` (`^[a-zA-Z0-9_\-]+$`, `<= 128` chars).
   - Every string field enforces strict `.size()` bounds matching `firebase-blueprint.json` (e.g., `title <= 120`/`140`, `content <= 20000`, `bio <= 300`, `email <= 160`).
   - Arrays (`milestones <= 30`, `tags <= 10`) are strictly bounded and checked for element type safety (`size() == 0 || list[0] is map/string`).
   - No raw base64 images are stored in Firestore `ChatMessage` documents (only `hasImage: bool`), preventing 1MB document exhaustion.
6. **No Shadow Fields & Action-Based Updates**: Every `create` checks `keys().hasAll(...) && keys().hasOnly(...)` and every `update` uses `isValid[Entity](incoming())` plus explicit `affectedKeys().hasOnly(...)` action branches.
7. **Secure List Queries**: Every `allow list` verifies `isOwner(userId) && resource.data.userId == request.auth.uid` without calling `get()` or `exists()`.

## 2. The "Dirty Dozen" Adversarial Payloads

| # | Target Collection | Attack Vector | Expected Rule Result |
|---|-------------------|---------------|----------------------|
| 1 | `/users/{otherUid}` | Cross-user `get` or `create` (`request.auth.uid != userId`) | `PERMISSION_DENIED` |
| 2 | `/users/{uid}` | Unverified email (`email_verified == false`) attempting `create` | `PERMISSION_DENIED` |
| 3 | `/users/{uid}` | Shadow/ghost field injection (`{ ..., isAdmin: true }`) on `create` or `update` | `PERMISSION_DENIED` |
| 4 | `/users/{uid}` | Client-spoofed `createdAt` (`new Date('2020-01-01') != request.time`) | `PERMISSION_DENIED` |
| 5 | `/users/{uid}/goals/{id}` | ID poisoning (`goalId` with 200+ chars or invalid chars like `bad$id`) | `PERMISSION_DENIED` |
| 6 | `/users/{uid}/goals/{id}` | Ownership spoofing (`userId: 'other-uid'` inside doc payload) | `PERMISSION_DENIED` |
| 7 | `/users/{uid}/goals/{id}` | Resource exhaustion (`milestones` array length > 30 or string > maxLength) | `PERMISSION_DENIED` |
| 8 | `/users/{uid}/notes/{id}` | Invalid tag array (`tags[0]` is a number instead of string, or `tags.size() > 10`) | `PERMISSION_DENIED` |
| 9 | `/users/{uid}/notes/{id}` | Immutable field mutation (`userId` or `serverCreatedAt` changed on `update`) | `PERMISSION_DENIED` |
| 10 | `/users/{uid}/threads/{tid}/messages/{mid}` | Orphaned message `create` when parent thread does not exist (`!existsAfter(thread)`) | `PERMISSION_DENIED` |
| 11 | `/users/{uid}/threads/{tid}/messages/{mid}` | Illegal `update` or `image` shadow field injection on immutable chat message | `PERMISSION_DENIED` |
| 12 | `/users/{uid}/quizAttempts/{id}` | Negative or impossible score (`correct > total` or `percentage: 999`) | `PERMISSION_DENIED` |
