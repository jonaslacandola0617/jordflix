import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <div className="fixed w-full top-0 flex justify-center p-4 z-50">
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
              <Link to="/tv-series">TV Series</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
