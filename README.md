# Personal Knowledge Map Web Template

A feature-rich and interactive **Personal Knowledge Map web application** built with HTML5, CSS3, and Vanilla JavaScript.

This project allows users to visually organize what they are learning by creating knowledge maps, topics, relationships, groups, categories, tags, review schedules, and progress states.

It is designed as a fully client-side productivity and learning application with no backend, database, framework, or build process.

## Features

- Multiple knowledge maps
- Interactive knowledge graph
- Draggable knowledge nodes
- Node connections and relationships
- Directed and non-directed connections
- Connection labels
- Node grouping
- Collapsible groups
- Multi-selection
- Bulk actions
- Node focus mode
- Context menus
- Auto layout
- Zoom and pan controls
- Minimap
- Undo and redo
- Global search
- Advanced filters
- Saved filters
- Smart views
- Favorites
- Recently updated topics
- Recent activity
- Learning progress tracking
- Review scheduling
- Study session mode
- Dashboard analytics
- Map templates
- JSON import/export
- Merge import mode
- Local backup snapshots
- Settings management
- Light Mode
- Dark Mode
- Theme persistence
- Responsive interface
- Keyboard shortcuts
- Command palette
- Accessible interactions
- localStorage persistence

## Knowledge Maps

Users can create multiple knowledge maps for different subjects or areas of interest.

Example maps:

- Web Development
- Mathematics
- Physics
- Biology
- Language Learning
- Research
- Exam Preparation
- Personal Projects

Each map can contain its own nodes, groups, connections, progress data, and learning information.

## Knowledge Nodes

Each node represents a topic or concept.

Nodes can contain:

- Title
- Description
- Category
- Tags
- Learning status
- Importance
- Notes
- Favorite state
- Review information
- Created date
- Updated date
- Position data

Supported learning states include:

- Not Started
- Learning
- Reviewing
- Mastered

Importance levels include:

- Low
- Medium
- High

## Interactive Knowledge Graph

The main knowledge map workspace allows users to visually arrange and connect topics.

Nodes can be:

- Created
- Edited
- Duplicated
- Deleted
- Dragged
- Selected
- Grouped
- Favorited
- Connected

Node positions are persisted using browser localStorage.

## Connections

Topics can be connected using relationship types such as:

- Related To
- Depends On
- Part Of
- Leads To
- Similar To

Connections can include:

- Direction
- Relationship type
- Optional label
- Source node
- Target node

Connection lines automatically update when nodes move, the canvas is zoomed, or the workspace is panned.

## Node Groups

Related topics can be organized into visual groups.

Groups support:

- Name
- Description
- Accent
- Node count
- Progress
- Collapse / expand
- Node assignment
- Node removal

Deleting a group does not automatically remove its nodes.

## Multi-Selection & Bulk Actions

Multiple nodes can be selected at the same time.

Bulk actions can include:

- Change status
- Change category
- Change importance
- Add tags
- Remove tags
- Favorite
- Unfavorite
- Move to group
- Delete

## Focus Mode

Focus Mode helps users explore a specific topic and its relationships.

It can highlight:

- Selected node
- Directly connected topics
- Relevant connections

Unrelated content can be visually dimmed to reduce distraction.

## Canvas Controls

The knowledge map includes controls for:

- Zoom In
- Zoom Out
- Reset Zoom
- Fit Map
- Pan
- Grid Toggle
- Minimap
- Automatic Layout

Different automatic layouts may include:

- Grid
- Horizontal
- Vertical
- Radial
- Compact

## Undo & Redo

The application supports undo and redo for important actions such as:

- Creating nodes
- Editing nodes
- Deleting nodes
- Moving nodes
- Creating connections
- Deleting connections
- Bulk changes
- Auto layout

## Dashboard

The dashboard provides an overview of learning activity.

It can display:

- Total maps
- Total topics
- Total connections
- Total groups
- Favorite topics
- Mastered topics
- Learning topics
- Reviewing topics
- Not Started topics
- Due reviews
- Overdue reviews
- Mastery percentage
- Progress by map

## Search

Global search can find information across:

- Map names
- Node titles
- Descriptions
- Notes
- Categories
- Tags
- Groups
- Connection labels

Search results can open the relevant map and topic directly.

## Filters

Topics can be filtered by:

- Map
- Status
- Category
- Tag
- Importance
- Favorite
- Review state

Filter combinations can be saved for later use.

## Smart Views

Dynamic smart views can help identify useful information such as:

- Needs Attention
- High Priority
- Due for Review
- Recently Mastered
- Unconnected Topics

These views are generated from existing data instead of duplicating stored information.

## Favorites

Topics can be marked as favorites.

Favorite topics can be accessed through a dedicated Favorites page.

## Recently Updated

The Recently Updated page displays topics ordered by their last modification date.

## Recent Activity

The application maintains a limited activity history for actions such as:

- Map created
- Map renamed
- Node created
- Node edited
- Node deleted
- Connection created
- Connection deleted
- Favorite changed
- Review completed
- Data imported

## Review System

Topics can contain review information such as:

- Last reviewed date
- Review count
- Next review date
- Review priority

Users can:

- Mark topics reviewed
- Snooze reviews
- Change review dates
- View due topics
- View overdue topics
- View upcoming topics

## Study Session

The Study Session mode allows users to review topics one at a time.

Session actions can include:

- Reviewed
- Needs More Work
- Mastered
- Skip

A summary is displayed at the end of the session.

## Map Templates

New knowledge maps can be created from starter templates such as:

- Blank Map
- Web Development
- Study Plan
- Research Map
- Language Learning
- Project Learning

## Import & Export

Application data can be exported as JSON.

Export options may include:

- Export Everything
- Export Current Map
- Export Selected Map

Import modes include:

- Replace Existing Data
- Merge With Existing Data

Imported data is validated before being applied.

## Backup System

The application can create local backup snapshots before major destructive actions.

Users can:

- View backups
- Restore backups
- Delete backups

A limited number of backups are stored to prevent uncontrolled storage growth.

## Settings

The Settings page includes options for areas such as:

### Appearance

- Light Mode
- Dark Mode
- System preference

### Canvas

- Grid
- Minimap
- Default zoom
- Connection labels
- Auto-fit behavior

### Study

- Review preferences
- Session settings

### Navigation

- Sidebar preferences
- Restore last page

### Data

- Export
- Import
- Reset application

### Backup

- Backup management
- Restore backup
- Delete backup

### Accessibility

- Reduced motion
- Visual preferences

## Light & Dark Mode

The application supports complete Light Mode and Dark Mode styling.

Theme preference is persisted using browser localStorage.

Theme support covers:

- Navbar
- Sidebar
- Dashboard
- Knowledge map
- Nodes
- Connections
- Groups
- Inspector
- Forms
- Modals
- Search
- Context menus
- Command palette
- Review interface
- Settings
- Toast notifications

## Responsive Design

The application is designed to work across:

- Mobile phones
- Tablets
- Laptops
- Desktop monitors
- Large displays

The layout adapts using:

- Responsive navigation
- Collapsible sidebar
- Responsive inspector
- Mobile drawers
- Compact canvas controls
- Responsive typography
- Touch-friendly actions

## Accessibility

Accessibility-focused features include:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible modal behavior
- Accessible controls
- Proper labels
- Touch-friendly interaction
- Reduced-motion support
- Status indicators that do not rely only on color

## Keyboard Shortcuts

Depending on the current context, shortcuts may include:

- `N` — Create Node
- `/` — Search
- `Ctrl + K` — Command Palette
- `Ctrl + Z` — Undo
- `Ctrl + Y` — Redo
- `Ctrl + Shift + Z` — Redo
- `0` — Reset Zoom
- `Esc` — Close dialogs or exit active modes

Shortcuts are disabled where necessary while typing inside form controls.

## Technologies

The project uses:

- HTML5
- CSS3
- Vanilla JavaScript
- SVG
- Browser localStorage

The project does not require:

- React
- Next.js
- Vue
- Angular
- Svelte
- TypeScript
- Bootstrap
- Tailwind CSS
- jQuery
- Node.js
- npm
- Backend
- Database
- External API
- Build tools

## Project Structure

    personal-knowledge-map-web-template/
    │
    ├── index.html
    │
    ├── pages/
    │   ├── dashboard.html
    │   ├── knowledge-map.html
    │   ├── all-topics.html
    │   ├── favorites.html
    │   ├── recently-updated.html
    │   ├── recent-activity.html
    │   ├── review.html
    │   └── settings.html
    │
    └── assets/
        ├── css/
        │   ├── base/
        │   ├── layout/
        │   ├── components/
        │   ├── pages/
        │   └── responsive/
        │
        ├── js/
        │   ├── core/
        │   ├── components/
        │   ├── features/
        │   └── pages/
        │
        ├── icons/
        └── images/

The exact project structure may contain additional feature modules and asset files.

## Getting Started

Clone the repository:

    git clone https://github.com/Erhanalp35/personal-knowledge-map-web-template.git

Enter the project directory:

    cd personal-knowledge-map-web-template

Then open:

`index.html`

in a modern web browser.

No installation, backend, database, package manager, or build process is required.

## Data Storage

Application data is stored locally in the browser using localStorage.

Stored information may include:

- Maps
- Nodes
- Connections
- Groups
- Categories
- Tags
- Favorites
- Reviews
- Activity
- Filters
- Settings
- Backups
- Interface preferences

## Use Cases

This project can be used for:

- Personal knowledge management
- Study planning
- Exam preparation
- Programming learning
- University subjects
- Research organization
- Language learning
- Visual note organization
- Concept mapping
- Learning progress tracking

## License

This project can be used and modified for personal, educational, and development purposes.

Review the repository license before using the project in commercial or redistributed projects.
