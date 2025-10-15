# Epic 2: VOD Platform with Real-time Features & Analytics

> **Status**: DRAFT
> **Epic ID**: 2
> **Created**: 2025-10-07
> **Product Manager**: Morgan
> **Technical Architect**: Winston

---

## Epic Overview

### Vision Statement

Build a comprehensive Video-on-Demand (VOD) content management system with real-time user experience features and integrated analytics, positioning CSN as a modern sports streaming platform that rivals major competitors.

### Business Value

**Primary Goals:**
1. **Admin Empowerment**: Enable admins to create, manage, and publish VOD content efficiently
2. **User Engagement**: Provide Netflix-style "Continue Watching" and real-time live stream features
3. **Data-Driven Decisions**: Track user behavior securely through PostHog integration
4. **Competitive Advantage**: Real-time features (live chat, viewer counts) differentiate us from competitors

**Success Metrics:**
- Admin can upload and publish VOD content in < 5 minutes
- "Continue Watching" syncs across devices within 1 second
- Live stream viewer counts update in real-time (< 500ms latency)
- 100% of user interactions tracked securely via PostHog
- Zero exposed API keys on frontend

---

## Technical Context

### Architecture Foundation

This epic implements the **Convex Real-time Backend Strategy** documented in [`docs/CONVEX_ARCHITECTURE.md`](./CONVEX_ARCHITECTURE.md).

**Key Architectural Decisions:**
- ✅ Convex as single source of truth for operational data
- ✅ Real-time subscriptions for live features
- ✅ PostHog integration via Convex actions (security & enrichment)
- ✅ Minimal schema design for efficient CRUD operations

### Dependencies

**Completed Work:**
- ✅ Epic 1 - Admin Infrastructure (Stories 1.1, 1.2)
- ✅ Basic Convex schema with content, games, teams, players
- ✅ Admin authentication with Clerk
- ✅ Admin authorization framework

**External Integrations:**
- UploadThing (file uploads)
- PostHog (analytics)
- Clerk (authentication)
- Cloudflare Stream or HLS (video streaming - future)

---

## Stories in this Epic

### Story 1.3: Core Schema Implementation
**Priority**: P0 (Critical)
**Estimate**: 2-3 days
**Owner**: James (Developer)

**Summary**: Implement core schema tables for VOD content management and admin authorship tracking.

**Tables Added:**
- `media_assets` - VOD upload & management
- Enhanced `content` table - Admin authorship fields
- `content_audit_log` - Edit history tracking

**Acceptance Criteria:**
- [ ] All 3 tables defined in `convex/schema.ts`
- [ ] Proper indexes added for query optimization
- [ ] Migration strategy documented
- [ ] Schema passes type checking
- [ ] No breaking changes to existing queries

**Story File**: `docs/stories/1.3.core-schema-implementation.md`

---

### Story 1.4: Real-time Features Schema
**Priority**: P0 (Critical)
**Estimate**: 2-3 days
**Owner**: James (Developer)

**Summary**: Implement schema tables to support real-time user experience features.

**Tables Added:**
- `user_watch_progress` - Continue Watching sync
- `live_stream_sessions` - Active viewer tracking
- `live_chat_messages` - Real-time stream chat

**Acceptance Criteria:**
- [ ] All 3 tables defined in `convex/schema.ts`
- [ ] Indexes optimized for real-time queries
- [ ] Heartbeat pattern documented for session tracking
- [ ] Chat moderation status included
- [ ] Schema passes type checking

**Story File**: `docs/stories/1.4.realtime-features-schema.md`

---

### Story 1.5: Analytics Integration Layer
**Priority**: P1 (High)
**Estimate**: 1-2 days
**Owner**: James (Developer)

**Summary**: Create PostHog integration layer via Convex actions for secure, enriched analytics tracking.

**Components:**
- `convex/analytics.ts` - PostHog action layer
- Environment variable configuration
- Error handling & logging

**Key Events:**
- Video playback (play, pause, complete, seek)
- Content engagement (add to list, rate, share)
- Admin operations (create, publish, upload)

**Acceptance Criteria:**
- [ ] `convex/analytics.ts` created with all actions
- [ ] PostHog SDK integrated correctly
- [ ] Environment variables configured
- [ ] No API keys exposed to frontend
- [ ] Events include enriched metadata from Convex
- [ ] Error handling for failed events

**Story File**: `docs/stories/1.5.analytics-integration-layer.md`

---

### Story 1.6: CRUD Functions Implementation
**Priority**: P0 (Critical)
**Estimate**: 3-4 days
**Owner**: James (Developer)

**Summary**: Implement all CRUD functions for new schema tables following minimal code patterns.

**Scope:**
- Media Assets: create, read, update, delete (soft)
- Content: enhanced create/update with authorship
- Watch Progress: upsert, read by user
- Live Sessions: create, heartbeat update, cleanup
- Chat Messages: create, read with pagination, moderate
- Audit Log: create, read by entity

**Acceptance Criteria:**
- [ ] All CRUD functions follow existing patterns in `content.ts`
- [ ] Proper authorization checks using `requireAdminAuth()`
- [ ] Real-time subscriptions for live features
- [ ] Input validation on all mutations
- [ ] Audit logging for admin operations
- [ ] Comprehensive error handling
- [ ] Unit tests for critical functions

**Story File**: `docs/stories/1.6.crud-functions-implementation.md`

---

## Story Sequencing & Dependencies

```
Timeline: 2-3 Weeks Total

Week 1:
  Story 1.3 (Core Schema)          ████████░░
    │
    └──> Story 1.4 (Realtime Schema)   ████████░░
            │
            └──> Story 1.5 (Analytics)     ████░░

Week 2-3:
  Story 1.6 (CRUD Functions)       ████████████████

Dependencies:
  1.3 → 1.4 → 1.5 (Can run in parallel after 1.3)
  1.3, 1.4, 1.5 → 1.6 (Must complete schema before CRUD)
```

**Critical Path**: Story 1.3 → Story 1.6

**Parallel Work Opportunities**:
- Stories 1.4 and 1.5 can be developed concurrently after 1.3 is complete
- UI work can begin once Story 1.6 is done (future epic)

---

## Out of Scope (Deferred to Future Epics)

The following were considered but explicitly deferred:

### Deferred Features
- ❌ HLS/M3U8 transcoding automation (use direct UploadThing URLs for MVP)
- ❌ Media processing jobs tracking (simple status field sufficient)
- ❌ Hierarchical media folders (use string paths for MVP)
- ❌ Media playlists (curated highlight reels - future)
- ❌ Broadcast session analytics (detailed streaming metrics - future)
- ❌ Live reactions (emoji reactions during games - future)
- ❌ AI chat assistant (full conversational AI - future)
- ❌ Pre-computed analytics aggregations (PostHog handles this)

### Rationale for Deferral
These features add complexity without immediate user value. The refined schema design allows for easy addition of these features in future iterations based on actual user needs and usage patterns.

---

## Testing Strategy

### Unit Testing (Story 1.6)
- Test all CRUD functions with mock data
- Test authorization checks
- Test input validation
- Test error handling

### Integration Testing
- Test Convex ↔ PostHog integration
- Test real-time subscription updates
- Test cross-table queries
- Test admin workflows end-to-end

### Performance Testing
- Query latency < 100ms (p95)
- Mutation latency < 200ms (p95)
- Real-time update latency < 500ms
- Load test with 1000 concurrent subscriptions

### Security Testing
- Verify no PostHog keys exposed
- Test admin authorization on all mutations
- Test SQL injection resistance (Convex handles this)
- Verify audit logging captures all changes

---

## Risk Assessment

### High Risk ⚠️

**Risk**: Real-time features may not scale under load
**Mitigation**: Convex is designed for real-time at scale. Implement heartbeat cleanup jobs to remove stale sessions.

**Risk**: PostHog integration failures could lose analytics data
**Mitigation**: Implement retry logic and error logging. Analytics failures should not block user actions.

### Medium Risk ⚠️

**Risk**: Schema migrations could break existing functionality
**Mitigation**: Test thoroughly in dev environment. Add new tables without modifying existing ones.

**Risk**: Watch progress syncing could create race conditions
**Mitigation**: Use Convex mutations which are transactional. Implement last-write-wins strategy.

### Low Risk ✅

**Risk**: UploadThing upload failures
**Mitigation**: Standard error handling. UploadThing is a mature service.

---

## Success Criteria for Epic Completion

### Functional Requirements ✅
- [ ] All 6 new tables implemented in schema
- [ ] All CRUD functions working with minimal code
- [ ] PostHog integration sending enriched events
- [ ] Continue Watching feature syncs across devices
- [ ] Live viewer counts update in real-time
- [ ] Admin can upload and manage VOD content
- [ ] Audit log captures all admin actions

### Non-Functional Requirements ✅
- [ ] Query performance meets targets (< 100ms p95)
- [ ] Real-time latency meets targets (< 500ms)
- [ ] Zero API keys exposed to frontend
- [ ] 100% test coverage on critical paths
- [ ] Documentation complete (schema, CRUD patterns, PostHog integration)

### Business Requirements ✅
- [ ] Product demo ready for stakeholders
- [ ] Admin training materials prepared
- [ ] Analytics dashboards configured in PostHog
- [ ] Performance metrics baseline established

---

## Documentation Deliverables

1. ✅ **Architecture Documentation**: `docs/CONVEX_ARCHITECTURE.md`
2. ⏳ **Story Files**: `docs/stories/1.3.md` through `1.6.md`
3. ⏳ **Schema Documentation**: Updated `convex/schema.ts` with inline comments
4. ⏳ **CRUD Patterns Guide**: Examples in each function file
5. ⏳ **PostHog Event Catalog**: List of all tracked events and properties
6. ⏳ **Admin Guide Update**: How to use new VOD features

---

## Stakeholder Communication

### Sprint Reviews
- **Week 1**: Demo schema implementation + analytics integration
- **Week 3**: Demo full CRUD functionality + Continue Watching feature

### Key Stakeholders
- **Product Team**: Weekly updates on progress
- **Admin Users**: Training session after completion
- **Engineering Team**: Daily standups, code reviews

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-07 | 1.0 | Initial epic creation | Morgan (PM) |

---

## Next Steps

1. **Sarah (PO)** - Draft individual story files (1.3-1.6)
2. **Winston (Architect)** - Review schema designs in stories
3. **Quinn (QA)** - Create test plans for each story
4. **James (Developer)** - Begin Story 1.3 after Story 1.1 completion

---

**Epic Status**: DRAFT
**Ready for Refinement**: YES
**Ready for Development**: After story approval
