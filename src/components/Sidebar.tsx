import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="pb-12 w-60">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">AI Notes</h2>
          <div className="space-y-1">
            <Link to="/">
              <Button
                variant={location.pathname === "/" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            {/* <Link to="/favorites">
              <Button
                variant={
                  location.pathname === "/favorites" ? "secondary" : "ghost"
                }
                className="w-full justify-start"
              >
                <Star className="mr-2 h-4 w-4" />
                Favourites
              </Button>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
