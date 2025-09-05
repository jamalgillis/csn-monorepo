"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function DebugContent() {
  const allContent = useQuery(api.debug.getAllContent);
  const tvShows = useQuery(api.debug.getTVShows);

  if (!allContent || !tvShows) {
    return <div className="p-4 text-white">Loading debug info...</div>;
  }

  return (
    <div className="p-4 text-white bg-gray-800 m-4 rounded">
      <h3 className="text-lg font-bold mb-2">Debug Info</h3>
      <div className="mb-4">
        <h4 className="font-semibold">Total Content: {allContent.length}</h4>
        <ul className="text-sm">
          {allContent.map((item, index) => (
            <li key={index}>
              {item.title} ({item.type}) - Status: {item.status}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold">TV Shows: {tvShows.length}</h4>
        <ul className="text-sm">
          {tvShows.map((show, index) => (
            <li key={index}>
              {show.title} - Status: {show.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}