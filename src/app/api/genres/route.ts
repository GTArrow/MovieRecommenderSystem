import { NextResponse } from "next/server";
import { genreMap } from "@/lib/genres";

// GET /api/genres - Returns all genres
export async function GET() {
    try {
      const genres = Object.entries(genreMap).map(([id, name]) => ({
        id: parseInt(id, 10),
        name,
      }));
  
      return NextResponse.json(genres);
    } catch (error: any) {
      console.error("[GET /api/genres]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

// Helper function to batch fetch genre name by ID
export async function batchFetchGenresById(ids: number[]): Promise<{ id: number; name: string }[]> {
    try {
      return ids
        .filter((id) => genreMap[id] !== undefined)
        .map((id) => ({
          id,
          name: genreMap[id],
        }));
    } catch (error) {
      console.error("[batchFetchGenresById] Failed to map genres:", error);
      return [];
    }
  }
