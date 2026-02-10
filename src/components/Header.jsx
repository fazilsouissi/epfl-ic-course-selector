import ThemeSwitcher from "./ThemeSwitcher";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Plus, Download, Upload, FileText, Share2 } from "lucide-react";

const Header = ({sumOfCredits, sortBy, setSortBy, onAutoPlace, onExport, onImport, onExplore, onShare}) => {
  
  const handleSortChange = (value) => {
    setSortBy([value]);
    localStorage.setItem("sortBy", JSON.stringify(value));
  };

  return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-20 w-full">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground m-0 tracking-tight whitespace-nowrap">
              <a href="https://edu.epfl.ch/studyplan/en/bachelor/computer-science/" className="text-primary hover:underline">
                EPFL
              </a>
              <span className="text-muted-foreground mx-1">/</span>
              <span className="text-foreground">Selector</span>
            </h1>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
              {sumOfCredits}/120
            </span>
          </div>
          
          {/* Mobile-only ThemeSwitcher (visible only on small screens) */}
          <div className="sm:hidden">
             <ThemeSwitcher />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            onClick={onAutoPlace}
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5 hidden sm:flex"
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter cours obligatoires
          </Button>
          <Button
            onClick={onShare}
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            title="Partager votre sélection"
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            onClick={onExport}
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            title="Exporter la configuration"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button
            onClick={onImport}
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            title="Importer une configuration"
          >
            <Upload className="h-3.5 w-3.5" />
          </Button>
          <Button
            onClick={onExplore}
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            title="Explorer la liste des cours"
          >
            <FileText className="h-3.5 w-3.5" />
          </Button>
          <Select 
            value={sortBy[0]} 
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="h-8 text-xs w-full sm:w-[160px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sort by Credits">Sort by Credits</SelectItem>
              <SelectItem value="Sort by Blocks">Sort by Blocks</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Desktop-only ThemeSwitcher */}
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
  );
};

export default Header;
