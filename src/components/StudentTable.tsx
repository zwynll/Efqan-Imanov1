import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, Eye, History, Edit, Trash2, Plus, Download, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
const API_URL = "http://localhost:4000/api";
import StudentDetailModal from "./StudentDetailModal";
import StudentHistoryModal from "./StudentHistoryModal";
import NewEventModal from "./NewEventModal";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import EditTeamModal from "./EditTeamModal";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { TEAMS, STUDENTS } from "@/data/mockData";
import { Team, Student as StudentType } from "@/types";

interface StudentTableProps {
  teamId: string;
  onBack: () => void;
}

const StudentTable = ({ teamId, onBack }: StudentTableProps) => {
  const { canEdit } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [historyStudent, setHistoryStudent] = useState<string | null>(null);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [showEditTeam, setShowEditTeam] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [teamId]);

  const convertSupabaseTeamToTeam = (data: any): Team => ({
    id: data.id,
    name: data.name,
    courseId: data.course_id,
    commander: data.commander ?? undefined,
    commanderRank: data.commander_rank ?? undefined,
    commanderContact: data.commander_contact ?? undefined,
    subCommander1: data.sub_commander_1 ?? data.sub_commander ?? undefined,
    subCommander1Rank: data.sub_commander_1_rank ?? data.sub_commander_rank ?? undefined,
    subCommander1Contact: data.sub_commander_1_contact ?? data.sub_commander_contact ?? undefined,
    subCommander2: data.sub_commander_2 ?? undefined,
    subCommander2Rank: data.sub_commander_2_rank ?? undefined,
    subCommander2Contact: data.sub_commander_2_contact ?? undefined,
    subCommander3: data.sub_commander_3 ?? undefined,
    subCommander3Rank: data.sub_commander_3_rank ?? undefined,
    subCommander3Contact: data.sub_commander_3_contact ?? undefined,
  });

  const convertMockStudentToSupabaseRow = (student: StudentType) => ({
    id: student.id,
    team_id: student.teamId,
    course_id: student.courseId,
    first_name: student.firstName,
    last_name: student.lastName,
    father_name: student.fatherName,
    current_score: student.currentScore,
    birth_date: student.birthDate,
    email: student.email,
    phone: student.phone,
    address: student.address ?? null,
    emergency_contact: student.emergencyContact ?? null,
  });

  const loadData = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      let mappedTeam: Team | null = null;

      // Load team
      try {
        const teamRes = await fetch(`${API_URL}/teams?courseId=1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (teamRes.ok) {
          const teams = await teamRes.json();
          const teamData = teams.find((t: any) => t.id === teamId);
          if (teamData) {
            mappedTeam = convertSupabaseTeamToTeam(teamData);
          }
        }
      } catch (error) {
        console.warn('Team fetch failed, using fallback data:', error);
      }

      if (!mappedTeam) {
        const fallbackTeam = TEAMS.find((t) => t.id === teamId);
        if (fallbackTeam) {
          mappedTeam = fallbackTeam;
        }
      }

      if (!mappedTeam) {
        throw new Error('Team not found');
      }

      setTeam(mappedTeam);

      // Load students
      let mappedStudents: any[] | null = null;
      try {
        const studentsRes = await fetch(`${API_URL}/students/team/${teamId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (studentsRes.ok) {
          mappedStudents = await studentsRes.json();
        }
      } catch (error) {
        console.warn('Students fetch failed, using fallback data:', error);
      }

      if (!mappedStudents || mappedStudents.length === 0) {
        mappedStudents = STUDENTS
          .filter((student) => student.teamId === teamId)
          .map(convertMockStudentToSupabaseRow);
      }

      setStudents(mappedStudents);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Komanda məlumatları tapılmadı",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(s => 
      `${s.first_name} ${s.last_name} ${s.father_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => 
      sortOrder === "asc" 
        ? a.current_score - b.current_score 
        : b.current_score - a.current_score
    );
  }, [students, searchQuery, sortOrder]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`${team?.name} - Kursant Siyahısı`, 14, 15);
    
    const tableData = filteredAndSortedStudents.map((s, i) => [
      i + 1,
      `${s.first_name} ${s.last_name} ${s.father_name}`,
      s.current_score,
      s.email,
      s.phone,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [['№', 'Ad Soyad Ata adı', 'Cari Bal', 'Email', 'Telefon']],
      body: tableData,
    });

    doc.save(`${team?.name}-kursantlar.pdf`);
    
    toast({
      title: "Uğurlu",
      description: "PDF fayl yükləndi",
    });
  };

  const handleExportExcel = () => {
    const exportData = filteredAndSortedStudents.map((s, i) => ({
      '№': i + 1,
      'Ad': s.first_name,
      'Soyad': s.last_name,
      'Ata adı': s.father_name,
      'Cari Bal': s.current_score,
      'Email': s.email,
      'Telefon': s.phone,
      'Doğum tarixi': s.birth_date,
      'Ünvan': s.address || '',
      'Təcili əlaqə': s.emergency_contact || '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kursantlar');
    XLSX.writeFile(wb, `${team?.name}-kursantlar.xlsx`);
    
    toast({
      title: "Uğurlu",
      description: "Excel fayl yükləndi",
    });
  };

  const handleDelete = async (studentId: string) => {
    if (!confirm('Kursantı silmək istədiyinizdən əminsiniz?')) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/students/${studentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Xəta baş verdi");

      toast({
        title: "Uğurlu",
        description: "Kursant silindi",
      });

      loadData();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Kursant silinərkən xəta baş verdi",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{team?.name}</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Komandir: {team?.commander || "Məlum deyil"}</span>
              {canEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                  onClick={() => setShowEditTeam(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
            {team && (team.subCommander1 || team.subCommander2 || team.subCommander3) && (
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                {[team.subCommander1, team.subCommander2, team.subCommander3]
                  .map((name, idx) => (name ? `${idx + 1}. ${name}` : null))
                  .filter(Boolean)
                  .map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleExportPDF} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            PDF
          </Button>
          <Button onClick={handleExportExcel} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Excel
          </Button>
          {canEdit && (
            <>
              <Button onClick={() => setShowAddStudent(true)} size="sm" className="gap-2 bg-gradient-primary">
                <UserPlus className="w-4 h-4" />
                Yeni kursant
              </Button>
              <Button onClick={() => setShowNewEvent(true)} size="sm" className="gap-2 bg-gradient-primary">
                <Plus className="w-4 h-4" />
                Yeni hadisə
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Ad, soyad və ya ata adı ilə axtar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          variant="outline"
        >
          Bal: {sortOrder === "asc" ? "Artan" : "Azalan"}
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-secondary/50">
              <TableHead className="text-foreground">№</TableHead>
              <TableHead className="text-foreground">Ad Soyad Ata adı</TableHead>
              <TableHead className="text-foreground text-center">Cari Bal</TableHead>
              <TableHead className="text-foreground text-right">Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Yüklənir...
                </TableCell>
              </TableRow>
            ) : filteredAndSortedStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Kursant tapılmadı
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedStudents.map((student, index) => (
                <TableRow key={student.id} className="border-border hover:bg-secondary/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell 
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setSelectedStudent(student.id)}
                  >
                    {student.first_name} {student.last_name} {student.father_name}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-semibold ${
                      student.current_score > 0 ? 'text-green-500' : 
                      student.current_score < 0 ? 'text-red-500' : 
                      'text-muted-foreground'
                    }`}>
                      {student.current_score > 0 ? '+' : ''}{student.current_score}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedStudent(student.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setHistoryStudent(student.id)}
                      >
                        <History className="w-4 h-4" />
                      </Button>
                      {canEdit && (
                        <>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setEditStudentId(student.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      {selectedStudent && (
        <StudentDetailModal
          studentId={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
      
      {historyStudent && (
        <StudentHistoryModal
          studentId={historyStudent}
          onClose={() => setHistoryStudent(null)}
        />
      )}

      {showNewEvent && (
        <NewEventModal
          teamId={teamId}
          onClose={() => setShowNewEvent(false)}
        />
      )}

      {showAddStudent && (
        <AddStudentModal
          teamId={teamId}
          courseId={team?.courseId}
          onClose={() => setShowAddStudent(false)}
          onSuccess={loadData}
        />
      )}

      {editStudentId && (
        <EditStudentModal
          studentId={editStudentId}
          onClose={() => setEditStudentId(null)}
          onSuccess={loadData}
        />
      )}

      {showEditTeam && team && (
        <EditTeamModal
          team={team}
          onClose={() => setShowEditTeam(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};

export default StudentTable;
