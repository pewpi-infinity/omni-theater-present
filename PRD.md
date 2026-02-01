# Planning Guide

A retro-futuristic video theater platform that presents curated tech documentaries alongside a continuously streaming feed of computing history facts. Features unified token wallet system with user authentication, personal content libraries, quantum analysis, tokenized watch rewards (1 token/hr for movies, 3 tokens/hr for documentaries, +50% party bonus), AI-powered advertising agent, bonus quiz challenges, community content submission, real-time community chat, synchronized viewing parties with bonus rewards, and cross-repo navigation hub. All authentication, token tracking, and wallet functionality are centralized in a single unified system.

**Experience Qualities**:
1. **Cinematic** - Immersive theater-like viewing experience with atmospheric presentation
2. **Rewarding** - Gamified watch-to-earn system incentivizes engagement and learning with transparent transaction tracking
3. **Social** - Real-time chat and synchronized viewing parties create shared experiences and community connection
4. **Educational** - Seamlessly delivers fascinating tech history while entertaining with bonus quizzes

**Complexity Level**: Complex Application (advanced functionality with unified tokenization system, AI features, real-time social features, and community systems)
The app combines video playback, centralized token wallet with complete transaction history, advertising marketplace, quiz challenges, content submission, real-time community chat, synchronized viewing parties, cross-repo navigation, fact streaming, queue management, user authentication, and AI-powered features with persistent state across sessions.

## Unified Token Wallet Architecture

**CRITICAL: All token operations, authentication state, and wallet management flow through a single unified system.**

The Unified Token Wallet is the central hub that consolidates:
- **User Authentication State**: Single GitHub login tracked across all components
- **Token Balance**: One source of truth for total tokens earned and spent
- **Transaction History**: Complete log of all token operations (earning, spending, bonuses, party bonuses)
- **Watch Sessions**: Active session tracking with real-time token accumulation and party bonus multipliers
- **Statistics**: Quiz completions, advertisements created, watch time
- **Persistence**: All wallet data stored in single KV store key (`unified-wallet`)

**Token Flow:**
1. **Earning**: Watch time → Unified Wallet (+1 or +3 tokens/hr, +50% if in party) → Transaction logged with party bonus note
2. **Bonus**: Quiz completion → Unified Wallet (+5 or +10 tokens) → Transaction logged → Quiz count incremented
3. **Spending**: Ad creation → Unified Wallet (-50 tokens) → Transaction logged → Ad count incremented
4. **Party Bonus**: Active party membership → Automatic +50% multiplier on all watch time earnings → Noted in transaction reasons

**Integration Points:**
- `UnifiedTokenWallet` component: Main display with balance, stats, session earnings, party bonus indicator, history access
- `ViewingPartySystem`: Triggers party bonus flag when user joins party, clears on leave
- `BonusQuiz`: Reads wallet balance, deposits bonus tokens, logs transaction
- `AdvertisingAgent`: Reads wallet balance, deducts tokens, logs transaction
- `AuthComponent`: Initializes wallet on sign-in
- All components use `unified-wallet` KV key exclusively

**Migration Notes:**
- Legacy `user-tokens` KV key is deprecated
- System auto-migrates on user sign-in if old data exists
- Transaction history provides complete audit trail
- No duplicate token tracking systems
- Party bonuses apply retroactively to active sessions when user joins party

## Essential Features

### Quantum-Powered Content Curation (NEW)
- **Functionality**: AI-powered video recommendation system that analyzes user viewing intent and automatically imports top movie choices from archive.org
- **Purpose**: Intelligently curates content based on user patterns, creating a personalized discovery experience without manual searching
- **Trigger**: User clicks "Quantum Curation" button in header
- **Progression**: User clicks button → AI analyzes viewing history and intent patterns → Generates 5 curated recommendations with relevance scores → Each recommendation shows title, category, reason, and match percentage → User clicks "Import" to add to queue → System learns from imports to refine future recommendations
- **Success criteria**: Recommendations are relevant and diverse, AI adapts to user preferences over time, import process is seamless, categories match theater theme

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
- **Functionality**: GitHub-based user authentication with persistent login state that initializes unified wallet
- **Purpose**: Enables personalized features, content management, and token earning
- **Trigger**: User clicks "Sign In" button in header
- **Progression**: User clicks sign in → Authentication dialog appears → User authenticates via GitHub → Unified wallet initialized → Welcome message → User profile displayed in header
- **Success criteria**: Authentication is seamless, login state persists, wallet auto-initializes, user info displayed clearly

### Unified Token Wallet System (CENTRAL HUB)
- **Functionality**: Centralized wallet system that tracks all token operations, transactions, watch sessions, quiz completions, and ad creation with complete transaction history
- **Purpose**: Single source of truth for all authentication, token earning, spending, and wallet state across the entire application
- **Trigger**: Automatically initializes when user signs in, visible throughout session
- **Progression**: User signs in → Wallet created/loaded → Displays total tokens, session earnings, quiz count, ad count → Real-time updates as tokens earned/spent → Transaction history accessible via "History" button → Shows all earning (watch time), bonus (quizzes), and spending (ads) transactions with timestamps
- **Success criteria**: All token operations sync through one system, transaction history is complete and accurate, wallet persists between sessions, no duplicate token tracking, real-time balance updates across all components

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
- **Functionality**: Automated watch-time tracking integrated with unified wallet (1 token/hr for movies, 3 tokens/hr for documentaries)
- **Purpose**: Gamifies viewing experience, provides currency for advertising, integrates all token operations into single wallet system
- **Trigger**: Starts automatically when signed-in user watches content
- **Progression**: User signs in → Wallet initializes → Starts watching video → System detects if documentary → Tokens accumulate every 10 seconds based on watch time → Balance updates in unified wallet → Transaction recorded in history → Total displayed with session progress, quiz count, and ad count
- **Success criteria**: Tokens persist between sessions via unified wallet, documentary detection works accurately, counter updates smoothly, all transactions logged, wallet is single source of truth

### Quantum Advertising Agent
- **Functionality**: AI-powered ad creation system integrated with unified wallet where users spend 50 tokens to create advertisements with AI-generated descriptions
- **Purpose**: Creates a token sink, community advertising marketplace, demonstrates unified wallet spending system
- **Trigger**: User clicks "Create Ad" button (requires 50 tokens from unified wallet and authentication)
- **Progression**: User clicks Create Ad → Wallet balance checked → Enters title → Clicks "AI Generate" for description → AI creates compelling ad copy → User adds optional link → Spends 50 tokens from unified wallet → Transaction recorded → Ad count incremented → Ad appears in feed for all users
- **Success criteria**: AI generates engaging ad descriptions, token deduction syncs with unified wallet, spending transaction logged, ad counter updates, ads display prominently to all users

### Bonus Quiz Challenges
- **Functionality**: AI-generated trivia questions integrated with unified wallet for bonus token rewards (5 tokens for movies, 10 for documentaries)
- **Purpose**: Encourages engagement, tests comprehension, demonstrates unified wallet earning system
- **Trigger**: User clicks "Start Quiz" button (one quiz per video)
- **Progression**: User clicks Start Quiz → AI generates question with 4 options → User selects answer → Submits → Correct answer highlighted → Bonus tokens deposited to unified wallet → Bonus transaction recorded → Quiz counter incremented → Quiz marked as completed
- **Success criteria**: Questions are relevant and challenging, correct answers deposit to unified wallet properly, bonus transactions logged, quiz count updates, can't retake same quiz

### Community Content Submission
- **Functionality**: Submit video suggestions to theater queue with content type flags (TV Show, Live Event)
- **Purpose**: Enables community curation of theater content
- **Trigger**: User clicks "Submit Content" button (requires authentication)
- **Progression**: User clicks Submit → Enters title, URL, description → Toggles content type flags → Submits → Video added to queue with type tags → Visible to all users
- **Success criteria**: Submissions appear immediately in queue, type flags display correctly, token rates adjust for documentaries

### Token Redemption Store (NEW)
- **Functionality**: Comprehensive store where users spend tokens on exclusive content packs, premium features, profile badges, and token multiplier boosts
- **Purpose**: Creates token economy sink, provides premium rewards for engaged users, incentivizes earning and platform usage
- **Trigger**: Automatically visible below quiz section for all users (requires sign-in to purchase)
- **Progression**: User views store → Browses categories (All/Videos/Features/Badges/Boosts) → Clicks item card → Reviews purchase details in confirmation dialog → Sees cost, current balance, and balance after purchase → Confirms transaction → Tokens deducted from unified wallet → Purchase recorded and displayed in Purchased Library → Transaction logged in wallet history
- **Success criteria**: Store items are clearly categorized and visually appealing, purchase flow is intuitive with confirmation step, token deduction integrates seamlessly with unified wallet, purchases persist and appear in library, insufficient balance is handled gracefully with clear messaging, featured items stand out visually

### Purchased Library (NEW)
- **Functionality**: Display all items purchased from Token Redemption Store with timestamps and type badges
- **Purpose**: Provides users visibility into their owned content and features, serves as trophy case for achievements
- **Trigger**: Automatically visible below Token Redemption Store when user is signed in and has purchases
- **Progression**: User makes purchase → Item immediately appears in library → Sorted by most recent → Shows item type icon, title, category badge, and purchase date → Empty state shown when no purchases exist
- **Success criteria**: Library updates instantly after purchase, items are clearly categorized by type with appropriate icons and colors, chronological sorting works correctly, empty state is friendly and actionable

### Community Chat (NEW)
- **Functionality**: Real-time chat system with floating expandable chat bubble, persistent message history, party-specific and global chat channels
- **Purpose**: Enables community interaction and communication during viewing, creates social atmosphere, enhances viewing party experience
- **Trigger**: Floating chat button always visible in bottom-right corner showing message count badge
- **Progression**: User clicks chat bubble → Chat window expands → Shows message history with avatars and timestamps → User types message → Presses enter or send button → Message appears instantly with smooth animation → Messages persist between sessions → Party members see dedicated party chat channel
- **Success criteria**: Messages sync instantly across all viewers, chat is non-intrusive but accessible, message history persists, party chat is isolated from global chat, user avatars and names display correctly, chat auto-scrolls to newest messages

### Viewing Parties (NEW)
- **Functionality**: Create or join synchronized viewing parties with real-time member count, host controls, party-specific chat, and automatic +50% token bonus for all participants
- **Purpose**: Creates shared viewing experiences, encourages community engagement, provides bonus incentives for group watching, enables social interaction around content
- **Trigger**: Viewing Parties card displays active parties list with "Create Party" button
- **Progression**: User clicks Create Party → Enters party name → Current video auto-selected → Party created with user as host → Other users see party in active list → Click Join to enter party → All members earn +50% token bonus automatically → Host controls sync to members (future enhancement) → Party chat enabled → Leave button exits party → Member count updates in real-time
- **Success criteria**: Party creation is instant, active parties display with accurate member counts, join/leave is seamless, token bonus applies automatically to all members, party status shows clearly in UI, host badge displays for creator, party becomes inactive after 5 minutes without activity

### Synchronized Playback (NEW)
- **Functionality**: Background sync system that tracks party host playback state and coordinates with party members for synchronized viewing
- **Purpose**: Ensures all party members watch the same content in sync, creates authentic shared viewing experience
- **Trigger**: Automatically activates when user joins a viewing party
- **Progression**: User joins party → Sync system initializes → Host playback state broadcasts every 5 seconds → Members receive sync updates → Video changes propagate to all members → Members see notification when host changes video → Host leaving party hands off control or ends party
- **Success criteria**: Video changes sync within 2-3 seconds, no jarring interruptions to viewing experience, sync respects iframe limitations, host controls work reliably, notifications are clear and non-intrusive

### Cross-Repo Navigation Hub
- **Functionality**: Infinity Links section in hamburger menu with themed navigation to other project repos
- **Purpose**: Creates interconnected ecosystem of project sites (Mario's Castle, Luigi's Factory, etc.)
- **Trigger**: User opens hamburger menu
- **Progression**: User clicks hamburger icon → Menu slides out → Top section shows Infinity Links → User sees themed project links (Mario's Castle, Paradise, Treasure Chest, AI Builder, Luigi's Factory, Seed Repository) → Clicks to navigate
- **Success criteria**: Links are discoverable, descriptions are clear, navigation flows smoothly

## Edge Case Handling
- **Empty Queue**: Show helpful empty state with "Add video" prompt
- **Empty Library**: Show helpful empty state when user has no content uploaded
- **Empty Purchases**: Show friendly empty state encouraging store visit when no items purchased
- **Empty Chat**: Show friendly empty state encouraging first message
- **No Active Parties**: Show empty state encouraging party creation
- **Not Signed In**: Show sign-in prompt in hamburger menu, hide authenticated features, show token features only when logged in, quantum curation works for all users, store shows sign-in required message, chat requires sign-in to send messages, viewing parties require sign-in to create/join
- **Wallet Not Initialized**: Auto-initialize unified wallet on first sign-in with zero balance
- **Legacy Token Data**: System automatically migrates from old token system (user-tokens) to unified wallet on user sign-in
- **Invalid URLs**: Validate video URL format before adding to queue
- **Long Fact Text**: Truncate or scroll very long facts to maintain layout
- **Rapid Navigation**: Debounce fact transitions if user rapidly clicks
- **Missing Video**: Show error state if embedded video fails to load
- **AI Analysis Failure**: Show error toast and close dialog if quantum report or curation fails
- **Swipe Conflicts**: Disable auto-rotation while user is dragging facts
- **Insufficient Tokens**: Unified wallet checks balance before allowing purchases, shows clear error message with needed amount, disables purchase button
- **Quiz Already Completed**: Disable quiz button and show completion status
- **AI Generation Errors**: Handle gracefully with error messages for ad generation, quiz creation, or curation failures
- **Token Overflow**: Unified wallet supports large token values without UI breaking
- **Simultaneous Sessions**: Track only current session in unified wallet, end previous session tokens when new video starts
- **No Intent History**: Provide foundational computing documentaries for new users without viewing history
- **Duplicate Imports**: Allow same video to be imported multiple times (user may want duplicates in queue)
- **Archive.org Availability**: Handle cases where recommended videos may not be accessible
- **Transaction History Overflow**: Limit displayed transactions to last 10 (most recent) for performance
- **Duplicate Purchases**: System allows re-purchasing same item (user may want multiple copies or re-activations)
- **Store Item Availability**: All items always available (no stock limitations)
- **Purchase During Session**: Purchases made while watching don't interrupt video playback
- **Party While In Party**: Disable create/join buttons when already in a party, show current party status
- **Already In Party**: Prevent joining same party twice, show already joined status
- **Host Leaves Party**: Party continues with remaining members, oldest member becomes new host
- **Party Inactivity**: Mark parties inactive after 5 minutes without sync updates
- **Sync Conflicts**: Members' local controls (play/pause) work but may desync, host sync takes precedence
- **Chat Message Flood**: No rate limiting currently, messages persist indefinitely
- **Party Token Bonus**: Automatically applies +50% to all party members, bonus noted in transaction reason
- **Leave During Earning**: Leaving party mid-session stops bonus but preserves earned tokens

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
  - Card: For video player, facts panel, unified token wallet, ads, quiz, content submission, quantum recommendations, token store items, purchased library with custom dark styling
  - Button: Primary actions with hover glow effects (ads, quiz, submit, token features, quantum curation, wallet history, store purchases)
  - Dialog: For adding videos, quantum reports, quantum curation results, ad creation, wallet transaction history, purchase confirmation
  - Badge: Category indicators, type flags, wallet stats (quiz count, ad count), store item benefits, purchase status
  - Input/Textarea: URL and text entry with cyber-aesthetic styling
  - ScrollArea: For facts feed, queue list, ad feed, quantum recommendations, transaction history, store items, purchased library with custom scrollbar
  - Separator: Dividing sections with neon accent lines
  - Sheet: Hamburger slide-out menu with Infinity Links and personal content
  - Slider: Speed control for fact rotation timing
  - Switch: Content type toggles (TV Show, Event)
  - Tabs: Store category filtering (All, Videos, Features, Badges, Boosts)
- **Customizations**:
  - UnifiedTokenWallet: Central wallet component with real-time balance, session earnings, statistics (quiz/ad counts), transaction history dialog with earning/spending/bonus categorization, party bonus indicator
  - TokenRedemptionStore: Full-featured store with tabbed categories, featured items highlighting, purchase confirmation flow, balance checking, and unified wallet integration
  - PurchasedLibrary: Trophy case display with chronological sorting, type-based icons and colors, empty state guidance
  - CommunityChat: Floating expandable chat window with message history, user avatars, timestamps, party-specific channels, real-time updates, auto-scroll
  - ViewingPartySystem: Party creation dialog, active parties list with join buttons, current party status card, host badge, member count, leave functionality
  - SyncedPlayback: Background sync component for coordinating playback state between party host and members
  - Quantum Curator: AI-powered recommendation dialog with animated loading states and relevance scoring
  - Token transaction types: Earned (watch time), Earned (party bonus), Bonus (quizzes), Spent (ads, store purchases) with distinct visual styling
  - Advertising feed with AI-generated descriptions and unified wallet integration
  - Quiz interface with multiple choice, answer reveal, and unified wallet token deposits
  - Content submission form with type flags and validation
  - Infinity Links section with themed project navigation
  - Documentary detection system for automatic token rate adjustment in unified wallet
  - Party bonus system: +50% token multiplier for all party members automatically applied
  - Intent history tracking for personalized recommendations
  - Store items with multiple types: video content packs, premium features, profile badges, token multiplier boosts
- **States**:
  - Buttons: Default (subtle glow), Hover (bright glow), Active (pulsing glow), Disabled (dimmed)
  - Unified Wallet: Idle (static balance), Earning (animated counter), Party bonus active (bonus indicator), Transaction updating (smooth transitions)
  - Quiz: Unanswered, Answered (correct/incorrect visual feedback), Completed
  - Ad Creation: Empty, Generating (AI loading), Filled (ready to submit), Insufficient funds (disabled)
  - Quantum Curator: Idle, Analyzing (AI processing), Results (importable recommendations)
  - Store Items: Available (purchasable), Owned (purchased badge), Insufficient Funds (locked), Featured (highlighted)
  - Purchase Flow: Browsing, Confirming (dialog open), Processing (transaction), Completed (success feedback)
  - Chat: Collapsed (floating button with badge), Expanded (full window), Typing (input active), Empty (no messages)
  - Viewing Party: Not in party (can create/join), In party (shows status, can leave), Host (crown badge, sync controls), Member (receiving sync)
  - Party Status: Active (accepting members, earning bonus), Inactive (stale, grayed out)
- **Icon Selection**:
  - Plus (Add to queue/library, submit, import)
  - Coins, TrendUp, ArrowUp, ArrowDown (Unified wallet, earnings, transactions, spending)
  - Clock (Transaction history)
  - Sparkle (AI features, quantum curation, bonus rewards, premium features, party bonuses)
  - Megaphone (Advertising)
  - Brain, Check, X (Quiz system)
  - VideoCamera (Content submission, video packs)
  - Infinity (Cross-repo navigation)
  - House, Package, Wrench, Factory, Plant (Themed project icons)
  - ShoppingCart, ShoppingBag (Store and purchases)
  - Star, Trophy, Crown (Badges, achievements, party host)
  - Lightning (Token boosts and multipliers)
  - Gift (Mystery packs)
  - Lock (Locked/unavailable items)
  - FilmSlate (Available for purchase)
  - ChatCircle, PaperPlaneRight (Chat interface, send message)
  - Users (Party members, community count)
  - SignIn, SignOut (Join/leave party)
- **Spacing**: Generous padding (p-6 to p-8) around content blocks, consistent gap-4 between related elements, gap-6 between major sections, unified wallet with prominent placement, store with grid layout, chat floating and non-intrusive
- **Mobile**: Single column stack - video on top, quantum curation button below header, unified token wallet below (if logged in with expanded view showing party bonus if active), facts panel, viewing parties card, advertising and submission in stacked cards, quiz, token store (full width with responsive grid), purchased library (if has items), hamburger menu slides over with full navigation, chat bubble fixed in corner scaling responsively, chat window adapts to mobile viewport
