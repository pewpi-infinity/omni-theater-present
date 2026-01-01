# Planning Guide

A retro-futuristic video theater platform that presents curated tech documentaries alongside a continuously streaming feed of computing history facts. Features user authentication, personal content libraries, quantum analysis, tokenized watch rewards (1 token/hr for movies, 3 tokens/hr for documentaries), AI-powered advertising agent, bonus quiz challenges, community content submission, and cross-repo navigation hub.

**Experience Qualities**:
1. **Cinematic** - Immersive theater-like viewing experience with atmospheric presentation
2. **Rewarding** - Gamified watch-to-earn system incentivizes engagement and learning
3. **Educational** - Seamlessly delivers fascinating tech history while entertaining with bonus quizzes

**Complexity Level**: Complex Application (advanced functionality with tokenization, AI features, and community systems)
The app combines video playback, tokenized rewards, advertising marketplace, quiz challenges, content submission, cross-repo navigation, fact streaming, queue management, user authentication, and AI-powered features with persistent state across sessions.

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

### Tokenization System
- **Functionality**: Automated watch-time tracking with token rewards (1 token/hr for movies, 3 tokens/hr for documentaries)
- **Purpose**: Gamifies viewing experience and provides currency for advertising and future features
- **Trigger**: Starts automatically when signed-in user watches content
- **Progression**: User signs in → Starts watching video → System detects if documentary → Tokens accumulate every 10 seconds based on watch time → Total displayed in token counter with session progress
- **Success criteria**: Tokens persist between sessions, documentary detection works accurately, counter updates smoothly

### Quantum Advertising Agent
- **Functionality**: AI-powered ad creation system where users spend 50 tokens to create advertisements with AI-generated descriptions
- **Purpose**: Creates a token sink and community advertising marketplace
- **Trigger**: User clicks "Create Ad" button (requires 50 tokens and authentication)
- **Progression**: User clicks Create Ad → Enters title → Clicks "AI Generate" for description → AI creates compelling ad copy → User adds optional link → Spends 50 tokens → Ad appears in feed for all users
- **Success criteria**: AI generates engaging ad descriptions, token deduction works correctly, ads display prominently to all users

### Bonus Quiz Challenges
- **Functionality**: AI-generated trivia questions about each video with bonus token rewards (5 tokens for movies, 10 for documentaries)
- **Purpose**: Encourages engagement and tests comprehension
- **Trigger**: User clicks "Start Quiz" button (one quiz per video)
- **Progression**: User clicks Start Quiz → AI generates question with 4 options → User selects answer → Submits → Correct answer highlighted → Bonus tokens awarded if correct → Quiz marked as completed
- **Success criteria**: Questions are relevant and challenging, correct answers award tokens properly, can't retake same quiz

### Community Content Submission
- **Functionality**: Submit video suggestions to theater queue with content type flags (TV Show, Live Event)
- **Purpose**: Enables community curation of theater content
- **Trigger**: User clicks "Submit Content" button (requires authentication)
- **Progression**: User clicks Submit → Enters title, URL, description → Toggles content type flags → Submits → Video added to queue with type tags → Visible to all users
- **Success criteria**: Submissions appear immediately in queue, type flags display correctly, token rates adjust for documentaries

### Cross-Repo Navigation Hub
- **Functionality**: Infinity Links section in hamburger menu with themed navigation to other project repos
- **Purpose**: Creates interconnected ecosystem of project sites (Mario's Castle, Luigi's Factory, etc.)
- **Trigger**: User opens hamburger menu
- **Progression**: User clicks hamburger icon → Menu slides out → Top section shows Infinity Links → User sees themed project links (Mario's Castle, Paradise, Treasure Chest, AI Builder, Luigi's Factory, Seed Repository) → Clicks to navigate
- **Success criteria**: Links are discoverable, descriptions are clear, navigation flows smoothly

## Edge Case Handling
- **Empty Queue**: Show helpful empty state with "Add video" prompt
- **Empty Library**: Show helpful empty state when user has no content uploaded
- **Not Signed In**: Show sign-in prompt in hamburger menu, hide authenticated features, show token features only when logged in
- **Invalid URLs**: Validate video URL format before adding to queue
- **Long Fact Text**: Truncate or scroll very long facts to maintain layout
- **Rapid Navigation**: Debounce fact transitions if user rapidly clicks
- **Missing Video**: Show error state if embedded video fails to load
- **AI Analysis Failure**: Show error toast and close dialog if quantum report fails
- **Swipe Conflicts**: Disable auto-rotation while user is dragging facts
- **Insufficient Tokens**: Show error message when user tries to create ad without 50 tokens
- **Quiz Already Completed**: Disable quiz button and show completion status
- **AI Generation Errors**: Handle gracefully with error messages for ad generation or quiz creation failures
- **Token Overflow**: Support large token values without UI breaking
- **Simultaneous Sessions**: Track only current session, end previous session tokens when new video starts

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
  - Card: For video player, facts panel, token display, ads, quiz, and content submission with custom dark styling
  - Button: Primary actions with hover glow effects (ads, quiz, submit, token features)
  - Dialog: For adding videos, quantum reports, ad creation
  - Input/Textarea: URL and text entry with cyber-aesthetic styling
  - ScrollArea: For facts feed, queue list, ad feed with custom scrollbar
  - Separator: Dividing sections with neon accent lines
  - Sheet: Hamburger slide-out menu with Infinity Links and personal content
  - Slider: Speed control for fact rotation timing
  - Switch: Content type toggles (TV Show, Event)
- **Customizations**:
  - Token counter with live session progress and gradient background
  - Advertising feed with AI-generated descriptions and cost display
  - Quiz interface with multiple choice, answer reveal, and token rewards
  - Content submission form with type flags and validation
  - Infinity Links section with themed project navigation
  - Documentary detection system for automatic token rate adjustment
- **States**:
  - Buttons: Default (subtle glow), Hover (bright glow), Active (pulsing glow), Disabled (dimmed)
  - Token Display: Accumulating (animated counter), Static (normal display)
  - Quiz: Unanswered, Answered (correct/incorrect visual feedback), Completed
  - Ad Creation: Empty, Generating (AI loading), Filled (ready to submit)
- **Icon Selection**:
  - Plus (Add to queue/library, submit)
  - Coins, TrendUp (Token display and earnings)
  - Megaphone, Sparkle (Advertising and AI features)
  - Brain, Check, X (Quiz system)
  - VideoCamera (Content submission)
  - Infinity (Cross-repo navigation)
  - House, Package, Wrench, Factory, Plant (Themed project icons)
- **Spacing**: Generous padding (p-6 to p-8) around content blocks, consistent gap-4 between related elements, gap-6 between major sections, new bottom sections with gap-6 separation
- **Mobile**: Single column stack - video on top, token display below (if logged in), facts panel, advertising and submission in stacked cards, quiz at bottom, hamburger menu slides over with full navigation
