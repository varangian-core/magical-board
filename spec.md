# Magical Collaborative Board - Project Specification

## Overview
A real-time collaborative whiteboard application inspired by Miro/Figma with a magical girl/Sailor Moon aesthetic. Users can create boards, drop various elements (cards, images, timelines), and collaborate in real-time with other users.

## Core Features

### 1. User System
- **User Creation**: Simple user creation with magical girl themed avatars
- **User Selection**: Choose your "Guardian" before entering a board
- **User Profiles**: Each user has:
  - Unique name
  - Chosen magical girl avatar/theme color
  - Cursor style and color
  - Transformation animation on join

### 2. Infinite Canvas Board
- **Pan & Zoom**: Smooth navigation across infinite canvas
- **Grid System**: Optional sparkly grid background
- **Minimap**: Crystal ball-style minimap for navigation
- **Board States**: Save and load board configurations

### 3. Draggable Elements

#### Cards
- **Types**: Note cards, task cards, idea cards
- **Features**:
  - Editable text content
  - Customizable colors with gradient effects
  - Star/moon/heart decorations
  - Resize handles with sparkle effects
  - Rich text editing (bold, italic, colors)

#### Images
- **Upload**: Drag & drop or click to upload
- **Features**:
  - Resize with aspect ratio lock
  - Rotation with magical spin effect
  - Filters (sparkle, glow, pastel)
  - Frame decorations (stars, ribbons)

#### Timelines
- **Horizontal/Vertical**: Switch between orientations
- **Features**:
  - Add/remove events with transformation animations
  - Date/time selection with moon phase calendar
  - Event cards with icons
  - Connecting lines with flowing sparkles
  - Milestone markers (star transformations)

### 4. Real-time Collaboration
- **Live Cursors**: See other users' cursors with trails
- **Selection Indicators**: Glowing aura around selected items
- **Live Updates**: Instant synchronization of all changes
- **Presence System**: See who's currently on the board
- **Chat Bubbles**: Optional floating chat messages

### 5. Magical Girl Theme Elements

#### Visual Design
- **Color Palette**:
  - Primary: Soft pinks, purples, blues
  - Accents: Gold, silver, white sparkles
  - Backgrounds: Gradient skies, star fields
  
#### UI Components
- **Buttons**: Crystal/gem shaped with hover glow
- **Menus**: Floating panels with ribbon borders
- **Icons**: Moon, star, heart, wand themed
- **Animations**: Transformation sequences, sparkle trails

#### Special Effects
- **Particle System**: Sparkles following cursor
- **Transform Animations**: When adding/removing elements
- **Sound Effects**: Optional magical chimes
- **Glow Effects**: Soft glows on interactive elements

## Technical Architecture

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Canvas Library**: Konva.js for performance
- **State Management**: Zustand for local state
- **Styling**: Tailwind CSS + custom animations
- **Real-time**: Socket.io client

### Backend
- **Server**: Node.js with Express
- **WebSocket**: Socket.io for real-time
- **Database**: PostgreSQL for persistence
- **File Storage**: S3-compatible for images
- **Authentication**: JWT tokens

### Data Models

#### User
```typescript
interface User {
  id: string;
  name: string;
  avatar: MagicalGirlAvatar;
  color: string;
  createdAt: Date;
}
```

#### Board
```typescript
interface Board {
  id: string;
  name: string;
  elements: BoardElement[];
  users: User[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### BoardElement
```typescript
interface BoardElement {
  id: string;
  type: 'card' | 'image' | 'timeline';
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  zIndex: number;
  content: CardContent | ImageContent | TimelineContent;
  createdBy: string;
  lockedBy?: string;
}
```

## User Flows

### 1. First Time User
1. Land on magical landing page
2. Click "Create Your Guardian"
3. Choose name and avatar
4. Enter transformation sequence
5. Arrive at board selection

### 2. Creating a Board
1. Click "New Magical Board"
2. Name the board
3. Choose theme (Moon Kingdom, Star Palace, etc.)
4. Board creates with sparkle animation
5. Share link appears in crystal orb

### 3. Collaborating
1. User receives board link
2. Selects their guardian
3. Transformation sequence plays
4. Cursor appears with sparkle trail
5. Can immediately start adding elements

## Performance Considerations
- **Debounced Updates**: 60fps target with batched updates
- **Viewport Culling**: Only render visible elements
- **Image Optimization**: Automatic compression and lazy loading
- **WebSocket Optimization**: Binary protocols for cursor positions
- **Caching**: Local storage for user preferences

## Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels on all elements
- **Color Modes**: High contrast option
- **Reduced Motion**: Disable animations option

## Future Enhancements
- **Voice Chat**: Magical communication crystals
- **Templates**: Pre-made magical layouts
- **Export**: Save as image with effects
- **Mobile App**: Touch-optimized version
- **AI Assistant**: Magical helper for suggestions