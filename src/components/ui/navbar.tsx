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

export default function Navbar() {
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
              <div className="min-w-60 min-h-60 p-4">Genres Content</div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Countries</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="min-w-80 min-h-60 p-4">
                Countries Content lorem50
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
