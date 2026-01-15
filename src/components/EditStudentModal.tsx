import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
const API_URL = "http://localhost:4000/api";
import { Upload, Plus } from "lucide-react";
import FamilyMemberForm from "./FamilyMemberForm";
import DisciplineRecordForm from "./DisciplineRecordForm";
import { FamilyMember, DisciplineRecord } from "@/types";

interface EditStudentModalProps {
  studentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EditStudentModal = ({ studentId, onClose, onSuccess }: EditStudentModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [familyMembers, setFamilyMembers] = useState<Partial<FamilyMember>[]>([]);
  const [disciplineRecords, setDisciplineRecords] = useState<Partial<DisciplineRecord>[]>([]);
  
  const [studentData, setStudentData] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    birthDate: "",
    birthPlace: "",
    registeredAddress: "",
    currentAddress: "",
    workNumber: "",
    originLocation: "",
    serviceStartYear: "",
    position: "",
    rank: "",
    awards: "",
    foreignLanguages: "",
    sportsAchievements: "",
    idCardNumber: "",
    serviceCardNumber: "",
    email: "",
    phone: "",
    phoneHome: "",
    address: "",
    emergencyContact: "",
    militaryService: false,
    height: "",
    weight: "",
    photoUrl: "",
  });

  useEffect(() => {
    loadStudent();
    loadFamilyMembers();
    loadDisciplineRecords();
  }, [studentId]);

  const loadStudent = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Kursant tapılmadı");

      const data = await res.json();
      setStudentData(data);

      setFormData({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        fatherName: data.father_name || "",
        birthDate: data.birth_date || "",
        birthPlace: data.birth_place || "",
        registeredAddress: data.registered_address || "",
        currentAddress: data.current_address || "",
        workNumber: data.work_number || "",
        originLocation: data.origin_location || "",
        serviceStartYear: data.service_start_year?.toString() || "",
        position: data.position || "",
        rank: data.rank || "",
        awards: data.awards || "",
        foreignLanguages: data.foreign_languages || "",
        sportsAchievements: data.sports_achievements || "",
        idCardNumber: data.id_card_number || "",
        serviceCardNumber: data.service_card_number || "",
        email: data.email || "",
        phone: data.phone || "",
        phoneHome: data.phone_home || "",
        address: data.address || "",
        emergencyContact: data.emergency_contact || "",
        militaryService: data.military_service === 1 || false,
        height: data.height?.toString() || "",
        weight: data.weight?.toString() || "",
        photoUrl: data.photo_url || "",
      });
      
      if (data.photo_url) {
        setPhotoPreview(data.photo_url);
      }

      // Load family members and discipline records from the same response
      if (data.family_members) {
        setFamilyMembers(data.family_members.map((m: any) => ({
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

      if (data.discipline_records) {
        setDisciplineRecords(data.discipline_records.map((r: any) => ({
          id: r.id,
          studentId: r.student_id,
          year: r.year,
          date: r.date,
          event: r.event,
          scoreChange: r.score_change,
          note: r.note,
        })));
      }
    } catch (error) {
      console.error('Error loading student:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Kursant məlumatları yüklənərkən xəta baş verdi",
      });
    }
  };

  const loadFamilyMembers = async () => {
    // Already loaded in loadStudent
  };

  const loadDisciplineRecords = async () => {
    // Already loaded in loadStudent
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, {}]);
  };

  const removeFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const updateFamilyMember = (index: number, member: Partial<FamilyMember>) => {
    const updated = [...familyMembers];
    updated[index] = member;
    setFamilyMembers(updated);
  };

  const addDisciplineRecord = () => {
    setDisciplineRecords([...disciplineRecords, {}]);
  };

  const removeDisciplineRecord = (index: number) => {
    setDisciplineRecords(disciplineRecords.filter((_, i) => i !== index));
  };

  const updateDisciplineRecord = (index: number, record: Partial<DisciplineRecord>) => {
    const updated = [...disciplineRecords];
    updated[index] = record;
    setDisciplineRecords(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let photoUrl = formData.photoUrl;

      // Upload new photo if provided - base64
      if (photoFile) {
        photoUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(photoFile);
        });
      }

      const token = localStorage.getItem("token");
      const payload = {
        team_id: studentData?.team_id,
        course_id: studentData?.course_id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        father_name: formData.fatherName,
        birth_date: formData.birthDate,
        birth_place: formData.birthPlace || null,
        registered_address: formData.registeredAddress || null,
        current_address: formData.currentAddress || null,
        work_number: formData.workNumber || null,
        origin_location: formData.originLocation || null,
        service_start_year: formData.serviceStartYear ? parseInt(formData.serviceStartYear) : null,
        position: formData.position || null,
        rank: formData.rank || null,
        awards: formData.awards || null,
        foreign_languages: formData.foreignLanguages || null,
        sports_achievements: formData.sportsAchievements || null,
        id_card_number: formData.idCardNumber || null,
        service_card_number: formData.serviceCardNumber || null,
        email: formData.email,
        phone: formData.phone,
        phone_home: formData.phoneHome || null,
        address: formData.address || null,
        emergency_contact: formData.emergencyContact || null,
        military_service: formData.militaryService,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        photo_url: photoUrl,
        family_members: familyMembers,
        discipline_records: disciplineRecords,
      };

      const res = await fetch(`${API_URL}/students/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Xəta baş verdi");
      }

      toast({
        title: "Uğurlu",
        description: "Kursant məlumatları yeniləndi",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error updating student:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: error.message || "Kursant yenilənərkən xəta baş verdi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kursant Məlumatlarını Redaktə Et</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Əsas Məlumat</TabsTrigger>
              <TabsTrigger value="additional">Əlavə Məlumat</TabsTrigger>
              <TabsTrigger value="family">Ailə</TabsTrigger>
              <TabsTrigger value="history">Tarixçə</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Şəkil</Label>
                <div className="flex items-center gap-4">
                  {photoPreview && (
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded-lg border border-border"
                    />
                  )}
                  <div className="flex-1">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary transition-colors flex items-center justify-center gap-2">
                        <Upload className="w-5 h-5" />
                        <span className="text-sm">Yeni şəkil seç</span>
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Ad *</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Soyad *</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ata adı *</Label>
                  <Input
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Doğum tarixi *</Label>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Doğulduğu yer</Label>
                  <Input
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mobil telefon *</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ev telefonu</Label>
                  <Input
                    type="tel"
                    value={formData.phoneHome}
                    onChange={(e) => setFormData({ ...formData, phoneHome: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Təcili əlaqə</Label>
                  <Input
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Qeydiyyatda olduğu ünvan</Label>
                  <Textarea
                    value={formData.registeredAddress}
                    onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hal-hazırda yaşadığı ünvan</Label>
                  <Textarea
                    value={formData.currentAddress}
                    onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>İş nömrəsi</Label>
                  <Input
                    value={formData.workNumber}
                    onChange={(e) => setFormData({ ...formData, workNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Haradan gəlib</Label>
                  <Input
                    value={formData.originLocation}
                    onChange={(e) => setFormData({ ...formData, originLocation: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>DİN-də xidmətə başlama ili</Label>
                  <Input
                    type="number"
                    value={formData.serviceStartYear}
                    onChange={(e) => setFormData({ ...formData, serviceStartYear: e.target.value })}
                    placeholder="2020"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Vəzifəsi</Label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rütbəsi</Label>
                  <Input
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Şəxsiyyət vəsiqəsinin №</Label>
                  <Input
                    value={formData.idCardNumber}
                    onChange={(e) => setFormData({ ...formData, idCardNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Xidməti vəsiqəsinin №</Label>
                  <Input
                    value={formData.serviceCardNumber}
                    onChange={(e) => setFormData({ ...formData, serviceCardNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Boy (sm)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Çəki (kq)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="militaryService"
                    checked={formData.militaryService}
                    onCheckedChange={(checked) => setFormData({ ...formData, militaryService: checked as boolean })}
                  />
                  <Label htmlFor="militaryService" className="cursor-pointer">
                    Hərbi xidmətdə olub
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dövlət təltifləri / mükafatlar</Label>
                <Textarea
                  value={formData.awards}
                  onChange={(e) => setFormData({ ...formData, awards: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Bildiyi xarici dillər</Label>
                <Input
                  value={formData.foreignLanguages}
                  onChange={(e) => setFormData({ ...formData, foreignLanguages: e.target.value })}
                  placeholder="İngilis dili, Rus dili"
                />
              </div>

              <div className="space-y-2">
                <Label>İdman nailiyyətləri / dərəcə</Label>
                <Textarea
                  value={formData.sportsAchievements}
                  onChange={(e) => setFormData({ ...formData, sportsAchievements: e.target.value })}
                  rows={2}
                />
              </div>
            </TabsContent>

            <TabsContent value="family" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Ailə üzvləri</h3>
                <Button type="button" onClick={addFamilyMember} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Əlavə et
                </Button>
              </div>

              {familyMembers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Ailə üzvü əlavə edilməyib
                </p>
              ) : (
                <div className="space-y-4">
                  {familyMembers.map((member, index) => (
                    <FamilyMemberForm
                      key={index}
                      member={member}
                      onChange={(updated) => updateFamilyMember(index, updated)}
                      onRemove={() => removeFamilyMember(index)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Keçmiş intizam qeydləri</h3>
                <Button type="button" onClick={addDisciplineRecord} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Əlavə et
                </Button>
              </div>

              {disciplineRecords.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Keçmiş qeyd əlavə edilməyib
                </p>
              ) : (
                <div className="space-y-4">
                  {disciplineRecords.map((record, index) => (
                    <DisciplineRecordForm
                      key={index}
                      record={record}
                      onChange={(updated) => updateDisciplineRecord(index, updated)}
                      onRemove={() => removeDisciplineRecord(index)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Ləğv et
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Yüklənir..." : "Yadda saxla"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentModal;
