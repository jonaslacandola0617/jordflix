import {
  ArrowDown10,
  ArrowDownZA,
  ArrowUp01,
  ArrowUpAZ,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSearchParams } from "react-router";

function Sort() {
  const [searParams, setSearchParams] = useSearchParams();
  const sortBy = searParams.get("sortBy");

  function sortByTitle() {
    if (searParams.get("sortBy") === "title.asc")
      searParams.set("sortBy", "title.desc");
    else searParams.set("sortBy", "title.asc");

    setSearchParams(searParams);
  }

  function sortByPopularity() {
    if (searParams.get("sortBy") === "popularity.asc")
      searParams.set("sortBy", "popularity.desc");
    else searParams.set("sortBy", "popularity.asc");

    setSearchParams(searParams);
  }

  function sortByReleased() {
    if (searParams.get("sortBy") === "release_date.asc")
      searParams.set("sortBy", "release_date.desc");
    else searParams.set("sortBy", "release_date.asc");

    setSearchParams(searParams);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="sm">
          <span>Sort by</span>
          <ArrowUpDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={sortByTitle}>
          <span>Movie/Series Title</span>
          {sortBy === "title.desc" ? (
            <ArrowUpAZ />
          ) : sortBy === "title.asc" ? (
            <ArrowDownZA />
          ) : (
            <ArrowUpAZ />
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={sortByPopularity}>
          <span>Popularity</span>
          {sortBy === "popularity.desc" ? (
            <ArrowUp01 />
          ) : sortBy === "popularity.asc" ? (
            <ArrowDown10 />
          ) : (
            <ArrowUp01 />
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={sortByReleased}>
          <span>Release Year</span>
          {sortBy === "release_date.desc" ? (
            <ArrowUp01 />
          ) : sortBy === "release_date.asc" ? (
            <ArrowDown10 />
          ) : (
            <ArrowUp01 />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Sort;
