# CSN Admin Dashboard Design Specification

## Enhanced Sidebar Navigation

**Updated Navigation Structure:**
```
📊 Dashboard (Overview & Analytics)
🎮 Games & Scheduling
   ├── Live Games Management
   ├── Schedule Games
   └── Game Results & Stats
📺 Content Management
   ├── Shows & Series
   ├── Podcasts & Audio
   ├── Video Content
   └── Photo Gallery
📰 News & Articles
👥 Teams & Players
📈 Analytics & Reports
💬 Chat Moderation
👤 User Management
⚙️ Settings
```

## 1. Dashboard Overview Page

**Layout:** 4-column grid with key metrics cards + charts

**Top Row - Metrics Cards (using Card component):**
- Live Games Now (with live indicator)
- Total Scheduled Games This Week
- Active Shows/Podcasts
- Media Items Uploaded Today

**Second Row - Analytics Charts (using Chart component):**
- Weekly Viewership Trends (line chart)
- Popular Content Categories (pie chart)
- User Engagement Metrics (bar chart)
- Game Attendance vs Online Views (comparison chart)

**Third Row - Quick Actions Grid:**
- "Schedule New Game" (large button with calendar icon)
- "Upload Media" (drag-and-drop zone preview)
- "Create Show Episode" (quick form)
- "Publish News Article" (editor preview)

**Fourth Row - Recent Activity Feed:**
- Live activity table showing recent games, uploads, user signups

---

## 2. Game Scheduling Interface

**Main Layout:** Split view with calendar and form

**Left Panel - Calendar View (using Calendar component):**
- Monthly view with existing games marked
- Color coding: Live (red), Scheduled (blue), Completed (green)
- Click date to quick-schedule

**Right Panel - Game Form (using Form components):**
```
Game Details:
├── Sport (Select dropdown)
├── Home Team (Command component with search)
├── Away Team (Command component with search)
├── Date & Time (Calendar + time picker)
├── Venue (Input with autocomplete)
├── Description (Textarea)
└── Broadcast Settings (Switch toggles)
```

**Bottom Section - Scheduled Games Table:**
- Data table with sort/filter capabilities
- Actions: Edit, Cancel, Go Live, View Stats
- Bulk operations for multiple games

---

## 3. Shows & Podcasts Management

**Tab Interface (using Tabs component):**

**Tab 1: Shows Overview**
- Grid of show cards with thumbnails
- "Create New Show" button
- Filter by status: Active, Draft, Archived

**Tab 2: Episodes Management**
- Table with episodes list
- Columns: Show, Episode #, Title, Duration, Status, Views
- Quick actions: Edit, Publish, Archive

**Tab 3: Podcast Series**
- Similar to shows but podcast-focused
- Audio player preview in cards
- RSS feed management

**Episode Creation Form:**
```
Episode Details:
├── Show/Series (Select)
├── Episode Number (Input)
├── Title (Input)
├── Description (rich text editor)
├── Thumbnail Upload (file drop zone)
├── Video/Audio File (file upload with progress)
├── Tags (multi-select)
├── Scheduling (date/time picker)
└── Visibility Settings (radio group)
```

---

## 4. Media Content Management

**Three-Tab Layout:**

**Tab 1: Photo Gallery**
- Masonry grid layout of images
- Bulk upload with drag-and-drop
- Tagging and categorization
- Search and filter toolbar

**Tab 2: Video Library**
- Video cards with thumbnails and play buttons
- Upload progress indicators
- Video processing status
- Metadata editing forms

**Tab 3: Media Organization**
- Folder/album structure
- Batch operations (move, delete, tag)
- Storage usage analytics
- CDN management settings

**Upload Interface:**
- Large drag-and-drop zone
- Multiple file selection
- Upload progress bars
- Auto-tagging suggestions
- Bulk metadata editing

---

## 5. Enhanced Components Needed

**Custom Components to Build:**

1. **LiveGameCard** - Shows current game status with real-time updates
2. **MediaUploader** - Drag-and-drop with progress and preview
3. **ContentEditor** - Rich text editor for articles/descriptions
4. **ScheduleCalendar** - Enhanced calendar with game scheduling
5. **AnalyticsChart** - Wrapper around Chart component for sports data
6. **TeamSelector** - Command component with team logos and search
7. **StatusIndicator** - Live/scheduled/completed status badges
8. **BulkActions** - Toolbar for table bulk operations

**shadcn/ui Components to Leverage:**
- **Card** - For all content containers and metric displays
- **Table** - For data lists (games, episodes, media)
- **Form** - All creation and editing interfaces
- **Tabs** - Section organization
- **Command** - Search and selection interfaces
- **Calendar** - Game scheduling
- **Chart** - Analytics and metrics
- **Badge** - Status indicators
- **Progress** - Upload and processing indicators
- **Sheet** - Side panels for quick actions
- **Dialog** - Confirmation and detail modals
- **Dropdown Menu** - Action menus
- **Skeleton** - Loading states

## 6. Color Coding & Visual Hierarchy

**Status Colors:**
- Live: Red (destructive variant)
- Scheduled: Blue (default variant)
- Completed: Green (success variant)
- Draft: Yellow (warning variant)
- Archived: Gray (secondary variant)

**Layout Patterns:**
- Consistent 24px padding on all containers
- 16px gap between grid items
- 8px gap between form elements
- Responsive breakpoints: mobile-first approach

This design leverages your existing shadcn/ui components while creating a comprehensive, intuitive admin experience for managing sports content, scheduling, and media.