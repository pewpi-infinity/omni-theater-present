# Planning Guide

A retro-futuristic video theater platform that presents curated tech documentaries alongside a continuously streaming feed of computing history facts about IBM, Apple, Microsoft, Steve Jobs, early computing, IoT, Mongoose OS, and embedded systems. Features user authentication, personal content libraries, quantum analysis of movie titles, and interactive fact controls.

**Experience Qualities**:
1. **Cinematic** - Immersive theater-like viewing experience with atmospheric presentation
2. **Nostalgic** - Evokes 1980s computing aesthetic with retro-futuristic design elements
3. **Educational** - Seamlessly delivers fascinating tech history while entertaining

**Complexity Level**: Complex Application (advanced functionality with user authentication and AI features)
The app combines video playback, fact streaming, queue management, user authentication, personal content libraries, and AI-powered quantum analysis with persistent state across sessions.

## Essential Features

### Video Player
- **Functionality**: Embedded video player with full controls for theater presentation
- **Purpose**: Primary content delivery mechanism for tech documentaries
- **Trigger**: Auto-loads on app initialization with default video
- **Progression**: User lands on page → Video player visible and ready → User plays/pauses/seeks → Video plays in theater mode
- **Success criteria**: Video loads reliably, controls are intuitive, theater presentation feels immersive

### Facts Feed with Interactive Controls
- **Functionality**: Continuously rotating display of computing history facts with smooth transitions, adjustable speed, pause/play controls, and swipe navigation
- **Purpose**: Provides educational context and entertainment during viewing with user control
- **Trigger**: Auto-starts on page load, cycles through facts automatically unless paused
- **Progression**: App loads → Facts begin auto-rotating → User can adjust speed slider (5-30s) → User can pause/play → User can swipe left/right to navigate → Smooth fade transitions between facts
- **Success criteria**: Facts are readable, transitions are smooth, timing feels natural, user controls are responsive, swipe gestures work intuitively

### Quantum Report Generator
- **Functionality**: AI-powered analysis of movie titles generating quantum computing and tech innovation perspectives
- **Purpose**: Provides unique, engaging insights connecting movies to quantum and computing concepts
- **Trigger**: User clicks "Quantum Report" button below video player
- **Progression**: User clicks button → Dialog opens with loading animation → AI analyzes movie title → Report displays with analysis and 5 quantum factors → Smooth animations reveal content
- **Success criteria**: Analysis is relevant and engaging, quantum factors are insightful, loading state is clear, animations are smooth

### User Authentication
- **Functionality**: GitHub-based user authentication with persistent login state
- **Purpose**: Enables personalized features and content management
- **Trigger**: User clicks "Sign In" button in header
- **Progression**: User clicks sign in → Authentication dialog appears → User authenticates via GitHub → Welcome message → User profile displayed in header
- **Success criteria**: Authentication is seamless, login state persists, user info displayed clearly

### Personal Content Library
- **Functionality**: Hidden hamburger menu (left side) for users to manage their uploaded content
- **Purpose**: Allows authenticated users to create and access their own video collection
- **Trigger**: User clicks hamburger menu icon in header
- **Progression**: User signs in → Clicks hamburger icon → Slide-out panel opens → User can view their uploaded content → Click to play or remove items
- **Success criteria**: Menu slides smoothly, content is filtered by user, plays correctly

### Content Upload System
- **Functionality**: Button to add personal content to library (visible when authenticated)
- **Purpose**: Enables users to build their own video collection
- **Trigger**: User clicks "Add to My Library" button (visible when signed in)
- **Progression**: User is authenticated → "Add to My Library" button visible → User clicks → Dialog opens → User enters title and URL → Content saved to personal library
- **Success criteria**: Upload is intuitive, content persists, appears in hamburger menu

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
- **Empty Library**: Show helpful empty state when user has no content uploaded
- **Not Signed In**: Show sign-in prompt in hamburger menu, hide "Add to My Library" button
- **Invalid URLs**: Validate video URL format before adding to queue
- **Long Fact Text**: Truncate or scroll very long facts to maintain layout
- **Rapid Navigation**: Debounce fact transitions if user rapidly clicks
- **Missing Video**: Show error state if embedded video fails to load
- **AI Analysis Failure**: Show error toast and close dialog if quantum report fails
- **Swipe Conflicts**: Disable auto-rotation while user is dragging facts

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
Subtle but purposeful - focus on smooth fact transitions using fade effects and gentle slide animations. Video player controls should have satisfying micro-interactions. Quantum report reveals with staggered animations. Hamburger menu slides smoothly from left. The overall feel should be analog warmth meeting digital precision - nothing too rapid or jarring, maintaining the contemplative theater atmosphere.

## Component Selection
- **Components**:
  - Card: For video player container and facts display panel with custom dark styling
  - Button: Primary actions (play, add) with hover glow effects
  - Dialog: For adding new video URLs to queue and quantum reports
  - Input: URL entry field with cyber-aesthetic styling
  - ScrollArea: For facts feed and queue list with custom scrollbar
  - Separator: Dividing sections with neon accent lines
  - Sheet: Hamburger slide-out menu for personal content library
  - Slider: Speed control for fact rotation timing
- **Customizations**:
  - Custom video embed component with aspect ratio preservation and title display
  - Animated fact display with auto-rotation timer, pause/play, and swipe gestures
  - Queue item component with thumbnail placeholder and metadata
  - Quantum analyzer with AI integration and animated report display
  - Auth component with GitHub user integration
  - Hamburger menu with user-filtered content
- **States**:
  - Buttons: Default (subtle glow), Hover (bright glow), Active (pulsing glow), Disabled (dimmed)
  - Inputs: Default (faint border), Focus (bright cyan border glow), Error (magenta border)
  - Queue items: Default, Hover (highlighted), Active/Playing (bright border)
  - Facts: Playing (auto-rotating), Paused (static), Dragging (follows gesture)
- **Icon Selection**:
  - Plus (Add to queue/library)
  - Play, Pause (Fact control and video indicators)
  - Trash (Remove from queue/library)
  - FilmStrip (Queue/theater icon)
  - ArrowRight (Next fact)
  - List (Hamburger menu)
  - User, SignOut (Authentication)
  - Atom (Quantum analysis)
  - Sparkle (User avatar)
- **Spacing**: Generous padding (p-6 to p-8) around content blocks, consistent gap-4 between related elements, gap-6 between major sections
- **Mobile**: Single column stack on mobile - video player full width on top, facts panel below with touch-friendly controls, queue as expandable accordion at bottom, hamburger menu slides over from left
