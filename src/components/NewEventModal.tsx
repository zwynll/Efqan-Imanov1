import { useState } from "react";
import { STUDENTS } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NewEventModalProps {
  teamId: string;
  onClose: () => void;
}

const NewEventModal = ({ teamId, onClose }: NewEventModalProps) => {
  const { toast } = useToast();
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [event, setEvent] = useState("");
  const [scoreChange, setScoreChange] = useState("");
  const [note, setNote] = useState("");

  const students = STUDENTS.filter(s => s.teamId === teamId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId || !event || !scoreChange) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Bütün məcburi sahələri doldurun",
      });
      return;
    }

    // Here you would normally send to backend
    toast({
      title: "Uğurlu",
      description: "Yeni hadisə əlavə edildi",
    });
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">Yeni İntizam Hadisəsi</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">Kursant *</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Kursant seçin" />
              </SelectTrigger>
              <SelectContent>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} {student.fatherName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tarix *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event">Hadisə *</Label>
            <Input
              id="event"
              placeholder="Məsələn: Dərsdən izinsiz yox olma"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="score">Bal Dəyişikliyi *</Label>
            <Input
              id="score"
              type="number"
              placeholder="+10 və ya -5"
              value={scoreChange}
              onChange={(e) => setScoreChange(e.target.value)}
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Qeyd</Label>
            <Textarea
              id="note"
              placeholder="Əlavə məlumat (məcburi deyil)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-secondary border-border"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Ləğv et
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary">
              Əlavə et
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewEventModal;
