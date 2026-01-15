import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CourseLeadership, CourseLeadershipStaff } from "@/types";
import { Mail, Phone, Award, Pencil, Plus, Users, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CourseStaffInfoModal from "./CourseStaffInfoModal";

interface CourseLeadershipModalProps {
  leadership: CourseLeadership;
  onClose: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
}

const CourseLeadershipModal = ({ leadership, onClose, onEdit, canEdit }: CourseLeadershipModalProps) => {
  const [showStaffList, setShowStaffList] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<CourseLeadershipStaff | null>(null);

  const initials = leadership.fullName
    ? leadership.fullName
        .split(' ')
        .map((n) => n[0] ?? '')
        .join('')
        .toUpperCase()
        .slice(0, 2) || "KR"
    : "KR";

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Kurs Rəhbərliyi</DialogTitle>
          <DialogDescription>
            Kurs rəhbərinin əlaqə məlumatları və tərcümeyi-halı
          </DialogDescription>
          {canEdit && onEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-end gap-2"
              onClick={() => {
                onClose();
                onEdit();
              }}
            >
              <Pencil className="w-4 h-4" />
              Redaktə et
            </Button>
          )}
        </DialogHeader>

        <div className="space-y-6 pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={leadership.photoUrl} alt={leadership.fullName} />
              <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">
                  {leadership.fullName || "Kurs rəhbəri əlavə edilməyib"}
                </h3>
              {leadership.rank && (
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Award className="w-4 h-4" />
                  {leadership.rank}
                </p>
              )}
              {leadership.position && (
                <p className="text-sm text-muted-foreground mt-1">{leadership.position}</p>
              )}
            </div>
          </div>

          {leadership.bio && (
            <div className="border border-border rounded-lg p-4 bg-card">
              <h4 className="font-semibold text-foreground mb-2">Haqqında</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{leadership.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leadership.email && (
              <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{leadership.email}</p>
                </div>
              </div>
            )}

            {leadership.phone && (
              <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefon</p>
                  <p className="text-sm font-medium text-foreground">{leadership.phone}</p>
                </div>
              </div>
            )}
          </div>

          {(leadership.additionalStaff?.length ?? 0) > 0 && (
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between text-sm"
                onClick={() => setShowStaffList((prev) => !prev)}
              >
                <span className="font-semibold">Kursun əlavə rəhbər heyəti</span>
                {showStaffList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>

              {showStaffList && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {leadership.additionalStaff?.map((member) => (
                    <div
                      key={member.id}
                      className="border border-border/70 rounded-lg p-4 bg-card/70 backdrop-blur-sm space-y-2"
                    >
                      <div className="flex items-start gap-3">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.fullName}
                            className="w-12 h-12 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{member.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.position || "Vəzifə qeyd edilməyib"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedStaff(member)}
                          title="Məlumata bax"
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {canEdit && onEdit && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed border-primary/40 text-primary/80 bg-primary/5 hover:bg-primary/10 gap-2"
              onClick={() => {
                onClose();
                onEdit();
              }}
            >
              <Plus className="w-4 h-4" />
              Əlavə rəhbər heyətini redaktə et
            </Button>
          )}
        </div>
      </DialogContent>

      {selectedStaff && (
        <CourseStaffInfoModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </Dialog>
  );
};

export default CourseLeadershipModal;
