import DropArea from "./DropArea";
import courseJson from "../json/courses.json";
import horsPlanCoursesJson from "../json/hors-plan-courses.json";
import {addCourseToColumn, removeCourseFromColumn} from "./Course.jsx";
import IndividualCourse from "./IndividualCourse.jsx";

const CourseColumn = ({
                        title,
                        ba,
                        sharedCourses,
                        setSharedCourses,
                        complementarySharedCourses,
                        setComplementarySharedCourses,
                        layout = 'default'
                      }) => {

  const getCreditsForBa = () => {
    return (Object.values(sharedCourses).filter(courseInfos => {
      const baValue = Number(ba.at(2));
      return courseInfos.ba === baValue;
    })).reduce((acc, course) => acc + Number(course.credits), 0)
  }

  const handleDrop = (event) => {
    event.preventDefault();
    const courseName = event.dataTransfer.getData("courseName");
    const courseInfos = courseJson[courseName];
    const targetBa = Number(ba.at(2));

    // Règle modulo 2: BA3/BA5 (impair) et BA4/BA6 (pair)
    // Si le cours est défini pour un BA, on peut le placer dans le même ou un BA supérieur de même parité
    const courseBa = courseInfos?.ba;
    
    if (courseName && courseBa) {
      // Vérifier la parité (modulo 2)
      const courseParity = courseBa % 2; // 0 pour pair (BA4, BA6), 1 pour impair (BA3, BA5)
      const targetParity = targetBa % 2;
      
      // Le cours peut être placé si:
      // 1. Même parité (BA3->BA5 ou BA4->BA6)
      // 2. Le semestre cible est >= au semestre d'origine
      if (courseParity === targetParity && targetBa >= courseBa) {
        addCourseToColumn(courseInfos, courseName, targetBa, setSharedCourses)(event);
      } else {
        console.log(`Course ${courseName} (BA${courseBa}) cannot be placed in BA${targetBa} - different parity or earlier semester`);
      }
    } else {
      console.log(`Course ${courseName} dropped but not added to BA${ba}`);
    }
  };

  const getLayoutClasses = () => {
    const baseSection = "transition-all duration-300 rounded-xl border border-border/40 bg-card/50 backdrop-blur-md shadow-sm hover:shadow-md flex flex-col";
    const baseTitle = "text-foreground flex items-center justify-between mb-3 font-bold text-sm uppercase tracking-wider opacity-80";
    const baseList = "flex flex-col gap-2 overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/30";

    switch (layout) {
      case 'kanban':
        return {
          section: `${baseSection} min-w-[300px] flex-1 h-full p-4`,
          title: baseTitle,
          list: baseList
        };
      case 'list':
        return {
          section: `${baseSection} w-full min-h-[250px] p-4`,
          title: baseTitle,
          list: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto flex-1 pr-1"
        };
      case 'compact':
      default:
        return {
          section: `${baseSection} w-full h-full p-3`,
          title: baseTitle,
          list: `${baseList} min-h-[200px]`
        };
    }
  };

  const classes = getLayoutClasses();

  return (
      <section className={classes.section}
               id={`section-${ba}`}
               onDrop={handleDrop}
               onDragOver={(event) => {
                 event.preventDefault();
               }}>
        <h2 className={classes.title}>
          {title} {getCreditsForBa()} Cr
        </h2>

        <DropArea onDrop={() => {
        }}/>

        <div className={classes.list}>
          {
            Object.entries(sharedCourses)
                .filter(([courseName, courseInfos]) => courseInfos.ba === Number(ba.at(2)))
                .sort(([, a], [, b]) => b.credits - a.credits)
                .map(([courseName, courseInfos], index) => {
                  // Enrich courseInfos with complete data from courseJson/horsPlanCoursesJson
                  const fullCourseInfo = courseJson[courseName] || horsPlanCoursesJson[courseName] || courseInfos;
                  const enrichedCourseInfos = {
                    ...courseInfos,
                    block: courseInfos.block || fullCourseInfo.block,
                    category: courseInfos.category || fullCourseInfo.category
                  };
                  
                  return (
                    <IndividualCourse 
                      key={`${courseName}-${index}`} 
                      courseName={courseName} 
                      courseInfos={enrichedCourseInfos}
                      onClick={removeCourseFromColumn(courseName, setSharedCourses)} 
                      layout={layout}
                    />
                  );
                })
          }
        </div>
      </section>
  );
};

export default CourseColumn;



