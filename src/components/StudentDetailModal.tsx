import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Calendar, Award, Briefcase, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Student, FamilyMember } from "@/types";

interface StudentDetailModalProps {
  studentId: string;
  onClose: () => void;
}

const StudentDetailModal = ({ studentId, onClose }: StudentDetailModalProps) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    loadStudentData();
  }, [studentId]);

  const loadStudentData = async () => {
    try {
      const { data: studentData, error: studentError } = await (supabase as any)
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;

      const { data: familyData } = await (supabase as any)
        .from('family_members')
        .select('*')
        .eq('student_id', studentId);

      if (studentData) {
        setStudent({
          id: studentData.id,
          firstName: studentData.first_name,
          lastName: studentData.last_name,
          fatherName: studentData.father_name,
          courseId: studentData.course_id,
          teamId: studentData.team_id,
          currentScore: studentData.current_score,
          birthDate: studentData.birth_date,
          birthPlace: studentData.birth_place,
          email: studentData.email,
          phone: studentData.phone,
          phoneHome: studentData.phone_home,
          registeredAddress: studentData.registered_address,
          currentAddress: studentData.current_address,
          workNumber: studentData.work_number,
          originLocation: studentData.origin_location,
          serviceStartYear: studentData.service_start_year,
          position: studentData.position,
          rank: studentData.rank,
          awards: studentData.awards,
          foreignLanguages: studentData.foreign_languages,
          sportsAchievements: studentData.sports_achievements,
          idCardNumber: studentData.id_card_number,
          serviceCardNumber: studentData.service_card_number,
          militaryService: studentData.military_service,
          height: studentData.height,
          weight: studentData.weight,
          photoUrl: studentData.photo_url,
        } as Student);
      }

      if (familyData) {
        setFamilyMembers(familyData.map((m: any) => ({
          id: m.id,
          studentId: m.student_id,
          relation: m.relation,
          fullName: m.full_name,
          birthDate: m.birth_date,
          birthPlace: m.birth_place,
          address: m.address,
          job: m.job,
          phoneMobile: m.phone_mobile,
          phoneHome: m.phone_home,
        })));
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">Kursant Anketi</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Əsas</TabsTrigger>
            <TabsTrigger value="additional">Əlavə</TabsTrigger>
            <TabsTrigger value="family">Ailə</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="flex items-center gap-6">
              {student.photoUrl ? (
                <img src={student.photoUrl} alt={student.firstName} className="w-24 h-24 rounded-full object-cover border-2 border-primary" />
              ) : (
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-4xl font-bold text-primary-foreground shadow-glow">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {student.firstName} {student.lastName} {student.fatherName}
                </h3>
                <Badge variant={student.currentScore > 0 ? "default" : "destructive"} className="mt-2">
                  Cari Bal: {student.currentScore > 0 ? '+' : ''}{student.currentScore}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={Calendar} label="Doğum tarixi" value={student.birthDate} />
              {student.birthPlace && <InfoItem icon={MapPin} label="Doğulduğu yer" value={student.birthPlace} />}
              <InfoItem icon={Mail} label="Email" value={student.email} />
              <InfoItem icon={Phone} label="Mobil" value={student.phone} />
              {student.phoneHome && <InfoItem icon={Phone} label="Ev telefonu" value={student.phoneHome} />}
              {student.registeredAddress && <InfoItem icon={MapPin} label="Qeydiyyat ünvanı" value={student.registeredAddress} />}
              {student.currentAddress && <InfoItem icon={MapPin} label="Yaşayış ünvanı" value={student.currentAddress} />}
            </div>
          </TabsContent>

          <TabsContent value="additional" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.rank && <InfoItem icon={Shield} label="Rütbə" value={student.rank} />}
              {student.position && <InfoItem icon={Briefcase} label="Vəzifə" value={student.position} />}
              {student.serviceStartYear && <InfoItem icon={Calendar} label="Xidmətə başlama" value={student.serviceStartYear.toString()} />}
              {student.workNumber && <InfoItem icon={User} label="İş nömrəsi" value={student.workNumber} />}
              {student.idCardNumber && <InfoItem icon={User} label="Şəxsiyyət vəsiqəsi" value={student.idCardNumber} />}
              {student.serviceCardNumber && <InfoItem icon={User} label="Xidməti vəsiqə" value={student.serviceCardNumber} />}
              {student.height && <InfoItem icon={User} label="Boy" value={`${student.height} sm`} />}
              {student.weight && <InfoItem icon={User} label="Çəki" value={`${student.weight} kq`} />}
            </div>
            {student.awards && (
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Təltiflər</p>
                <p className="text-foreground">{student.awards}</p>
              </div>
            )}
            {student.foreignLanguages && (
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Xarici dillər</p>
                <p className="text-foreground">{student.foreignLanguages}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="family" className="space-y-4">
            {familyMembers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Ailə məlumatı yoxdur</p>
            ) : (
              familyMembers.map((member) => (
                <div key={member.id} className="p-4 bg-secondary rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{member.fullName}</h4>
                    <Badge variant="outline">{member.relation}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {member.birthDate && <p><span className="text-muted-foreground">Doğum:</span> {member.birthDate}</p>}
                    {member.job && <p><span className="text-muted-foreground">İş:</span> {member.job}</p>}
                    {member.phoneMobile && <p><span className="text-muted-foreground">Tel:</span> {member.phoneMobile}</p>}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg border border-border">
    <Icon className="w-5 h-5 text-primary mt-0.5" />
    <div className="flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-foreground font-medium mt-1">{value}</p>
    </div>
  </div>
);

export default StudentDetailModal;
