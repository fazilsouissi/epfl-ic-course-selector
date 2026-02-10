import {useState} from "react";
import PropTypes from "prop-types";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";

const CourseForm = ({setSearchValue, selectedTags, setSelectedTags, includeHorsPlan, setIncludeHorsPlan}) => {
  const [courseData, setCourseData] = useState({
    course: "", status: "BA3", tags: [],
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setCourseData((prev) => {
      return {...prev, [name]: value};
    });
  };

  const handleFilterChange = (value) => {
    if (value === "All") {
      setSelectedTags([]);
    } else {
      setSelectedTags([value]);
    }
  };

  const currentFilter = selectedTags.length > 0 ? selectedTags[0] : "All";

  return (<header className="flex flex-col gap-2 p-3 border-b border-border/50 bg-card/50 backdrop-blur-sm">
    <form onSubmit={(e) => e.preventDefault()} className="flex">
      <div className="relative flex-1">
        <Input
            type="text"
            name="course"
            className="pl-8 h-9 text-sm bg-background/50 border-input focus:border-primary"
            placeholder="Search..."
            value={courseData.course}
            onChange={(e) => {
              setSearchValue(e.target.value)
              handleChange(e);
            }}
        />
      </div>
      
      <Select 
        value={currentFilter} 
        onValueChange={handleFilterChange}
      >
        <SelectTrigger className="h-9 w-[140px] text-xs">
          <SelectValue placeholder="Credits" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Credits</SelectItem>
          <SelectItem value="8 Credits">8 Credits</SelectItem>
          <SelectItem value="6 Credits">6 Credits</SelectItem>
          <SelectItem value="5 Credits">5 Credits</SelectItem>
          <SelectItem value="4 Credits">4 Credits</SelectItem>
          <SelectItem value="3 Credits">3 Credits</SelectItem>
          <SelectItem value="SHS - 2 Credits">SHS (2)</SelectItem>
        </SelectContent>
      </Select>
    </form>
    
    <Button 
      onClick={() => setIncludeHorsPlan(!includeHorsPlan)}
      variant={includeHorsPlan ? "default" : "outline"}
      className="h-9 text-xs w-full"
    >
      {includeHorsPlan ? "✓" : ""} Inclure Hors-plan
    </Button>
  </header>);
};

CourseForm.propTypes = {
  setSearchValue: PropTypes.func.isRequired,
  selectedTags: PropTypes.array.isRequired, 
  setSelectedTags: PropTypes.func.isRequired,
  includeHorsPlan: PropTypes.bool.isRequired,
  setIncludeHorsPlan: PropTypes.func.isRequired,
};

export default CourseForm;
