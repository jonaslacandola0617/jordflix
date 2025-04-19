import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router";
import { Switch } from "./switch";
import { useTheme } from "@/contexts/ThemeContext";
import useGenres from "@/features/movies/useGenres";

const countries = [
  { code: "AR", name: "Argentina" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "CN", name: "China" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IN", name: "India" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "LU", name: "Luxembourg" },
  { code: "MX", name: "Mexico" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NO", name: "Norway" },
  { code: "PL", name: "Poland" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "ZA", name: "South Africa" },
  { code: "KR", name: "South Korea" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TW", name: "Taiwan" },
  { code: "TH", name: "Thailand" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
];

export default function Navbar() {
  const { data: genres } = useGenres();
  const { theme, setTheme } = useTheme();

  function toggleMode() {
    if (theme === "dark") setTheme("light");
    else setTheme("dark");
  }

  return (
    <div className="sticky w-full mx-auto top-0 flex justify-center p-4 z-50 ">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/" className="font-semibold">
                Jordflix
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Genres</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="min-w-96 min-h-60 grid grid-cols-2 p-4">
                {genres?.map((genre) => (
                  <NavigationMenuLink
                    key={genre.id}
                    href={`/movies/genres/${genre.id}-${genre.name}`}
                  >
                    {genre.name}
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Countries</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="min-w-[668px] min-h-60 grid grid-cols-4 p-4">
                {countries?.map((country) => (
                  <NavigationMenuLink
                    key={country.code}
                    href={`/movies/countries/${country.code}`}
                  >
                    {country.name}
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/movies">Movies</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/series">TV Series</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <div className="flex items-center gap-2">
              <Switch
                checked={theme === "dark" ? true : false}
                onCheckedChange={() => toggleMode()}
              />
            </div>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
