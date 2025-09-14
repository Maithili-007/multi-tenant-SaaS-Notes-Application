# Multi-Tenant SaaS Notes Application

A secure multi-tenant notes application where multiple companies can manage their users and notes independently with role-based access and subscription limits.

## Chosen Approach

### Multi-Tenancy Strategy
I chose a **shared database with tenant isolation** approach using a `tenant_id` field in all collections. This ensures:
- All tenants share one MongoDB database
- Data is automatically filtered by tenant through middleware
- Cost-effective and simple to maintain
- Complete data isolation between tenants

### Technology Stack
- **Frontend:** React.js with custom css
- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **Authentication:** JWT tokens
- **Deployment:** Vercel

### Key Features
- **Authentication:** JWT-based login with role validation
- **Roles:** Admin (invite users, upgrade plans) and Member (manage notes only)
- **Subscription Plans:** Free (3 notes max) and Pro (unlimited)
- **CRUD Operations:** Full notes management with tenant isolation

## Security
- JWT authentication for all protected routes
- Automatic tenant filtering on all database queries
- Role-based access control
- Password hashing with bcrypt

## API Endpoints

- `POST /auth/login` - User login
- `GET /health` - Health check
- `POST /notes` - Create note
- `GET /notes` - List notes
- `GET /notes/:id` - Get specific note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note
- `POST /tenants/:slug/upgrade` - Upgrade subscription (Admin only)

## Test Accounts
All use password: `password`

| Email | Role | Tenant |
|-------|------|---------|
| admin@acme.test | Admin | Acme |
| user@acme.test | Member | Acme |
| admin@globex.test | Admin | Globex |
| user@globex.test | Member | Globex |

## Testing Conveniences

### Pre-seeded Data
- Both Acme and Globex tenants come with **3 notes already created**
- This allows immediate testing of the note limit enforcement
- When attempting to create a 4th note, users will see the upgrade prompt

### Easy Login Interface
- **One-click test account selection** on the login page
- Click any test account button to auto-fill email and password
- No manual typing required for evaluation

### Ready to Test
1. Visit the frontend URL
2. Click any test account button on login page
3. Explore notes, try creating a 4th note
4. Test different roles and tenants

## Live URLs
- Frontend: https://multi-tenant-saa-s-notes-applicatio-flax.vercel.app/
- Backend: https://multi-tenant-saa-s-notes-applicatio-rust.vercel.app/
- Health: https://multi-tenant-saa-s-notes-applicatio-rust.vercel.app/health