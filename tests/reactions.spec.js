const {
  addReaction,
  removeReaction,
  getArticleReactions,
  getUserReactions,
  hasUserReacted,
  REACTION_EMOJIS,
} = require("../supabase/reactions");

// Mock Supabase client
jest.mock("../supabase/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ data: null, error: null })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({ data: null, error: null })),
          })),
        })),
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              maybeSingle: jest.fn(() => ({ data: null, error: null })),
            })),
          })),
        })),
      })),
    })),
  },
}));

describe("Reactions Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("REACTION_EMOJIS", () => {
    it("contains all required emoji mappings", () => {
      expect(REACTION_EMOJIS).toEqual({
        like: "👍",
        love: "❤️",
        fire: "🔥",
        idea: "💡",
      });
    });
  });

  describe("addReaction", () => {
    it("should call supabase with correct parameters", async () => {
      const { supabase } = require("../supabase/supabaseClient");
      const mockInsert = jest.fn(() => ({ data: null, error: null }));
      supabase.from.mockReturnValue({ insert: mockInsert });

      await addReaction("user123", "test-article", "like");

      expect(supabase.from).toHaveBeenCalledWith("article_reactions");
      expect(mockInsert).toHaveBeenCalledWith([
        {
          user_id: "user123",
          article_slug: "test-article",
          reaction_type: "like",
        },
      ]);
    });
  });

  describe("removeReaction", () => {
    it("should call supabase delete with correct parameters", async () => {
      const { supabase } = require("../supabase/supabaseClient");
      const mockEq3 = jest.fn(() => ({ data: null, error: null }));
      const mockEq2 = jest.fn(() => ({ eq: mockEq3 }));
      const mockEq1 = jest.fn(() => ({ eq: mockEq2 }));
      const mockDelete = jest.fn(() => ({ eq: mockEq1 }));
      supabase.from.mockReturnValue({ delete: mockDelete });

      await removeReaction("user123", "test-article", "love");

      expect(supabase.from).toHaveBeenCalledWith("article_reactions");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq1).toHaveBeenCalledWith("user_id", "user123");
      expect(mockEq2).toHaveBeenCalledWith("article_slug", "test-article");
      expect(mockEq3).toHaveBeenCalledWith("reaction_type", "love");
    });
  });

  describe("getArticleReactions", () => {
    it("should return reaction counts for an article", async () => {
      const { supabase } = require("../supabase/supabaseClient");
      const mockEq = jest.fn(() => ({
        data: [
          { reaction_type: "like" },
          { reaction_type: "like" },
          { reaction_type: "fire" },
        ],
        error: null,
      }));
      const mockSelect = jest.fn(() => ({ eq: mockEq }));
      supabase.from.mockReturnValue({ select: mockSelect });

      const result = await getArticleReactions("test-article");

      expect(result.reactions).toEqual({
        like: 2,
        love: 0,
        fire: 1,
        idea: 0,
      });
      expect(result.error).toBeNull();
    });

    it("should handle empty reactions", async () => {
      const { supabase } = require("../supabase/supabaseClient");
      const mockEq = jest.fn(() => ({ data: [], error: null }));
      const mockSelect = jest.fn(() => ({ eq: mockEq }));
      supabase.from.mockReturnValue({ select: mockSelect });

      const result = await getArticleReactions("empty-article");

      expect(result.reactions).toEqual({
        like: 0,
        love: 0,
        fire: 0,
        idea: 0,
      });
    });
  });
});
