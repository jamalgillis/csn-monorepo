import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const resetAndSeed = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete ALL existing content and tags
    const allContent = await ctx.db.query("content").collect();
    for (const content of allContent) {
      await ctx.db.delete(content._id);
    }
    
    const allTags = await ctx.db.query("tags").collect();
    for (const tag of allTags) {
      await ctx.db.delete(tag._id);
    }

    console.log("Cleared existing data");

    // Now call the original seed function
    const sampleGenres = [
      { name: "Action", slug: "action", description: "High-energy films with intense sequences", color: "#ff4444" },
      { name: "Comedy", slug: "comedy", description: "Light-hearted and humorous content", color: "#ffaa00" },
      { name: "Drama", slug: "drama", description: "Character-driven emotional stories", color: "#4444ff" },
      { name: "Thriller", slug: "thriller", description: "Suspenseful and tension-filled content", color: "#aa0044" },
      { name: "Sci-Fi", slug: "sci-fi", description: "Science fiction and futuristic themes", color: "#00aaaa" },
      { name: "Horror", slug: "horror", description: "Scary and supernatural content", color: "#000000" },
      { name: "Romance", slug: "romance", description: "Love stories and romantic themes", color: "#ff69b4" },
      { name: "Documentary", slug: "documentary", description: "Non-fiction educational content", color: "#8b4513" },
      { name: "Animation", slug: "animation", description: "Animated films and series", color: "#9932cc" },
      { name: "Crime", slug: "crime", description: "Criminal investigations and heists", color: "#696969" },
    ];

    const sampleMovies = [
      {
        type: "show" as const,
        title: "Centex Primetime",
        description: "A flagship sports talk show from Centex Sports Network featuring in-depth interviews with Central Texas coaches, athletes, and sports personalities. The show provides exclusive access to the stories behind local sports, highlighting the passion and dedication of the Central Texas athletic community. From high school standouts to college programs, Centex Primetime delivers compelling sports content that celebrates the heart of Texas athletics.",
        release_date: "2024-01-01",
        runtime: 60,
        rating: "NR" as const,
        tag_names: ["Sports", "Documentary", "Talk Show"],
        tags: [],
        cast: ["Jalen Gillis", "Central Texas Athletes", "Local Coaches"],
        director: "Centex Sports Network",
        poster_url: "https://q1u9idchx6.ufs.sh/f/kC4KSKx35wVMuzGjEV9rDRudwjaLskETVQpItPhKzM6UY0Jv",
        backdrop_url: "https://q1u9idchx6.ufs.sh/f/kC4KSKx35wVMuzGjEV9rDRudwjaLskETVQpItPhKzM6UY0Jv",
        trailer_url: "https://c.themediacdn.com/embed/media/Wds3gq/iHcrqDlsARM/iFZxVJsWDMb_5",
        video_url: "https://c.themediacdn.com/embed/media/Wds3gq/iHcrqDlsARM/iFZxVJsWDMb_5",
        featured: true,
        trending: true,
        new_release: true,
        coming_soon: false,
        status: "published" as const,
        imdb_rating: 8.5,
        year: 2024,
        language: "English" as const,
      },
      {
        type: "show" as const,
        title: "McLennan Community College Volleyball",
        description: "Follow the MCC Highlanders volleyball team as they compete in the NJCAA conference. Experience every serve, spike, and block as these talented student-athletes pursue excellence on the court. This series provides complete coverage of home games, highlights, and special features on the players and coaching staff.",
        release_date: "2024-08-01",
        runtime: 90,
        rating: "NR" as const,
        tag_names: ["Sports", "Live Events"],
        tags: [],
        cast: ["MCC Volleyball Team", "MCC Coaching Staff"],
        director: "Centex Sports Network",
        poster_url: "https://q1u9idchx6.ufs.sh/f/kC4KSKx35wVMbzWtL8H7AKYN4MmljVkna2HbfStPpu9F5v3e",
        backdrop_url: "https://q1u9idchx6.ufs.sh/f/kC4KSKx35wVMbzWtL8H7AKYN4MmljVkna2HbfStPpu9F5v3e",
        trailer_url: "",
        video_url: "",
        featured: false,
        trending: true,
        new_release: true,
        coming_soon: true,
        status: "published" as const,
        imdb_rating: 8.2,
        year: 2024,
        language: "English" as const,
      },
      {
        type: "show" as const,
        title: "McLennan Community College Basketball",
        description: "Experience the excitement of MCC Highlanders basketball with full coverage of home games for both men's and women's teams. From thrilling buzzer-beaters to dominant performances, this series showcases the talent and determination of MCC's basketball program as they compete in the NJCAA conference.",
        release_date: "2024-08-01",
        runtime: 120,
        rating: "NR" as const,
        tag_names: ["Sports", "Live Events"],
        tags: [],
        cast: ["MCC Basketball Teams", "MCC Coaching Staff"],
        director: "Centex Sports Network",
        poster_url: "https://q1u9idchx6.ufs.sh/f/kC4KSKx35wVMjxxYUVTN4btaeGhgMVjzBRIHxrXLdQ1ZJ2Ev",
        backdrop_url: "https://q1u9idchx6.ufs.sh/f/kC4KSKx35wVMjxxYUVTN4btaeGhgMVjzBRIHxrXLdQ1ZJ2Ev",
        trailer_url: "",
        video_url: "",
        featured: false,
        trending: true,
        new_release: true,
        coming_soon: true,
        status: "published" as const,
        imdb_rating: 8.3,
        year: 2024,
        language: "English" as const,
      },
      {
        type: "show" as const,
        title: "Friday Night Flex w/ Jalen Gillis",
        description: "Join host Jalen Gillis for the ultimate high school football pre-game show in Central Texas. Friday Night Flex provides expert analysis, player spotlights, and predictions for the biggest matchups each week. With exclusive interviews and behind-the-scenes access, this show is the essential companion for every Texas high school football fan.",
        release_date: "2024-08-01",
        runtime: 60,
        rating: "NR" as const,
        tag_names: ["Sports", "Talk Show"],
        tags: [],
        cast: ["Jalen Gillis", "High School Coaches", "High School Athletes"],
        director: "Centex Sports Network",
        poster_url: "https://q1u9idchx6.ufs.sh/f/kC4KSKx35wVMJvVyoqSmoCrKG9LH8hFPNgd13ZY6zwB5sMxW",
        backdrop_url: "https://q1u9idchx6.ufs.sh/f/kC4KSKx35wVMJvVyoqSmoCrKG9LH8hFPNgd13ZY6zwB5sMxW",
        trailer_url: "",
        video_url: "",
        featured: true,
        trending: true,
        new_release: true,
        coming_soon: true,
        status: "published" as const,
        imdb_rating: 8.7,
        year: 2024,
        language: "English" as const,
      },
    ];

    // Insert tags (replacing genres)
    const tagIds: Record<string, any> = {};
    for (const genre of sampleGenres) {
      const tag = {
        name: genre.name,
        slug: genre.slug,
        group: "Sport" as const,  // Set all as Sport category for now
        description: genre.description,
        color: genre.color,
      };
      const id = await ctx.db.insert("tags", tag);
      tagIds[genre.name] = id;
    }

    // Insert content
    const contentIds = [];
    for (const content of sampleMovies) {
      const id = await ctx.db.insert("content", content);
      contentIds.push(id);
    }

    return {
      message: "Database reset and seeded successfully",
      data: {
        tags: sampleGenres.length,
        content: sampleMovies.length,
      },
    };
  },
});