import { STUDENTS, RECORDS } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StudentHistoryModalProps {
  studentId: string;
  onClose: () => void;
}

const StudentHistoryModal = ({ studentId, onClose }: StudentHistoryModalProps) => {
  const student = STUDENTS.find(s => s.id === studentId);
  const records = RECORDS.filter(r => r.studentId === studentId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (!student) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">
            İntizam Tarixçəsi
          </DialogTitle>
          <p className="text-muted-foreground">
            {student.firstName} {student.lastName} {student.fatherName}
          </p>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border">
            <span className="text-muted-foreground">Cari Bal:</span>
            <Badge variant={student.currentScore > 0 ? "default" : "destructive"} className="text-lg">
              {student.currentScore > 0 ? '+' : ''}{student.currentScore}
            </Badge>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-secondary/50">
                  <TableHead className="text-foreground">Tarix</TableHead>
                  <TableHead className="text-foreground">Hadisə</TableHead>
                  <TableHead className="text-foreground text-center">Dəyişiklik</TableHead>
                  <TableHead className="text-foreground">Qeyd</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Hələlik qeyd yoxdur
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.id} className="border-border hover:bg-secondary/50">
                      <TableCell className="font-medium">
                        {new Date(record.date).toLocaleDateString('az-AZ')}
                      </TableCell>
                      <TableCell>{record.event}</TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold ${
                          record.scoreChange > 0 ? 'text-green-500' : 
                          record.scoreChange < 0 ? 'text-red-500' : 
                          'text-muted-foreground'
                        }`}>
                          {record.scoreChange > 0 ? '+' : ''}{record.scoreChange}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.note || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentHistoryModal;
