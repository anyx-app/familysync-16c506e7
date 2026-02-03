# Schema Plan - FamilySync

## Overview
FamilySync requires a schema that supports multiple families, users (members), shared calendars with recurring events, and shared lists (shopping and to-do).

## Tables

### 1. `profiles`
- **Purpose**: Stores public user information. Linked to Supabase Auth `auth.users`.
- **Columns**:
  - `id` (uuid, PK): References `auth.users.id`.
  - `email` (text): User email.
  - `display_name` (text): User's visible name.
  - `avatar_url` (text): URL to profile image.
  - `color_code` (text): Hex code for color-coded member assignments (e.g., #FF5733).
  - `created_at` (timestamptz): Creation timestamp.

### 2. `families`
- **Purpose**: Represents a family group that shares data.
- **Columns**:
  - `id` (uuid, PK): Unique identifier.
  - `name` (text): Family name (e.g., "The Smiths").
  - `created_by` (uuid): References `profiles.id` (Admin).
  - `created_at` (timestamptz): Creation timestamp.

### 3. `family_members`
- **Purpose**: Junction table linking users to families.
- **Columns**:
  - `family_id` (uuid, PK, FK): References `families.id`.
  - `profile_id` (uuid, PK, FK): References `profiles.id`.
  - `role` (text): Role in the family ('admin', 'member').
  - `created_at` (timestamptz): Join timestamp.

### 4. `events`
- **Purpose**: Calendar events.
- **Columns**:
  - `id` (uuid, PK): Unique identifier.
  - `family_id` (uuid, FK): References `families.id`.
  - `title` (text): Event title.
  - `description` (text): Detailed description (optional).
  - `start_time` (timestamptz): Event start.
  - `end_time` (timestamptz): Event end.
  - `is_all_day` (boolean): Flag for all-day events.
  - `recurrence_rule` (text): RRule string for recurring events (optional).
  - `color` (text): Optional specific color override for the event.
  - `created_by` (uuid, FK): References `profiles.id`.
  - `created_at` (timestamptz): Creation timestamp.

### 5. `event_assignees`
- **Purpose**: Assigning specific family members to an event.
- **Columns**:
  - `event_id` (uuid, PK, FK): References `events.id`.
  - `profile_id` (uuid, PK, FK): References `profiles.id`.

### 6. `lists`
- **Purpose**: Container for shopping lists and to-do lists.
- **Columns**:
  - `id` (uuid, PK): Unique identifier.
  - `family_id` (uuid, FK): References `families.id`.
  - `title` (text): List title (e.g., "Grocery Run", "Weekend Chores").
  - `type` (text): List type ('shopping', 'todo').
  - `created_at` (timestamptz): Creation timestamp.

### 7. `list_items`
- **Purpose**: Individual items within a list.
- **Columns**:
  - `id` (uuid, PK): Unique identifier.
  - `list_id` (uuid, FK): References `lists.id`.
  - `content` (text): Item description/name.
  - `is_completed` (boolean): Completion status.
  - `assigned_to` (uuid, FK): References `profiles.id` (optional).
  - `created_at` (timestamptz): Creation timestamp.

## Security Policies (RLS)
- **Profiles**: Publicly readable by authenticated users (or restricted to shared family members). Updates by self only.
- **Families**: Viewable by members. Createable by authenticated users.
- **Events/Lists/Items**: Viewable and editable only by members of the `family_id` associated with the record.

## Extensions
- `uuid-ossp`: For UUID generation.
