import PropTypes from "prop-types";
import { cn } from "../lib/utils";

const IndividualCourse = ({courseName, courseInfos, onClick, layout = 'default'}) => {
  const credits = courseInfos.credits;
  const block = courseInfos.block || '';
  const category = courseInfos.category || '';

  const getBlockBadge = (block, category) => {
    const badges = {
      'A': { label: 'A', class: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border-blue-300 dark:border-blue-500/30' },
      'B': { label: 'B', class: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300 border-green-300 dark:border-green-500/30' },
      'C': { label: 'C', class: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border-purple-300 dark:border-purple-500/30' },
      'Options': { label: 'Opt', class: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300 border-orange-300 dark:border-orange-500/30' },
      'Physics/Bio': { label: 'Bio', class: 'bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-300 border-pink-300 dark:border-pink-500/30' },
      'Project': { label: 'Proj', class: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30' },
      'SHS': { label: 'SHS', class: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-300 dark:border-amber-500/30' },
      'Hors-plan': { 
        label: category === 'HEC' ? 'HEC' : category === 'Master IC' ? 'Master' : category === 'Autre section' ? 'Autre' : 'HP', 
        class: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 border-red-300 dark:border-red-500/30' 
      }
    };
    return badges[block] || null;
  };

  const getCreditColorClass = (credits) => {
    switch(String(credits)) {
      case "8": return "bg-[var(--color-8-credits-hover)] hover:bg-[var(--color-8-credits-selected)] border-[var(--color-8-credits-selected)]";
      case "6": return "bg-[var(--color-6-credits-hover)] hover:bg-[var(--color-6-credits-selected)] border-[var(--color-6-credits-selected)]";
      case "5": return "bg-[var(--color-5-credits-hover)] hover:bg-[var(--color-5-credits-selected)] border-[var(--color-5-credits-selected)]";
      case "4": return "bg-[var(--color-4-credits-hover)] hover:bg-[var(--color-4-credits-selected)] border-[var(--color-4-credits-selected)]";
      case "3": return "bg-[var(--color-3-credits-hover)] hover:bg-[var(--color-3-credits-selected)] border-[var(--color-3-credits-selected)]";
      case "2": return "bg-[var(--color-shs-2-credits-hover)] hover:bg-[var(--color-shs-2-credits-selected)] border-[var(--color-shs-2-credits-selected)]";
      default: return "bg-[var(--color-default-hover)] hover:bg-[var(--color-default-selected)] border-[var(--color-default-selected)]";
    }
  }

  const getLayoutClasses = () => {
    const baseContainer = "group relative flex items-center justify-between p-2.5 mb-2 rounded-lg border border-border/50 bg-background/80 hover:bg-background hover:border-primary/30 cursor-grab active:cursor-grabbing transition-all duration-200 shadow-sm hover:shadow-md select-none";
    const baseName = "flex-1 font-medium text-sm truncate mr-3 text-foreground/90 group-hover:text-primary transition-colors";
    const baseCredits = "font-bold text-xs whitespace-nowrap text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/10";

    switch (layout) {
      case 'kanban':
      case 'list':
      case 'compact':
      default:
        return {
          container: baseContainer,
          name: baseName,
          credits: baseCredits
        };
    }
  };

  const classes = getLayoutClasses();

  return (
      <div
          className={cn(
              classes.container,
              getCreditColorClass(credits)
          )}
          id={`course-${courseName.replace(/\s+/g, "-")}`}
          draggable
          onClick={onClick}
          onDragStart={(event) => {
            event.dataTransfer.setData("courseName", courseName)
          }}
      >
        <div className={cn(classes.name)} title={courseName}>
          {courseName}
        </div>
        <div className="flex items-center gap-1.5">
          <div className={classes.credits}>
            {courseInfos.credits} Cr
          </div>
          {getBlockBadge(block, category) && (
            <span className={cn(
              "px-1.5 py-0.5 text-[10px] font-bold rounded border uppercase flex-shrink-0",
              getBlockBadge(block, category).class
            )}>
              {getBlockBadge(block, category).label}
            </span>
          )}
        </div>
      </div>
  );
}

IndividualCourse.propTypes = {
  courseName: PropTypes.any,
  onClick: PropTypes.func,
  courseInfos: PropTypes.any,
  layout: PropTypes.string
};

export default IndividualCourse;