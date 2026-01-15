import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Info, Plus } from "lucide-react";
import { COURSES } from "@/data/mockData";
import TeamGrid from "@/components/TeamGrid";
import CourseLeadershipModal from "@/components/CourseLeadershipModal";
import EditCourseLeadershipModal from "@/components/EditCourseLeadershipModal";
import TagimSection from "@/components/TagimSection";
import logoImage from "@/assets/logo.png";
import bannerImage from "@/assets/banner.jpeg";
const API_URL = "http://localhost:4000/api";
import { CourseLeadership } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, loading, logout, canViewAllCourses, canEdit } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<number>(1);
  const [courses, setCourses] = useState<typeof COURSES>(COURSES);
  const [selectedLeadership, setSelectedLeadership] = useState<CourseLeadership | null>(null);
  const [selectedLeadershipCourseId, setSelectedLeadershipCourseId] = useState<number | null>(null);
  const [showLeadershipModal, setShowLeadershipModal] = useState(false);
  const [showEditLeadershipModal, setShowEditLeadershipModal] = useState(false);
  const [courseLeaderships, setCourseLeaderships] = useState<Record<number, CourseLeadership | null>>({});

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/");
      return;
    }

    loadCourses();

    if (user.course) {
      setSelectedCourse(user.course);
    }
  }, [user, loading, navigate]);

  const loadCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const coursesList = data && data.length > 0 
          ? data.map((c: any) => ({
              id: c.id,
              name: c.name,
              teamCount: 0,
            }))
          : COURSES;
        setCourses(coursesList);
        
        // Load leadership for each course
        for (const course of coursesList) {
          const leadership = await loadCourseLeadership(course.id);
          setCourseLeaderships(prev => ({ ...prev, [course.id]: leadership }));
        }
      } else {
        setCourses(COURSES);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses(COURSES);
    }
  };

  const mapLeadership = (data: any): CourseLeadership => {
    const staff = (data.staff_members || []).map((s: any) => ({
      id: s.id,
      courseId: s.course_id,
      fullName: s.full_name,
      rank: s.rank ?? undefined,
      position: s.position ?? undefined,
      email: s.email ?? undefined,
      phone: s.phone ?? undefined,
      photoUrl: s.photo_url ?? undefined,
    }));
    
    return {
      id: data.id,
      courseId: data.course_id,
      fullName: data.full_name,
      rank: data.rank ?? undefined,
      position: data.position ?? undefined,
      email: data.email ?? undefined,
      phone: data.phone ?? undefined,
      photoUrl: data.photo_url ?? undefined,
      bio: data.bio ?? undefined,
      additionalStaff: staff.length > 0 ? staff : undefined,
    };
  };

  const loadCourseLeadership = async (courseId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/leadership/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Xəta baş verdi");
      }

      const data = await res.json();
      if (!data || data.length === 0) return null;

      const leadershipData = data[0];
      return mapLeadership(leadershipData);
    } catch (error) {
      console.error('Error loading course leadership:', error);
      return null;
    }
  };

  const showCourseLeadership = async (courseId: number) => {
    setSelectedLeadershipCourseId(courseId);
    const leadership = await loadCourseLeadership(courseId);

    if (leadership) {
      setSelectedLeadership(leadership);
      setShowLeadershipModal(true);
    } else if (canEdit) {
      setSelectedLeadership(null);
      setShowEditLeadershipModal(true);
    } else {
      toast({
        title: "Məlumat yoxdur",
        description: "Bu kurs üçün rəhbərlik məlumatı tapılmadı",
      });
    }
  };

  const openLeadershipEditor = async (courseId: number) => {
    setSelectedLeadershipCourseId(courseId);
    const leadership = await loadCourseLeadership(courseId);
    setSelectedLeadership(leadership);
    setShowLeadershipModal(false);
    setShowEditLeadershipModal(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const availableCourses = canViewAllCourses
    ? courses
    : courses.filter(c => c.id === user?.course);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground">Yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background with banner image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-glow relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-glow p-1">
                <img src={logoImage} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Əyani Hüquq Fakültəsi</h1>
                <p className="text-sm text-muted-foreground">{user?.name}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Çıxış
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-[1]">
        <Tabs defaultValue="courses" className="space-y-6">
          <div className="flex gap-2 border-b border-border">
            <TabsList className="bg-transparent">
              <TabsTrigger value="courses">Kurslar</TabsTrigger>
              <TabsTrigger value="tagim">Tagim</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="courses" className="space-y-6">
            <Tabs
              value={selectedCourse.toString()}
              onValueChange={(v) => setSelectedCourse(parseInt(v))}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availableCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedCourse === course.id
                        ? 'border-primary bg-gradient-primary text-primary-foreground shadow-glow'
                        : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{course.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${
                          selectedCourse === course.id
                            ? 'text-primary-foreground hover:bg-white/20'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          showCourseLeadership(course.id);
                        }}
                        title="Kurs Rəhbərliyi"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className={`text-sm mt-1 ${
                      selectedCourse === course.id
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground'
                    }`}>
                      {course.teamCount} taqım
                    </p>
                    {courseLeaderships[course.id] ? (
                      <div className="mt-3 p-2 rounded bg-card/50 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Kurs rəhbəri</p>
                        <p className={`text-sm font-semibold ${
                          selectedCourse === course.id
                            ? 'text-primary-foreground'
                            : 'text-foreground'
                        }`}>
                          {courseLeaderships[course.id]?.rank && `${courseLeaderships[course.id]?.rank} `}
                          {courseLeaderships[course.id]?.fullName}
                        </p>
                      </div>
                    ) : canEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full border-dashed border-primary/40 text-primary/80 bg-primary/5 hover:bg-primary/10 gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          openLeadershipEditor(course.id);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Kurs rəhbərliyi əlavə et
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {availableCourses.map((course) => (
                <TabsContent key={course.id} value={course.id.toString()} className="space-y-4">
                  <TeamGrid courseId={course.id} />
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          <TabsContent value="tagim" className="space-y-4">
            <TagimSection />
          </TabsContent>
        </Tabs>
      </main>

      {showLeadershipModal && selectedLeadership && (
        <CourseLeadershipModal
          leadership={selectedLeadership}
          canEdit={canEdit}
          onClose={() => {
            setShowLeadershipModal(false);
            setSelectedLeadership(null);
          }}
          onEdit={() => {
            setShowLeadershipModal(false);
            setShowEditLeadershipModal(true);
          }}
        />
      )}

      {showEditLeadershipModal && selectedLeadershipCourseId !== null && (
        <EditCourseLeadershipModal
          courseId={selectedLeadershipCourseId}
          leadership={selectedLeadership}
          onClose={() => {
            setShowEditLeadershipModal(false);
            if (selectedLeadership) {
              setShowLeadershipModal(true);
            }
          }}
          onSuccess={async () => {
            const leadership = await loadCourseLeadership(selectedLeadershipCourseId);
            setSelectedLeadership(leadership);
            setCourseLeaderships(prev => ({ ...prev, [selectedLeadershipCourseId]: leadership }));
            setShowEditLeadershipModal(false);
            if (leadership) {
              setShowLeadershipModal(true);
            } else {
              toast({
                title: "Məlumat yaradıldı",
                description: "Kurs rəhbərliyi məlumatı əlavə olundu",
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
