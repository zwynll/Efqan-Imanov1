import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Phone, Award, User } from "lucide-react";
import { CourseLeadershipStaff } from "@/types";

interface CourseStaffInfoModalProps {
  staff: CourseLeadershipStaff;
  onClose: () => void;
}

const CourseStaffInfoModal = ({ staff, onClose }: CourseStaffInfoModalProps) => {
  const initials = staff.fullName
    ? staff.fullName
        .split(' ')
        .map((n) => n[0] ?? '')
        .join('')
        .toUpperCase()
        .slice(0, 2) || "RH"
    : "RH";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Rəhbər heyət üzvü</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            {staff.photoUrl ? (
              <img
                src={staff.photoUrl}
                alt={staff.fullName}
                className="w-20 h-20 rounded-lg object-cover border border-border"
              />
            ) : (
              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 space-y-1">
              <p className="text-xl font-semibold text-foreground">{staff.fullName || "İlkin məlumat yoxdur"}</p>
              {staff.position && (
                <p className="text-sm text-muted-foreground">{staff.position}</p>
              )}
              {staff.rank && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  {staff.rank}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {staff.email && (
              <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-card">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{staff.email}</span>
              </div>
            )}
            {staff.phone && (
              <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-card">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{staff.phone}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseStaffInfoModal;


