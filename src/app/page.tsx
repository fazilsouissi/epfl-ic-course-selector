'use client'

import { useEffect, useState } from 'react'

import CourseForm from '@/components/CourseForm'
import CourseColumn from '@/components/CourseColumn'
import Header from '@/components/Header'
import Course from '@/components/Course'
import ImportExportModal from '@/components/ImportExportModal'
import ExploreListModal from '@/components/ExploreListModal'
import coursesData from '@/json/courses.json'
import horsPlanCoursesData from '@/json/hors-plan-courses.json'
import { useTheme } from '@/context/ThemeContext'

interface CourseInfo {
  credits: string | number
  ba?: string | number
  season: string
  block?: string
}

// Get shared courses from local storage
const getLocalSavedCourses = (): Record<string, CourseInfo> | null => {
  if (typeof window === 'undefined') return null
  const saved = localStorage.getItem('sharedCourses')
  return saved ? JSON.parse(saved) : null
}

// Get sort by from local storage
const getLocalSortBy = (): string => {
  if (typeof window === 'undefined') return 'Sort by Credits'
  const saved = localStorage.getItem('sortBy')
  return saved ? JSON.parse(saved) : 'Sort by Credits'
}

export default function Home() {
  const { layout } = useTheme()

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string[]>(['Sort by Credits'])
  const [isDragging, setIsDragging] = useState(false)
  const [sharedCourses, setSharedCourses] = useState<Record<string, CourseInfo>>({})
  const [complementarySharedCourses, setComplementarySharedCourses] = useState<Record<string, CourseInfo>>({})
  const [searchValue, setSearchValue] = useState('')
  const [includeHorsPlan, setIncludeHorsPlan] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExploreModal, setShowExploreModal] = useState(false)
  const [exportedJSON, setExportedJSON] = useState('')

  // Initialize from localStorage on mount
  useEffect(() => {
    const localSavedCourses = getLocalSavedCourses()
    const localSortBy = getLocalSortBy()

    if (localSavedCourses) {
      setSharedCourses(localSavedCourses)
    }
    setSortBy([localSortBy])
  }, [])

  // Update complementary courses when shared courses change
  useEffect(() => {
    // Save the sharedCourses in the local storage
    localStorage.setItem('sharedCourses', JSON.stringify(sharedCourses))

    // Merge coursesData with horsPlanCoursesData if includeHorsPlan is true
    const allCourses = includeHorsPlan
      ? { ...coursesData, ...horsPlanCoursesData }
      : coursesData

    const sharedCourseNames = new Set(Object.keys(sharedCourses))
    const complementaryCourses = Object.keys(allCourses)
      .filter((courseName) => !sharedCourseNames.has(courseName))
      .reduce(
        (acc, courseName) => {
          acc[courseName] = allCourses[courseName as keyof typeof allCourses]
          return acc
        },
        {} as Record<string, CourseInfo>
      )

    setComplementarySharedCourses(complementaryCourses)
  }, [sharedCourses, includeHorsPlan])

  const getSumOfCredits = () => {
    return Object.values(sharedCourses).reduce((acc, course) => acc + Number(course.credits), 0)
  }

  const autoPlaceMandatoryCourses = () => {
    const mandatoryCourses: Record<string, CourseInfo> = {}

    Object.entries(coursesData).forEach(([courseName, courseInfo]) => {
      // Place mandatory courses (blocks A, B, C, SHS)
      if (courseInfo.block && ['A', 'B', 'C', 'SHS'].includes(courseInfo.block) && courseInfo.ba) {
        mandatoryCourses[courseName] = courseInfo
      }
    })

    setSharedCourses(mandatoryCourses)
  }

  const handleExportConfiguration = () => {
    const config = {
      courses: sharedCourses,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }

    setExportedJSON(JSON.stringify(config, null, 2))
    setShowExportModal(true)
  }

  const handleImportConfiguration = () => {
    setShowImportModal(true)
  }

  const handleImportConfirm = (jsonContent: string) => {
    try {
      const config = JSON.parse(jsonContent)

      if (config.courses) {
        setSharedCourses(config.courses)
        setShowImportModal(false)
        alert('Configuration importée avec succès!')
      } else {
        alert('Format de fichier invalide')
      }
    } catch (error) {
      alert('Erreur lors de la lecture du JSON')
      console.error(error)
    }
  }

  const handleExploreList = () => {
    setShowExploreModal(true)
  }

  // Layout-specific classes
  const getLayoutClasses = () => {
    // Sidebar: 40% height on mobile, full height fixed width on desktop
    const baseSidebar =
      'w-full h-[40vh] md:h-full md:w-[320px] lg:w-[350px] flex flex-col border-b md:border-b-0 md:border-r border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl z-20 flex-shrink-0 transition-all duration-300'

    // Wide sidebar for columns view (2 columns side by side)
    const wideSidebar =
      'w-full h-[40vh] md:h-full md:w-[500px] lg:w-[550px] xl:w-[600px] flex flex-col border-b md:border-b-0 md:border-r border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl z-20 flex-shrink-0 transition-all duration-300'

    // Container is now always flex-col (Header on top, content below)
    const baseContainer = 'flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans'
    // Content wrapper handles the split between sidebar and main
    const baseContentWrapper = 'flex flex-col md:flex-row flex-1 overflow-hidden relative'
    const baseCourseList = 'flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40'
    const columnsCourseList = 'flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-4'

    switch (layout) {
      case 'kanban':
        return {
          container: baseContainer,
          contentWrapper: baseContentWrapper,
          sidebar: baseSidebar,
          main: 'flex-1 flex flex-row gap-4 p-4 overflow-x-auto overflow-y-hidden bg-muted/10 scrollbar-thin scrollbar-thumb-primary/20',
          courseList: baseCourseList,
        }
      case 'list':
        return {
          container: baseContainer,
          contentWrapper: baseContentWrapper,
          sidebar: baseSidebar,
          main: 'flex-1 flex flex-col gap-4 p-4 overflow-y-auto bg-muted/10 scrollbar-thin scrollbar-thumb-primary/20',
          courseList: baseCourseList,
        }
      case 'columns':
        return {
          container: baseContainer,
          contentWrapper: baseContentWrapper,
          sidebar: wideSidebar,
          main: 'flex-1 flex flex-row gap-4 p-4 overflow-x-auto overflow-y-hidden bg-muted/10 scrollbar-thin scrollbar-thumb-primary/20',
          courseList: columnsCourseList,
        }
      case 'compact':
      default: // Default to Grid (Compact)
        return {
          container: baseContainer,
          contentWrapper: baseContentWrapper,
          sidebar: baseSidebar,
          main: 'flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-y-auto bg-muted/10 scrollbar-hide',
          courseList: baseCourseList,
        }
    }
  }

  const layoutClasses = getLayoutClasses()

  return (
    <div className={layoutClasses.container}>
      <Header
        sumOfCredits={getSumOfCredits()}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onAutoPlace={autoPlaceMandatoryCourses}
        onExport={handleExportConfiguration}
        onImport={handleImportConfiguration}
        onExplore={handleExploreList}
      />

      {showExportModal && (
        <ImportExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          type="export"
          content={exportedJSON}
        />
      )}

      {showImportModal && (
        <ImportExportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          type="import"
          onImport={handleImportConfirm}
        />
      )}

      {showExploreModal && (
        <ExploreListModal
          isOpen={showExploreModal}
          onClose={() => setShowExploreModal(false)}
          sharedCourses={sharedCourses}
        />
      )}

      {showImportModal && (
        <ImportExportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          type="import"
          onConfirm={handleImportConfirm}
        />
      )}

      <div className={layoutClasses.contentWrapper}>
        <div className={layoutClasses.sidebar}>
          <CourseForm
            setSearchValue={setSearchValue}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            includeHorsPlan={includeHorsPlan}
            setIncludeHorsPlan={setIncludeHorsPlan}
          />

          <div className={layoutClasses.courseList}>
            <Course
              season="Fall"
              searchValue={searchValue}
              complementarySharedCourses={complementarySharedCourses}
              setComplementarySharedCourses={setComplementarySharedCourses}
              sharedCourses={sharedCourses}
              setSharedCourses={setSharedCourses}
              selectedTags={selectedTags}
              sortBy={sortBy}
              layout={layout}
            />
            <Course
              season="Spring"
              searchValue={searchValue}
              complementarySharedCourses={complementarySharedCourses}
              setComplementarySharedCourses={setComplementarySharedCourses}
              sharedCourses={sharedCourses}
              setSharedCourses={setSharedCourses}
              selectedTags={selectedTags}
              sortBy={sortBy}
              layout={layout}
            />

            {!includeHorsPlan && (
              <Course
                season="Hors-plan"
                searchValue={searchValue}
                complementarySharedCourses={horsPlanCoursesData}
                setComplementarySharedCourses={() => { }}
                sharedCourses={sharedCourses}
                setSharedCourses={setSharedCourses}
                selectedTags={selectedTags}
                sortBy={sortBy}
                layout={layout}
                isHorsPlan={true}
              />
            )}
          </div>
        </div>

        <main className={layoutClasses.main}>
          <CourseColumn
            title="BA3"
            ba="BA3"
            sharedCourses={sharedCourses}
            setSharedCourses={setSharedCourses}
            complementarySharedCourses={complementarySharedCourses}
            setComplementarySharedCourses={setComplementarySharedCourses}
            layout={layout}
          />
          <CourseColumn
            title="BA4"
            ba="BA4"
            sharedCourses={sharedCourses}
            setSharedCourses={setSharedCourses}
            complementarySharedCourses={complementarySharedCourses}
            setComplementarySharedCourses={setComplementarySharedCourses}
            layout={layout}
          />
          <CourseColumn
            title="BA5"
            ba="BA5"
            sharedCourses={sharedCourses}
            setSharedCourses={setSharedCourses}
            complementarySharedCourses={complementarySharedCourses}
            setComplementarySharedCourses={setComplementarySharedCourses}
            layout={layout}
          />
          <CourseColumn
            title="BA6"
            ba="BA6"
            sharedCourses={sharedCourses}
            setSharedCourses={setSharedCourses}
            complementarySharedCourses={complementarySharedCourses}
            setComplementarySharedCourses={setComplementarySharedCourses}
            layout={layout}
          />
        </main>
      </div>
    </div>
  )
}
