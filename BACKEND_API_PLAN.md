# Future Lens - Backend API Plan

## Current API Status

**Current Endpoint**: `https://api-h34hnr2j2nm2me2d.transferscope.org/`

**Current Implementation**:
- Single transformation endpoint
- Form data upload with image + parameters
- Parameters: `client_id`, `text` (prompt), `seed`, `denoise`, `redirect`
- Returns: JSON with `input`, `output`, `prompt`, `denoise`, `seed`

---

## Recommended Backend Enhancements

### 1. User Management & Authentication

#### Priority: Medium
Authentication would enable user-specific features like cloud storage, sharing, and cross-device sync.

**New Routes:**

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

**Request/Response Examples:**

```json
// POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "********",
  "name": "John Doe"
}

// Response
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Implementation Notes:**
- JWT tokens for authentication
- Optional: OAuth (Google, GitHub)
- Email verification for security
- Rate limiting on auth endpoints

---

### 2. Cloud History Storage

#### Priority: High
Allow users to backup and sync history across devices.

**New Routes:**

```
GET    /api/v1/history                    # List user's history
GET    /api/v1/history/:id                # Get specific history item
POST   /api/v1/history                    # Save history item
DELETE /api/v1/history/:id                # Delete history item
POST   /api/v1/history/sync               # Bulk sync from client
POST   /api/v1/history/export             # Generate export file
POST   /api/v1/history/import             # Import history data
```

**Request/Response Examples:**

```json
// POST /api/v1/history
{
  "input_hash": "abc123",
  "input_image_url": "https://...",
  "output_image_url": "https://...",
  "prompt": "futuristic cyberpunk city",
  "denoise": 0.85,
  "seed": 12345,
  "metadata": {
    "client": "web",
    "version": "1.0.0",
    "timestamp": "2025-01-01T00:00:00Z"
  }
}

// GET /api/v1/history?page=1&limit=50
{
  "items": [...],
  "total": 234,
  "page": 1,
  "pages": 5
}
```

**Storage Considerations:**
- Database: PostgreSQL or MongoDB for history metadata
- Object Storage: S3/R2/Backblaze for images
- Implement pagination (50 items per page)
- TTL for automatic cleanup of old items (configurable)

---

### 3. Transformation Queue & Job Management

#### Priority: High
Handle multiple transformations, queue management, and job status tracking.

**New Routes:**

```
POST   /api/v1/transformations            # Create new transformation job
GET    /api/v1/transformations/:job_id    # Get job status
GET    /api/v1/transformations            # List user's jobs
DELETE /api/v1/transformations/:job_id    # Cancel job
POST   /api/v1/transformations/batch      # Batch transformation
```

**Request/Response Examples:**

```json
// POST /api/v1/transformations
{
  "image": "base64_or_url",
  "prompt": "futuristic city",
  "denoise": 0.85,
  "seed": -1,
  "priority": "normal"  // normal, high
}

// Response
{
  "job_id": "job_abc123",
  "status": "queued",  // queued, processing, completed, failed
  "estimated_time": 30,  // seconds
  "queue_position": 3
}

// GET /api/v1/transformations/job_abc123
{
  "job_id": "job_abc123",
  "status": "completed",
  "progress": 100,
  "input_url": "https://...",
  "output_url": "https://...",
  "created_at": "2025-01-01T00:00:00Z",
  "completed_at": "2025-01-01T00:00:30Z",
  "metadata": {
    "prompt": "futuristic city",
    "denoise": 0.85,
    "seed": 42
  }
}
```

**Implementation:**
- Redis/RabbitMQ for queue management
- WebSocket for real-time status updates
- Background workers for processing
- Retry logic for failed jobs

---

### 4. Prompt Library & Templates

#### Priority: Medium
Server-side prompt management, sharing, and discovery.

**New Routes:**

```
GET    /api/v1/prompts                    # Browse public prompts
GET    /api/v1/prompts/featured           # Featured/curated prompts
GET    /api/v1/prompts/trending           # Trending prompts
GET    /api/v1/prompts/:id                # Get specific prompt
POST   /api/v1/prompts                    # Create custom prompt
PUT    /api/v1/prompts/:id                # Update prompt
DELETE /api/v1/prompts/:id                # Delete prompt
POST   /api/v1/prompts/:id/like           # Like a prompt
GET    /api/v1/prompts/categories         # List categories
```

**Request/Response Examples:**

```json
// GET /api/v1/prompts?category=futuristic&page=1
{
  "prompts": [
    {
      "id": "prompt_123",
      "text": "futuristic cyberpunk city with neon lights",
      "category": "futuristic",
      "likes": 42,
      "uses": 1337,
      "author": {
        "id": "user_456",
        "name": "John Doe"
      },
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 150,
  "page": 1
}

// POST /api/v1/prompts
{
  "text": "my custom prompt",
  "category": "futuristic",
  "tags": ["city", "neon", "cyberpunk"],
  "is_public": true
}
```

---

### 5. Image Management

#### Priority: High
Better image handling, transformations, and storage.

**New Routes:**

```
POST   /api/v1/images/upload              # Direct image upload
GET    /api/v1/images/:id                 # Get image metadata
DELETE /api/v1/images/:id                 # Delete image
GET    /api/v1/images/:id/thumbnail       # Get thumbnail
POST   /api/v1/images/:id/transform       # Apply transformations
GET    /api/v1/images/quota               # Get storage quota
```

**Request/Response Examples:**

```json
// POST /api/v1/images/upload
{
  "image": "base64_data",
  "filename": "input.jpg",
  "metadata": {
    "source": "camera",
    "original_size": 2048000
  }
}

// Response
{
  "id": "img_abc123",
  "url": "https://cdn.example.com/images/abc123.jpg",
  "thumbnail_url": "https://cdn.example.com/images/abc123_thumb.jpg",
  "size": 512000,
  "dimensions": {
    "width": 1024,
    "height": 1024
  },
  "format": "jpeg"
}

// GET /api/v1/images/quota
{
  "used": 52428800,      // 50MB
  "total": 1073741824,   // 1GB
  "percentage": 4.88,
  "remaining": 1021313024
}
```

**Features:**
- Automatic image optimization
- CDN integration for fast delivery
- Thumbnail generation
- Format conversion (JPEG, PNG, WebP)
- Quota management per user

---

### 6. Sharing & Collaboration

#### Priority: Medium
Enable users to share transformations and collaborate.

**New Routes:**

```
POST   /api/v1/share                      # Create share link
GET    /api/v1/share/:share_id            # Get shared content
DELETE /api/v1/share/:share_id            # Revoke share link
POST   /api/v1/share/:share_id/clone      # Clone shared transformation
GET    /api/v1/share/:share_id/stats      # View stats
```

**Request/Response Examples:**

```json
// POST /api/v1/share
{
  "transformation_id": "job_abc123",
  "expiration": "7d",  // 1h, 24h, 7d, 30d, never
  "allow_clone": true,
  "password": "optional_password"
}

// Response
{
  "share_id": "share_xyz789",
  "url": "https://future-lens.app/s/xyz789",
  "expires_at": "2025-01-08T00:00:00Z",
  "views": 0
}

// GET /api/v1/share/xyz789
{
  "share_id": "share_xyz789",
  "input_image": "https://...",
  "output_image": "https://...",
  "prompt": "futuristic city",
  "denoise": 0.85,
  "created_by": "John Doe",
  "created_at": "2025-01-01T00:00:00Z",
  "views": 42,
  "allow_clone": true
}
```

---

### 7. Analytics & Statistics

#### Priority: Low
Track usage and provide insights to users.

**New Routes:**

```
GET    /api/v1/analytics/user             # User's personal stats
GET    /api/v1/analytics/prompts          # Prompt usage stats
GET    /api/v1/analytics/trends           # Platform trends
GET    /api/v1/analytics/popular          # Popular transformations
```

**Request/Response Examples:**

```json
// GET /api/v1/analytics/user
{
  "total_transformations": 156,
  "total_images_generated": 342,
  "favorite_prompts": [
    {
      "prompt": "futuristic city",
      "uses": 23
    }
  ],
  "average_denoise": 0.82,
  "most_active_day": "Monday",
  "member_since": "2024-06-01T00:00:00Z",
  "storage_used": 52428800
}
```

---

### 8. Webhooks & Notifications

#### Priority: Low
Real-time updates and integrations.

**New Routes:**

```
POST   /api/v1/webhooks                   # Register webhook
GET    /api/v1/webhooks                   # List webhooks
DELETE /api/v1/webhooks/:id               # Delete webhook
GET    /api/v1/notifications              # Get notifications
POST   /api/v1/notifications/:id/read     # Mark as read
```

**Webhook Events:**
- `transformation.completed`
- `transformation.failed`
- `quota.warning`
- `quota.exceeded`
- `share.viewed`

---

### 9. Advanced Parameters & Models

#### Priority: Medium
Expose more control over transformation parameters.

**Enhanced Transformation Endpoint:**

```
POST   /api/v1/transformations/advanced
```

**Request:**
```json
{
  "image": "base64_or_url",
  "prompt": "futuristic city",
  "negative_prompt": "blur, distortion",
  "parameters": {
    "denoise": 0.85,
    "seed": -1,
    "steps": 30,              // inference steps
    "guidance_scale": 7.5,    // prompt adherence
    "image_strength": 0.8,
    "model": "sd-xl-1.0",     // model selection
    "scheduler": "dpm++",
    "clip_skip": 2
  },
  "output": {
    "format": "jpeg",         // jpeg, png, webp
    "quality": 95,
    "width": 1024,
    "height": 1024
  }
}
```

---

### 10. Rate Limiting & Quotas

#### Priority: Critical
Protect backend resources and implement fair usage.

**HTTP Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
X-Quota-Used: 52428800
X-Quota-Total: 1073741824
```

**Rate Limits (Examples):**
- Free tier: 10 transformations/hour, 100/day
- Pro tier: 100 transformations/hour, unlimited/day
- Image uploads: 20MB max per image
- Storage: 1GB free, 50GB pro

**New Routes:**
```
GET    /api/v1/limits                     # Get current limits
GET    /api/v1/limits/usage               # Usage statistics
```

---

## API Versioning

All new endpoints should be versioned (`/api/v1/`). This allows:
- Backward compatibility
- Gradual deprecation of old endpoints
- Clear upgrade paths

---

## Authentication & Security

### Recommendations:

1. **JWT Tokens**
   - Access token (15 min expiry)
   - Refresh token (7 days expiry)
   - Secure HTTP-only cookies

2. **API Keys** (for external integrations)
   ```
   Authorization: Bearer api_key_abc123xyz
   ```

3. **Rate Limiting**
   - IP-based for anonymous users
   - User-based for authenticated users
   - Exponential backoff for repeated violations

4. **CORS Configuration**
   ```
   Access-Control-Allow-Origin: https://future-lens.app
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
   Access-Control-Allow-Headers: Authorization, Content-Type
   ```

---

## WebSocket Support

For real-time updates (job progress, notifications):

```
wss://api.future-lens.app/ws

// Connection
ws.send(JSON.stringify({
  type: "subscribe",
  channel: "transformations",
  job_id: "job_abc123"
}))

// Server messages
{
  "type": "transformation.progress",
  "job_id": "job_abc123",
  "progress": 45,
  "eta": 15
}

{
  "type": "transformation.completed",
  "job_id": "job_abc123",
  "output_url": "https://..."
}
```

---

## Database Schema Recommendations

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  avatar_url TEXT,
  tier VARCHAR(50) DEFAULT 'free',
  storage_quota BIGINT DEFAULT 1073741824, -- 1GB
  storage_used BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Transformations Table
```sql
CREATE TABLE transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  input_hash VARCHAR(255),
  input_image_url TEXT,
  output_image_url TEXT,
  prompt TEXT,
  negative_prompt TEXT,
  denoise DECIMAL(3,2),
  seed INTEGER,
  status VARCHAR(50),
  progress INTEGER DEFAULT 0,
  parameters JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_transformations_user_id ON transformations(user_id);
CREATE INDEX idx_transformations_status ON transformations(status);
CREATE INDEX idx_transformations_input_hash ON transformations(input_hash);
```

### Prompts Table
```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  text TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  is_public BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  uses INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_prompts_category ON prompts(category);
CREATE INDEX idx_prompts_user_id ON prompts(user_id);
```

---

## Implementation Priority

### Phase 1: Core Backend (Weeks 1-4)
1. ✅ User authentication & registration
2. ✅ Cloud history storage
3. ✅ Enhanced transformation endpoint
4. ✅ Image management & storage
5. ✅ Rate limiting & quotas

### Phase 2: Features (Weeks 5-8)
6. ✅ Queue management & job tracking
7. ✅ Prompt library (server-side)
8. ✅ WebSocket for real-time updates
9. ✅ Sharing & public links

### Phase 3: Advanced (Weeks 9-12)
10. ✅ Analytics & statistics
11. ✅ Webhooks
12. ✅ Advanced model parameters
13. ✅ Batch processing

---

## Cost Considerations

### Storage
- Images: ~500KB average per transformation
- 1000 users × 100 images = ~50GB storage
- Cost: $1-5/month (S3/Backblaze B2)

### Compute
- GPU instances for transformation (if self-hosted)
- Alternative: Use existing API, add queue/management layer
- Cost: $0.50-2.00 per 1000 transformations

### Database
- PostgreSQL managed service
- Cost: $10-50/month (depends on scale)

### CDN
- CloudFlare (free tier sufficient for start)
- Paid: $20-100/month for bandwidth

**Total estimated monthly cost**: $50-200 for 1000-10000 users

---

## Technology Stack Recommendations

### Backend Framework
- **Node.js + Express** (JavaScript/TypeScript)
- **FastAPI** (Python) - Good for ML integration
- **Go + Gin** (High performance)

### Database
- **PostgreSQL** - Primary database
- **Redis** - Caching & queue
- **S3/R2** - Object storage

### Deployment
- **Docker + Kubernetes**
- **Vercel/Railway** (for quick start)
- **AWS/Google Cloud** (for scale)

---

## Migration Strategy

### Step 1: Add New API (Weeks 1-2)
- Deploy new API alongside existing
- Keep current endpoint functional
- Frontend calls both APIs during transition

### Step 2: Client Updates (Weeks 3-4)
- Update frontend to use new endpoints
- Feature flags for gradual rollout
- Monitor error rates

### Step 3: Deprecation (Weeks 5-8)
- Mark old endpoint as deprecated
- Set sunset date (3-6 months notice)
- Redirect traffic to new API

### Step 4: Decommission (Month 6)
- Remove old endpoint
- Clean up legacy code
- Complete migration

---

## Success Metrics

- **Uptime**: 99.9%
- **Response Time**: P95 < 200ms (API), < 30s (transformations)
- **Error Rate**: < 0.1%
- **User Satisfaction**: > 4.5/5 stars
- **Storage Efficiency**: < $0.10 per user/month

---

## Next Steps

1. **Review & Prioritize**: Discuss with team which features are most valuable
2. **Prototype**: Build MVP with auth + cloud storage
3. **Test**: Alpha test with 10-50 users
4. **Iterate**: Gather feedback and improve
5. **Scale**: Deploy to production with monitoring

