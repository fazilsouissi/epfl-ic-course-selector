import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { cn } from "../lib/utils";
import Fuse from 'fuse.js';

import IndividualCourse from "./IndividualCourse";
import courseJson from "../json/courses.json";
import courseAbbreviations from "../json/course-abbreviations.json";


/**
 * Course component to display courses for a given season and search value.
 *
 * @param {Object} props - The component props.
 * @param {string} props.season - The season to filter courses by.
 * @param {string} props.searchValue - The search value to filter courses by.
 * @returns {JSX.Element} The rendered Course component.
 */

const Course = ({
                  season,
                  searchValue,
                  complementarySharedCourses,
                  setComplementarySharedCourses,
                  setSharedCourses,
                  sharedCourses,
                  selectedTags,
                  sortBy,
                  layout = 'default',
                  isHorsPlan = false
                }) => {
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const blockOrder = {
    "Bloc A": 1,
    "Bloc B": 2,
    "Bloc C": 3,
    "Bloc transversal SHS": 4,
    'Groupe "Cours à option"': 5,
    'Groupe "Physique/Bio"': 6,
    'Groupe I "projet"': 7
  };

  // let sortedCourses = filteredCourses;

  // Filter courses by season and search value when either changes
  useEffect(() => {
    // Filter courses by season
    let seasonFilteredCourses = Object.entries(complementarySharedCourses).filter(
        ([, courseInfos]) => {
          if (isHorsPlan) return true; // Show all hors-plan courses
          return season === "All" || courseInfos.season === season;
        }
    );

    // Apply category filter if selected
    if (selectedCategory) {
      seasonFilteredCourses = seasonFilteredCourses.filter(([, courseInfos]) => 
        courseInfos.category === selectedCategory
      );
    }

    // Map tags to credits if tags are present
    const selectedTagsAsCredits = selectedTags.map(tag => tag.replace(/\D/g, ''));

    // Smart search with prefix matching, abbreviations, and category support
    let filtered = seasonFilteredCourses;
    
    if (searchValue.trim()) {
      const searchTerm = searchValue.trim();
      const searchLower = searchTerm.toLowerCase();
      const searchUpper = searchTerm.toUpperCase();
      
      // 1. Check for exact abbreviation match (including categories)
      const expandedSearch = courseAbbreviations[searchTerm] || courseAbbreviations[searchUpper];
      
      if (expandedSearch) {
        // Check if it's a category search (starts with @CATEGORY:)
        if (expandedSearch.startsWith('@CATEGORY:')) {
          const categoryName = expandedSearch.replace('@CATEGORY:', '');
          filtered = seasonFilteredCourses.filter(([, courseInfos]) => 
            courseInfos.category === categoryName
          );
        } else {
          // Use exact abbreviation match for course names
          filtered = seasonFilteredCourses.filter(([courseName]) => 
            courseName.toLowerCase().includes(expandedSearch.toLowerCase())
          );
        }
      } else {
        // 2. Search by prefix (courses starting with search term)
        const prefixMatches = seasonFilteredCourses.filter(([courseName]) => 
          courseName.toLowerCase().startsWith(searchLower)
        );
        
        // 3. Search for abbreviation patterns (e.g., "CL" matches "Computer Language")
        const abbreviationMatches = seasonFilteredCourses.filter(([courseName]) => {
          const words = courseName.split(/\s+/);
          const initials = words.map(w => w[0]).join('').toLowerCase();
          return initials.startsWith(searchLower) && prefixMatches.every(([name]) => name !== courseName);
        });
        
        // 4. Fuzzy search for typos and partial matches
        const fuse = new Fuse(seasonFilteredCourses, {
          keys: ['0'],
          threshold: 0.4,
          ignoreLocation: true,
          minMatchCharLength: 2
        });
        const fuseResults = fuse.search(searchTerm).map(result => result.item);
        const fuzzyMatches = fuseResults.filter(([courseName]) => 
          !prefixMatches.some(([name]) => name === courseName) &&
          !abbreviationMatches.some(([name]) => name === courseName)
        );
      
        // Combine results: prefix first, then abbreviations, then fuzzy
        filtered = [...prefixMatches, ...abbreviationMatches, ...fuzzyMatches];
      }
    }
    
    // Filter out courses that are already placed in columns (sharedCourses)
    filtered = filtered.filter(([courseName]) => 
      !sharedCourses[courseName]
    );
    
    // Filter by selected credit tags
    filtered = filtered.filter(([courseName, courseInfos]) =>
        selectedTagsAsCredits.length === 0 || selectedTagsAsCredits.includes(courseInfos.credits)
    );

    // Sort based on `sortBy` value
    const sorted = filtered.sort((a, b) => {
      if (String(sortBy) === "Sort by Credits") {
        return Number(b[1].credits) - Number(a[1].credits);
      } else if (String(sortBy) === "Sort by Blocks") {
        return blockOrder[a[1].block] - blockOrder[b[1].block];
      }
      return 0; // Default case if no sorting
    });

    setFilteredCourses(sorted); // Update the state with sorted courses

  }, [season, searchValue, complementarySharedCourses, selectedTags, sortBy, isHorsPlan, selectedCategory]);

  /**
   * Adjusts the font size of the course names to fit inside the container.
   */
//   useEffect(() => {
//     const fontToStringLength = {};
//
//     const stringLength = {}
//
//     function adjustFontSizeToFit() {
//       const textElements = document.querySelectorAll(".span-course"); // Correct class selector
//       if (textElements.length === 0) return; // Ensure elements are available
//
//       textElements.forEach((node) => {
//         const container = node.parentElement;
//         const containerWidth = container.clientWidth;
//         const containerHeight = container.clientHeight;
//
//         let fontSize = 15;
//
//         if (node.classList.contains("span-cr")) {
//           node.style.fontSize = 13 + "px";
//         } else {
//           while (
//               node.scrollWidth > containerWidth ||
//               node.scrollHeight + fontSize + 2 > containerHeight
//               ) {
//             fontSize--;
//             node.style.fontSize = fontSize + "px";
//           }
//         }
//       });
//
//       // logic to scrape the font size depending on the length of the string
//       textElements.forEach((node) => {
//         stringLength[node.innerText.length] = 1 + (stringLength[node.innerText.length] || 0);
//         if (fontToStringLength[node.style.fontSize])
//           fontToStringLength[node.style.fontSize] = {
//             ...fontToStringLength[node.style.fontSize],
//             "length": [...fontToStringLength[node.style.fontSize].length, node.innerText.length],
//             "count": fontToStringLength[node.style.fontSize].count + 1,
//             "innerText": [...fontToStringLength[node.style.fontSize].innerText, node.innerText]
//           };
//         else
//           fontToStringLength[node.style.fontSize] = {
//             "length": [node.innerText.length],
//             "count": 1,
//             "innerText": [node.innerText]
//           };
//         // if (node.innerText.length === 24) {
//         //   console.log(node.innerText, node.innerText.length);
//         // }
//         // if (node.innerText.length === 35) {
//         //   console.log(node.innerText, node.innerText.length);
//         // }
//       });
//
//       Object.keys(fontToStringLength).forEach((fontSize) => {
//   const lengths = fontToStringLength[fontSize].length;
//   const minLength = Math.min(...lengths);
//   const maxLength = Math.max(...lengths);
//   fontToStringLength[fontSize].minLength = minLength;
//   fontToStringLength[fontSize].maxLength = maxLength;
// });
//
//       console.table(fontToStringLength);
//
//     }
//
//     // Call the function after the component has mounted and the DOM is ready
//     adjustFontSizeToFit();
//
//     // Add window resize event listener
//     window.addEventListener("resize", adjustFontSizeToFit);
//
//     // Clean up the event listener on unmount
//     return () => {
//       window.removeEventListener("resize", adjustFontSizeToFit);
//     };
//   }, [filteredCourses]);

  const handleDrop = (event) => {
    event.preventDefault();
    const courseName = event.dataTransfer.getData("courseName");
    const courseInfos = courseJson[courseName];

    removeCourseFromColumn(courseName, setSharedCourses)(event)
  };

  const getLayoutClasses = () => {
    const baseCard = "shadow-none mb-4 border-0 bg-transparent";
    const baseHeader = "py-2 px-4 border-b border-border/40 bg-card/95 backdrop-blur sticky top-0 z-30";
    const baseTitle = "text-left text-xs font-bold uppercase tracking-wider text-muted-foreground";
    const baseContent = "p-2";
    const baseGrid = "grid grid-cols-1 gap-1";

    switch (layout) {
      case 'kanban':
      case 'list':
      case 'compact':
      default:
        return {
          card: baseCard,
          header: baseHeader,
          title: baseTitle,
          content: baseContent,
          grid: baseGrid
        };
    }
  };

  const classes = getLayoutClasses();

  return (
      <Card className={classes.card}>
        <CardHeader className={classes.header}>
          <CardTitle className={classes.title}>
            {isHorsPlan ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <span>Hors-plan</span>
                  <span className="text-[10px] font-normal text-muted-foreground/60">mis à jour le 10 février 2026</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "px-2 py-1 text-[10px] font-medium rounded border transition-colors",
                      selectedCategory === null
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setSelectedCategory('HEC')}
                    className={cn(
                      "px-2 py-1 text-[10px] font-medium rounded border transition-colors",
                      selectedCategory === 'HEC'
                        ? "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 border-red-300 dark:border-red-500/30"
                        : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    HEC
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Master IC')}
                    className={cn(
                      "px-2 py-1 text-[10px] font-medium rounded border transition-colors",
                      selectedCategory === 'Master IC'
                        ? "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 border-red-300 dark:border-red-500/30"
                        : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    Master IC
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Autre section')}
                    className={cn(
                      "px-2 py-1 text-[10px] font-medium rounded border transition-colors",
                      selectedCategory === 'Autre section'
                        ? "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 border-red-300 dark:border-red-500/30"
                        : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    Autre section
                  </button>
                </div>
              </div>
            ) : (
              <span>{season.toLowerCase() === "fall" ? "Fall" : "Spring"} Courses</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent
           onDrop={handleDrop}
           onDragOver={(event) => {
             event.preventDefault();
           }}
           className={classes.content}
        >
        {String(sortBy) === "Sort by Credits" &&
            <div className={classes.grid}>
                {/* Render all filtered courses */}
                {filteredCourses.map(([courseName, courseInfos], index) => (
                    <IndividualCourse key={`${courseName}-${index}`} courseName={courseName}
                                      onClick={addCourseToColumn(courseInfos, courseName,
                                          undefined, setSharedCourses)}
                                      courseInfos={courseInfos}
                                      layout={layout}/>
                ))}
            </div>
        }
        {String(sortBy) === "Sort by Blocks" && (
              <div className="flex flex-col gap-2">
                {Object.entries(
                    filteredCourses.reduce((acc, [courseName, courseInfos]) => {
                      const blockName = courseInfos.block;
                      if (!acc[blockName]) acc[blockName] = [];
                      acc[blockName].push([courseName, courseInfos]);
                      return acc;
                    }, {})
                )
                .sort(([blockA], [blockB]) => (blockOrder[blockA] || 99) - (blockOrder[blockB] || 99))
                .map(([blockName, courses]) => (
                  <div key={blockName} className="mb-4">
                    <h5 className="py-2 px-3 text-sm font-bold bg-primary text-primary-foreground rounded-md mb-3 border">{blockName}</h5>
                    <div className="flex flex-col gap-2 pl-2">
                      {courses.map(([courseName, courseInfos], index) => (
                        <IndividualCourse
                            key={`${courseName}-${index}`}
                            courseName={courseName}
                            onClick={addCourseToColumn(courseInfos, courseName, undefined, setSharedCourses)}
                            courseInfos={courseInfos}
                            layout={layout}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
        )}
        </CardContent>
      </Card>
  );
};

Course.propTypes = {
  season: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
};

export default Course;


// Handle adding a course and removing it from the DOM
export const addCourseToColumn = (courseInfos, courseName, ba, setSharedCourses) => (e) => {
  ba = ba !== undefined ? ba : courseInfos.ba;
  e.preventDefault();
  setSharedCourses((prevCourses) => {
    // Initialize newCourses with a copy of prevCourses
    let newCourses = {...prevCourses};

    // Check if the course exists in prevCourses
    if (Object.keys(newCourses).some((name) => name === courseName)) {
      // Remove the course if it exists
      delete newCourses[courseName];
      console.log(`Course ${courseName} clicked and removed from its respective BA${ba} courses`);
    }

    // Otherwise, add the course to newCourses
    const {credits, season, block, category} = courseInfos;
    newCourses[courseName] = {ba, credits, season, block, category};

    // Return the updated courses object
    return newCourses;
  });

};

export const removeCourseFromColumn = (courseName, setSharedCourses) => {
  return (e) => {
    e.preventDefault();
    setSharedCourses((prevCourses) => {
      if (Object.keys(prevCourses).some((name) => name === courseName)) {
        // remove the course
        const newCourses = {...prevCourses};
        delete newCourses[courseName];
        console.log(`Course ${courseName} ${e.type === "click" ? "clicked" : "dropped"} 
        and removed from its respective BA courses`);
        return newCourses;
      }
      return prevCourses; // Return the same state if the course is already present
    });
  };
}

