import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
const API_URL = "http://localhost:4000/api";
import { CourseLeadership } from "@/types";
import { Upload, Plus, Trash2 } from "lucide-react";

interface EditCourseLeadershipModalProps {
  courseId: number;
  leadership: CourseLeadership | null;
  onClose: () => void;
  onSuccess: () => void;
}

type StaffForm = {
  id?: string;
  fullName: string;
  rank: string;
  position: string;
  email: string;
  phone: string;
  photoUrl: string;
};

const createEmptyStaffForm = (): StaffForm => ({
  fullName: "",
  rank: "",
  position: "",
  email: "",
  phone: "",
  photoUrl: "",
});

const EditCourseLeadershipModal = ({
  courseId,
  leadership,
  onClose,
  onSuccess,
}: EditCourseLeadershipModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(leadership?.photoUrl || "");
  const [formData, setFormData] = useState({
    fullName: leadership?.fullName || "",
    rank: leadership?.rank || "",
    position: leadership?.position || "",
    email: leadership?.email || "",
    phone: leadership?.phone || "",
    photoUrl: leadership?.photoUrl || "",
    bio: leadership?.bio || "",
  });
  const [staffMembers, setStaffMembers] = useState<StaffForm[]>(
    leadership?.additionalStaff?.map((member) => ({
      id: member.id,
      fullName: member.fullName,
      rank: member.rank || "",
      position: member.position || "",
      email: member.email || "",
      phone: member.phone || "",
      photoUrl: member.photoUrl || "",
    })) || []
  );
  const [staffFiles, setStaffFiles] = useState<(File | null)[]>(
    leadership?.additionalStaff?.map(() => null) || []
  );
  const [staffPreviews, setStaffPreviews] = useState<string[]>(
    leadership?.additionalStaff?.map((member) => member.photoUrl || "") || []
  );

  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addStaffMember = () => {
    setStaffMembers((prev) => [...prev, createEmptyStaffForm()]);
    setStaffFiles((prev) => [...prev, null]);
    setStaffPreviews((prev) => [...prev, ""]);
  };

  const removeStaffMember = (index: number) => {
    setStaffMembers((prev) => prev.filter((_, i) => i !== index));
    setStaffFiles((prev) => prev.filter((_, i) => i !== index));
    setStaffPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStaffMember = <K extends keyof StaffForm>(index: number, field: K, value: StaffForm[K]) => {
    setStaffMembers((prev) =>
      prev.map((member, i) =>
        i === index
          ? {
              ...member,
              [field]: value,
            }
          : member
      )
    );

    if (field === "photoUrl") {
      setStaffPreviews((prev) =>
        prev.map((preview, i) => (i === index ? (value as string) : preview))
      );
    }
  };

  const handleStaffPhotoChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setStaffPreviews((prev) =>
        prev.map((preview, i) => (i === index ? (reader.result as string) : preview))
      );
    };
    reader.readAsDataURL(file);

    setStaffFiles((prev) =>
      prev.map((existing, i) => (i === index ? file : existing))
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      let photoUrl = formData.photoUrl || null;

      // Photo upload - müvəqqəti olaraq base64 kimi saxlayırıq (local storage yoxdur)
      if (photoFile) {
        photoUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(photoFile);
        });
      }

      const payload = {
        course_id: courseId,
        full_name: formData.fullName,
        rank: formData.rank || null,
        position: formData.position || null,
        email: formData.email || null,
        phone: formData.phone || null,
        photo_url: photoUrl,
        bio: formData.bio || null,
        id: leadership?.id || null,
      };

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/leadership`, {
        method: "POST",
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

      // Staff members - backend-ə göndərilir
      const validStaffMembers = staffMembers
        .map((member, index) => ({
          ...member,
          originalIndex: index,
          fullName: member.fullName.trim(),
          position: member.position.trim(),
          rank: member.rank.trim(),
          email: member.email.trim(),
          phone: member.phone.trim(),
          photoUrl: member.photoUrl.trim(),
        }))
        .filter((member) => member.fullName.length > 0);

      // Staff members üçün photo upload - base64
      for (const member of validStaffMembers) {
        const staffFile = staffFiles[member.originalIndex];
        if (staffFile) {
          member.photoUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(staffFile);
          });
        }
      }

      // Staff members-i payload-a əlavə et
      payload.staff_members = validStaffMembers;

      toast({
        title: "Uğurlu",
        description: "Kurs rəhbərliyi məlumatları yeniləndi",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating course leadership:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Kurs rəhbərliyi yenilənərkən xəta baş verdi",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kurs rəhbərliyini redaktə et</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Ad Soyad</Label>
              <Input
                id="full-name"
                value={formData.fullName}
                onChange={handleChange("fullName")}
                placeholder="Tural Cəfərov"
                required
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rank">Rütbə</Label>
              <Input
                id="rank"
                value={formData.rank}
                onChange={handleChange("rank")}
                placeholder="Polkovnik-leytenant"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Vəzifə</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={handleChange("position")}
                placeholder="Kurs rəisi"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="example@domain.az"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange("phone")}
                placeholder="+994 XX XXX XX XX"
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Şəkil</Label>
            <div className="flex flex-col md:flex-row gap-4">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Rahbər şəkil önbaxışı"
                  className="w-28 h-28 object-cover rounded-lg border border-border"
                />
              )}
              <div className="flex-1 space-y-2">
                <label htmlFor="leadership-photo-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5" />
                    <span className="text-sm">Yeni şəkil yüklə</span>
                  </div>
                  <input
                    id="leadership-photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
                <Input
                  type="url"
                  value={formData.photoUrl}
                  onChange={handleChange("photoUrl")}
                  placeholder="və ya birbaşa şəkil linki əlavə et"
                  className="bg-secondary border-border"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Haqqında</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={handleChange("bio")}
              rows={5}
              placeholder="Kurs rəhbəri haqqında məlumat..."
              className="bg-secondary border-border"
            />
          </div>

          <div className="space-y-4 border border-dashed border-border rounded-lg p-4 bg-card/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Kursun əlavə rəhbər heyəti</h3>
                <p className="text-xs text-muted-foreground">
                  Kurs rəisinin müavinləri və digər vəzifəli şəxsləri əlavə edin
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" className="gap-2" onClick={addStaffMember}>
                <Plus className="w-4 h-4" />
                Yeni şəxs
              </Button>
            </div>

            {staffMembers.length === 0 && (
              <p className="text-xs text-muted-foreground italic">
                Hələ heç bir əlavə rəhbər heyəti üzvü əlavə edilməyib.
              </p>
            )}

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {staffMembers.map((member, index) => (
                <div key={member.id ?? `staff-${index}`} className="border border-border rounded-lg p-4 bg-card/70 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-foreground">
                      {member.fullName || `Şəxs ${index + 1}`}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStaffMember(index)}
                      className="text-muted-foreground hover:text-destructive"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Ad Soyad</Label>
                      <Input
                        value={member.fullName}
                        onChange={(e) => updateStaffMember(index, "fullName", e.target.value)}
                        placeholder="Məsələn, Kamran Əliyev"
                        className="bg-secondary border-border"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Vəzifə</Label>
                      <Input
                        value={member.position}
                        onChange={(e) => updateStaffMember(index, "position", e.target.value)}
                        placeholder="Kurs rəisinin müavini"
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Rütbə</Label>
                      <Input
                        value={member.rank}
                        onChange={(e) => updateStaffMember(index, "rank", e.target.value)}
                        placeholder="Mayor"
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Telefon</Label>
                      <Input
                        value={member.phone}
                        onChange={(e) => updateStaffMember(index, "phone", e.target.value)}
                        placeholder="+994 XX XXX XX XX"
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Email</Label>
                      <Input
                        value={member.email}
                        onChange={(e) => updateStaffMember(index, "email", e.target.value)}
                        placeholder="assistant@domain.az"
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Şəkil URL</Label>
                      <Input
                        value={member.photoUrl}
                        onChange={(e) => updateStaffMember(index, "photoUrl", e.target.value)}
                        placeholder="https://..."
                        className="bg-secondary border-border"
                      />
                      <label className="cursor-pointer">
                        <div className="border-2 border-dashed border-border rounded-lg p-3 hover:border-primary transition-colors flex items-center justify-center gap-2 text-xs">
                          <Upload className="w-4 h-4" />
                          <span>Şəkil yüklə</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleStaffPhotoChange(index, event)}
                        />
                      </label>
                      {staffPreviews[index] && (
                        <img
                          src={staffPreviews[index]}
                          alt="Əlavə rəhbər şəkil"
                          className="mt-2 w-20 h-20 object-cover rounded-lg border border-border"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Ləğv et
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-gradient-primary hover:bg-gradient-primary/90">
              {isSubmitting ? "Yenilənir..." : "Yadda saxla"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseLeadershipModal;
