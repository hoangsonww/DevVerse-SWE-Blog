-- DevVerse Notifications, Permissions & Advanced Features Schema
-- Author: Son Nguyen
-- Created: 2025-03-24

-- Notifications Table
CREATE TABLE devverse.notifications (
                                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                        user_id UUID REFERENCES devverse.users(id) ON DELETE CASCADE,
                                        type TEXT NOT NULL,
                                        payload JSONB NOT NULL,
                                        read BOOLEAN NOT NULL DEFAULT FALSE,
                                        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user_read ON devverse.notifications(user_id, read);

-- Comment Reactions
CREATE TABLE devverse.comment_reactions (
                                            user_id UUID REFERENCES devverse.users(id) ON DELETE CASCADE,
                                            comment_id UUID REFERENCES devverse.comments(id) ON DELETE CASCADE,
                                            reaction TEXT CHECK(reaction IN ('like','love','laugh','angry','sad')),
                                            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                                            PRIMARY KEY(user_id, comment_id)
);

-- Article Revision History
CREATE TABLE devverse.article_revisions (
                                            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                            article_id UUID REFERENCES devverse.articles(id) ON DELETE CASCADE,
                                            editor_id UUID REFERENCES devverse.users(id) ON DELETE SET NULL,
                                            diff JSONB NOT NULL,
                                            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Subscriptions (to topics)
CREATE TABLE devverse.topic_subscriptions (
                                              user_id UUID REFERENCES devverse.users(id) ON DELETE CASCADE,
                                              topic_id UUID REFERENCES devverse.topics(id) ON DELETE CASCADE,
                                              created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                                              PRIMARY KEY(user_id, topic_id)
);

-- Permissions Table
CREATE TABLE devverse.permissions (
                                      role user_role NOT NULL,
                                      resource TEXT NOT NULL,
                                      action TEXT NOT NULL,
                                      PRIMARY KEY(role, resource, action)
);

-- Seed default permissions
INSERT INTO devverse.permissions(role, resource, action) VALUES
                                                             ('admin','*','*'),
                                                             ('editor','articles','create'),
                                                             ('editor','articles','update'),
                                                             ('editor','articles','publish'),
                                                             ('author','articles','create'),
                                                             ('author','articles','update'),
                                                             ('reader','articles','read'),
                                                             ('reader','comments','create');

-- Function to check permission
CREATE FUNCTION devverse.has_permission(user_id UUID, resource TEXT, action TEXT) RETURNS BOOLEAN LANGUAGE plpgsql AS $$
DECLARE user_role user_role;
BEGIN
SELECT role INTO user_role FROM devverse.users WHERE id = user_id;
RETURN EXISTS(
    SELECT 1 FROM devverse.permissions WHERE (role = user_role OR role = 'admin') AND (resource = resource OR resource = '*') AND (action = action OR action = '*')
);
END; $$;

-- Trigger to notify on new comment
CREATE FUNCTION devverse.notify_comment() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
INSERT INTO devverse.notifications(user_id, type, payload)
VALUES(
          (SELECT author_id FROM devverse.articles WHERE id = NEW.article_id),
          'comment',
          jsonb_build_object('comment_id', NEW.id, 'article_id', NEW.article_id, 'user_id', NEW.user_id)
      );
RETURN NEW;
END; $$;

CREATE TRIGGER trig_notify_comment AFTER INSERT ON devverse.comments FOR EACH ROW EXECUTE FUNCTION devverse.notify_comment();

-- Materialized view: unread notifications count
CREATE MATERIALIZED VIEW devverse.unread_notification_counts AS
SELECT user_id, COUNT(*) AS unread_count FROM devverse.notifications WHERE read = FALSE GROUP BY user_id;

CREATE FUNCTION devverse.refresh_unread_counts() RETURNS void LANGUAGE sql AS $$ REFRESH MATERIALIZED VIEW devverse.unread_notification_counts; $$;

-- Cleanup old notifications daily
CREATE FUNCTION devverse.cleanup_notifications() RETURNS void LANGUAGE sql AS $$ DELETE FROM devverse.notifications WHERE created_at < now() - interval '90 days'; $$;

-- Schedule cleanup (if pg_cron enabled)
-- SELECT cron.schedule('0 3 * * *', 'SELECT devverse.cleanup_notifications()');
