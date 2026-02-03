SET search_path TO proj_e3037b2f;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
-- Stores public user information. Linked to auth.users via ID (handled by application logic/triggers).
CREATE TABLE profiles (
    id UUID PRIMARY KEY, -- Matches auth.users.id
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    color_code TEXT DEFAULT '#FF6F61',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users" 
    ON profiles FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own profile" 
    ON profiles FOR INSERT 
    WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (id = auth.uid());

-- 2. FAMILIES
-- Represents a family group.
CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Families are viewable by members" 
    ON families FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_members.family_id = families.id
            AND family_members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create families" 
    ON families FOR INSERT 
    WITH CHECK (created_by = auth.uid());

-- 3. FAMILY MEMBERS
-- Links users to families.
CREATE TABLE family_members (
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (family_id, profile_id)
);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members viewable by family peers" 
    ON family_members FOR SELECT 
    USING (
        family_id IN (
            SELECT family_id FROM family_members fm
            WHERE fm.profile_id = auth.uid()
        )
    );

CREATE POLICY "Admins can add members" 
    ON family_members FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.family_id = family_members.family_id
            AND fm.profile_id = auth.uid()
            AND fm.role = 'admin'
        )
        OR 
        -- Allow self-insertion if creating a new family (handled via transaction usually, but needed for policies)
        (
             profile_id = auth.uid() 
             AND EXISTS (
                SELECT 1 FROM families f 
                WHERE f.id = family_members.family_id 
                AND f.created_by = auth.uid()
             )
        )
    );

-- 4. EVENTS
-- Calendar events.
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_all_day BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    color TEXT,
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events viewable by family members" 
    ON events FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.family_id = events.family_id
            AND fm.profile_id = auth.uid()
        )
    );

CREATE POLICY "Events creatable by family members" 
    ON events FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.family_id = events.family_id
            AND fm.profile_id = auth.uid()
        )
        AND created_by = auth.uid()
    );

CREATE POLICY "Events updatable by family members" 
    ON events FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.family_id = events.family_id
            AND fm.profile_id = auth.uid()
        )
    );

CREATE POLICY "Events deletable by creator or admin" 
    ON events FOR DELETE 
    USING (
        created_by = auth.uid()
        OR 
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.family_id = events.family_id
            AND fm.profile_id = auth.uid()
            AND fm.role = 'admin'
        )
    );

-- 5. EVENT ASSIGNEES
-- Many-to-many link for events and profiles.
CREATE TABLE event_assignees (
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, profile_id)
);

ALTER TABLE event_assignees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assignees viewable by family members" 
    ON event_assignees FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM events e
            JOIN family_members fm ON e.family_id = fm.family_id
            WHERE e.id = event_assignees.event_id
            AND fm.profile_id = auth.uid()
        )
    );

CREATE POLICY "Assignees manageable by family members" 
    ON event_assignees FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM events e
            JOIN family_members fm ON e.family_id = fm.family_id
            WHERE e.id = event_assignees.event_id
            AND fm.profile_id = auth.uid()
        )
    );

-- 6. LISTS
-- Shopping or Todo lists.
CREATE TABLE lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('shopping', 'todo')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lists viewable by family members" 
    ON lists FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.family_id = lists.family_id
            AND fm.profile_id = auth.uid()
        )
    );

CREATE POLICY "Lists manageable by family members" 
    ON lists FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.family_id = lists.family_id
            AND fm.profile_id = auth.uid()
        )
    );

-- 7. LIST ITEMS
-- Items inside lists.
CREATE TABLE list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "List items viewable by family members" 
    ON list_items FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM lists l
            JOIN family_members fm ON l.family_id = fm.family_id
            WHERE l.id = list_items.list_id
            AND fm.profile_id = auth.uid()
        )
    );

CREATE POLICY "List items manageable by family members" 
    ON list_items FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM lists l
            JOIN family_members fm ON l.family_id = fm.family_id
            WHERE l.id = list_items.list_id
            AND fm.profile_id = auth.uid()
        )
    );
