# Planning Guide

A retro-futuristic video theater platform that presents curated tech documentaries alongside a continuously streaming feed of computing history facts about IBM, Apple, Microsoft, Steve Jobs, early computing, and 1984.

**Experience Qualities**:
1. **Cinematic** - Immersive theater-like viewing experience with atmospheric presentation
2. **Nostalgic** - Evokes 1980s computing aesthetic with retro-futuristic design elements
3. **Educational** - Seamlessly delivers fascinating tech history while entertaining

**Complexity Level**: Light Application (multiple features with basic state)
The app combines video playback, fact streaming, and queue management with persistent state for bookmarks and queue items.

## Essential Features

### Video Player
- **Functionality**: Embedded video player with full controls for theater presentation
- **Purpose**: Primary content delivery mechanism for tech documentaries
- **Trigger**: Auto-loads on app initialization with default video
- **Progression**: User lands on page → Video player visible and ready → User plays/pauses/seeks → Video plays in theater mode
- **Success criteria**: Video loads reliably, controls are intuitive, theater presentation feels immersive

### Facts Feed
- **Functionality**: Continuously rotating display of computing history facts with smooth transitions
- **Purpose**: Provides educational context and entertainment during viewing
- **Trigger**: Auto-starts on page load, cycles through facts automatically
- **Progression**: App loads → Facts begin auto-rotating every 8 seconds → User can manually advance → Smooth fade transitions between facts
- **Success criteria**: Facts are readable, transitions are smooth, timing feels natural, content is accurate

### Video Queue System
- **Functionality**: Add custom video URLs to a queue list with persistence
- **Purpose**: Allows users to curate their own playlist of computing documentaries
- **Trigger**: User clicks "+" button to open add dialog
- **Progression**: User clicks + → Dialog opens with URL input → User pastes video URL → Submits → Video appears in queue list → User can select to play or remove
- **Success criteria**: URLs persist between sessions, queue is easily manageable, videos load from custom URLs

### Queue Management
- **Functionality**: View, select, and remove videos from personal queue
- **Purpose**: Navigate between different videos and manage collection
- **Trigger**: Queue panel always visible
- **Progression**: User views queue → Clicks video to play → Video loads in main player → User can remove items with delete button
- **Success criteria**: Queue operations are instant, current video is highlighted, removals are smooth

## Edge Case Handling
- **Empty Queue**: Show helpful empty state with "Add video" prompt
- **Invalid URLs**: Validate video URL format before adding to queue
- **Long Fact Text**: Truncate or scroll very long facts to maintain layout
- **Rapid Navigation**: Debounce fact transitions if user rapidly clicks
- **Missing Video**: Show error state if embedded video fails to load

## Design Direction
The design should evoke a 1980s computer terminal meets retro cinema aesthetic - think neon glows, scan lines, phosphor green, amber CRT monitors, and early GUI interfaces. The interface should feel like a secret computing museum theater from an alternate 1984 where technology advanced with more style.

## Color Selection
A vibrant retro-tech palette inspired by early CRT monitors and 1980s computing interfaces.

- **Primary Color**: Electric Cyan (oklch(0.75 0.15 210)) - Evokes IBM blue and classic terminal displays, represents the digital/computing theme
- **Secondary Colors**: 
  - Deep Space (oklch(0.15 0.02 270)) - Dark backgrounds reminiscent of CRT screens
  - Terminal Green (oklch(0.68 0.15 145)) - Classic phosphor monitor green for accents
- **Accent Color**: Hot Magenta (oklch(0.65 0.25 340)) - Vibrant 80s energy for CTAs and highlights, creates striking contrast
- **Foreground/Background Pairings**: 
  - Primary text on Deep Space (oklch(0.92 0.01 210) on oklch(0.15 0.02 270)) - Ratio 12.8:1 ✓
  - Hot Magenta on Deep Space (oklch(0.65 0.25 340) on oklch(0.15 0.02 270)) - Ratio 5.2:1 ✓
  - Electric Cyan on Deep Space (oklch(0.75 0.15 210) on oklch(0.15 0.02 270)) - Ratio 6.8:1 ✓

## Font Selection
Typography should balance retro computing aesthetics with modern readability, mixing monospace code-style fonts with clean geometric sans-serifs.

- **Typographic Hierarchy**:
  - H1 (Theater Title): Space Grotesk Bold/48px/tight tracking/uppercase
  - H2 (Section Headers): Space Grotesk Semibold/24px/normal tracking
  - Body (Facts): JetBrains Mono Regular/16px/relaxed leading
  - UI Labels: Space Grotesk Medium/14px/wide tracking/uppercase
  - Timestamps: JetBrains Mono Regular/12px/tabular numbers

## Animations
Subtle but purposeful - focus on smooth fact transitions using fade effects and gentle slide animations. Video player controls should have satisfying micro-interactions. The overall feel should be analog warmth meeting digital precision - nothing too rapid or jarring, maintaining the contemplative theater atmosphere.

## Component Selection
- **Components**:
  - Card: For video player container and facts display panel with custom dark styling
  - Button: Primary actions (play, add) with hover glow effects
  - Dialog: For adding new video URLs to queue
  - Input: URL entry field with cyber-aesthetic styling
  - ScrollArea: For facts feed and queue list with custom scrollbar
  - Separator: Dividing sections with neon accent lines
- **Customizations**:
  - Custom video embed component with aspect ratio preservation
  - Animated fact display with auto-rotation timer
  - Queue item component with thumbnail placeholder and metadata
- **States**:
  - Buttons: Default (subtle glow), Hover (bright glow), Active (pulsing glow), Disabled (dimmed)
  - Inputs: Default (faint border), Focus (bright cyan border glow), Error (magenta border)
  - Queue items: Default, Hover (highlighted), Active/Playing (bright border)
- **Icon Selection**:
  - Plus (Add to queue)
  - Play, Pause (Video controls)
  - Trash (Remove from queue)
  - FilmStrip (Queue/theater icon)
  - ArrowRight (Next fact)
- **Spacing**: Generous padding (p-6 to p-8) around content blocks, consistent gap-4 between related elements, gap-6 between major sections
- **Mobile**: Single column stack on mobile - video player full width on top, facts panel below, queue as expandable accordion at bottom
