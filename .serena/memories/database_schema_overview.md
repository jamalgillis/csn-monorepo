# Database Schema Overview

## Core Sports Tables
- **sports**: Sport definitions (volleyball, basketball, etc.)
- **teams**: College/team information with location data  
- **players**: Player profiles with career stats
- **games**: Game schedules, results, live state
- **game_events**: Play-by-play events during live games
- **game_states**: Current live game state for fast queries

## Sports Content Tables  
- **content**: Main content table (shows, highlights, clips, features)
- **tv_seasons**: TV show seasons
- **tv_episodes**: Individual episodes
- **tags**: Content categorization

## User & Social Tables
- **users**: User profiles with Clerk authentication
- **watchlist**: User saved content
- **content_ratings**: User ratings (up/down votes)

## Blog/News Tables
- **blog_posts**: News articles and blog posts
- **blog_categories**: Article categories
- **blog_tags**: Article tags  
- **blog_comments**: User comments on posts
- **blog_subscribers**: Newsletter subscriptions

## Relationship Tables
- **team_sports**: Many-to-many teams ↔ sports
- **player_sports**: Sport-specific player info
- **player_season_stats**: Player statistics per season
- **player_milestones**: Career achievements

## Analytics/Tracking Tables
- **analytics_events**: User interaction tracking (appears unused)
- **viewing_history**: Content viewing history (appears unused)