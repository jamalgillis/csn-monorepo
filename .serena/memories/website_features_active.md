# Active Website Features

## Public Pages (Currently Active)
- **Homepage** (`/`): Live sports hero, content sections
- **Games** (`/games`, `/games/[gameId]`): Game schedules, live games, game details
- **Schedule** (`/schedule`): Upcoming games calendar
- **Teams** (`/teams/[teamId]`): Team profiles and information  
- **Shows** (`/shows`, `/shows/[showId]`): Sports content/shows
- **Highlights** (`/highlights`): Game highlights and clips
- **News** (`/news`, `/news/[articleId]`): Sports news articles
- **Scores** (`/scores`): Live scores and results
- **Stats** (`/stats`): Statistics and analytics
- **Search** (`/search`): Content search functionality
- **Standings** (`/standings`): Team rankings/standings

## Authentication
- **Sign In/Up** (`/sign-in`, `/sign-up`): Clerk authentication

## Admin Panel (`/admin`)
- Admin dashboard for content management
- Sections: schedule, chat, news, users, teams, games, shows, stats

## Hidden/Disabled Features
- Breaking news ticker (hidden on homepage)
- Sports news section (hidden on homepage) 
- Game highlights section (hidden on homepage)
- Full games section (hidden on homepage)
- Navigation cards section (disabled with `{false &&`)