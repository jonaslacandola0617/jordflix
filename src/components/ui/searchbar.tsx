import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

function Searchbar() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const navigate = useNavigate();

  function search() {
    if (query != "") navigate(`/search?query=${query}`);
  }

  return (
    <>
      <Search size={42} />
      <Input
        value={query}
        type="text"
        className="p-6"
        placeholder="Search your favorite movie or tv series"
        onChange={(el) => setQuery(el.target.value)}
      />
      <Button
        variant="default"
        className="p-6"
        onClick={search}
        disabled={query.trim() == ""}
      >
        Search Movie/Series
      </Button>
    </>
  );
}

export default Searchbar;
