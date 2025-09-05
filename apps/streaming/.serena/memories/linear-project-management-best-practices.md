# Linear Project Management Best Practices - CSN

## 🎯 Issue Structure & Naming Conventions

### Epic-Level Issues (Parent Issues)
- **Naming:** Prefix with "Epic:" (e.g., "Epic: Authentication System")
- **Scope:** Broad feature areas spanning multiple sprints/weeks
- **Purpose:** Container for related stories and tasks
- **Parent:** Usually project-level or null for standalone epics

### Story-Level Issues (Child Issues)
- **Naming:** Specific, actionable titles (e.g., "User Login Page - Form & Validation")
- **Scope:** Implementable features completable in one sprint
- **Purpose:** Deliverable functionality with clear acceptance criteria
- **Parent:** Link to relevant epic

### Task-Level Issues (Grandchild Issues)
- **Naming:** Technical and specific (e.g., "Set up Stripe SDK Integration")
- **Scope:** 1-3 days of focused work
- **Purpose:** Implementation details, bug fixes, technical debt
- **Parent:** Link to relevant story

## 📋 Required Fields & Best Practices

### Status Management
- **Triage → Todo:** Review and groom issues before starting work
- **Todo → In Progress:** Mark when actively working (limit WIP)
- **In Progress → In Review:** Code review stage
- **In Review → Done:** Completed and verified
- **Update Status Frequently:** Don't let issues sit in wrong status

### Priority Assignment Strategy
1. **Urgent (P1):** Blocking dependencies, critical path items
2. **High (P2):** Important features for current milestone
3. **Medium (P3):** Standard features for upcoming milestones  
4. **Low (P4):** Nice-to-have, technical debt, future considerations

### Estimates Guidelines
- **S (Small):** 1-2 days - Simple components, bug fixes
- **M (Medium):** 3-5 days - Feature components, API endpoints
- **L (Large):** 1-2 weeks - Complex features, system integration
- **XL:** Should be broken down into smaller issues

### Labels Usage
- **Feature:** New functionality being built
- **Improvement:** Enhancement to existing features
- **Task:** Planning, setup, technical work
- **Bug:** Issues with existing functionality
- **Documentation:** Docs, specs, architectural decisions

## 📝 Issue Description Standards

### Required Sections for Stories
```markdown
## Acceptance Criteria
- [ ] User can perform X action
- [ ] System validates Y input
- [ ] Error handling for Z scenario

## Implementation Details
- Files: `src/components/Example.tsx`
- Dependencies: Authentication system
- API endpoints: POST /api/example

## Technical Requirements
- Responsive design required
- Accessibility compliance
- Performance: <200ms response time

## Definition of Done
- [ ] Code implemented and tested
- [ ] Unit tests added
- [ ] Documentation updated
- [ ] Peer review completed
```

### Required Sections for Epics
```markdown
## Epic Overview
Brief description of the feature area and business value

## Success Metrics
- User adoption target: X%
- Performance target: <Xms
- Business impact: X conversion

## Child Stories
- [ ] Story 1: Login functionality
- [ ] Story 2: Profile management
- [ ] Story 3: Password recovery

## Dependencies
- Authentication service
- User database schema
- Frontend components
```

## 🔧 Project-Specific Improvements Needed

### CSN Website Redesign Project Actions
1. **Status Updates Required:**
   - CSN-15 through CSN-21: Change from "Triage" to "Done"
   - CSN-4 (Develop UI): Change to "Done" (all children completed)
   - CSN-19 (Authentication): Already implemented, should be "Done"

2. **Missing Story Issues to Create:**
   - Movies Page Implementation (`src/app/movies/page.tsx`)
   - TV Shows Page Implementation (`src/app/tv-shows/page.tsx`)
   - User Profile Page (`src/app/profile/page.tsx`)
   - Style Guide Page (`src/app/style-guide/page.tsx`)

3. **Title Improvements:**
   - CSN-4: "Epic: UI Development & Component System"
   - CSN-5: "Epic: Premium Functionality & User Features"
   - CSN-9: "Epic: Backend Services & APIs"

4. **Add Acceptance Criteria:**
   - All story-level issues need acceptance criteria
   - Include technical requirements and definition of done
   - Add performance targets where applicable

## 🚀 Workflow Integration

### Git Branch Naming
- Linear auto-generates: `username/issue-id-title-slug`
- Keep titles concise for cleaner branch names
- Example: `jamalgillis/csn-24-user-authentication-middleware`

### PR/Commit References
- Include issue ID in commit messages: "CSN-24: Add user authentication middleware"
- Link PRs to Linear issues for automatic status updates
- Use Linear's GitHub integration for seamless tracking

### Sprint Planning
- Use Linear cycles for sprint planning
- Group related issues in same cycle
- Balance story points across team capacity
- Review and update priorities weekly

## 📊 Regular Maintenance Tasks

### Weekly Review Checklist
- [ ] Update all issue statuses to reflect actual progress
- [ ] Review and adjust priorities based on business needs
- [ ] Ensure epics have up-to-date child issue lists
- [ ] Archive or close completed issues
- [ ] Break down large issues that are blocking progress

### Monthly Cleanup
- [ ] Review project structure and epic hierarchy
- [ ] Update estimates based on actual completion times
- [ ] Clean up stale labels and unused tags
- [ ] Document lessons learned and process improvements

## 🎯 Success Metrics

### Project Health Indicators
- Issues have accurate status (not stuck in "Triage")
- Clear parent-child hierarchy with logical grouping
- Consistent use of estimates and priorities
- Regular updates and forward progress
- Good balance of issue types (not all epics, not all tasks)

### Team Productivity Indicators  
- Issues move through workflow stages predictably
- Minimal time spent in "In Review" status
- Low number of issues returning to previous status
- Clear understanding of current priorities across team

---

**Last Updated:** August 2025
**Next Review:** When creating new issues or during sprint planning