import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { DisciplineRecord } from "@/types";

interface DisciplineRecordFormProps {
  record: Partial<DisciplineRecord>;
  onChange: (record: Partial<DisciplineRecord>) => void;
  onRemove: () => void;
}

const DisciplineRecordForm = ({ record, onChange, onRemove }: DisciplineRecordFormProps) => {
  return (
    <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-foreground">Keçmiş intizam qeydi</h4>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>İl</Label>
          <Input
            type="number"
            value={record.year || ''}
            onChange={(e) => onChange({ ...record, year: parseInt(e.target.value) })}
            placeholder="2024"
            min="2000"
            max="2100"
          />
        </div>

        <div>
          <Label>Tarix</Label>
          <Input
            type="date"
            value={record.date || ''}
            onChange={(e) => onChange({ ...record, date: e.target.value })}
          />
        </div>

        <div>
          <Label>Bal dəyişikliyi</Label>
          <Input
            type="number"
            value={record.scoreChange || ''}
            onChange={(e) => onChange({ ...record, scoreChange: parseInt(e.target.value) })}
            placeholder="-5 və ya +3"
          />
        </div>

        <div className="md:col-span-3">
          <Label>Hadisə</Label>
          <Input
            value={record.event || ''}
            onChange={(e) => onChange({ ...record, event: e.target.value })}
            placeholder="Hadisənin qısa təsviri"
          />
        </div>

        <div className="md:col-span-3">
          <Label>Qeyd</Label>
          <Textarea
            value={record.note || ''}
            onChange={(e) => onChange({ ...record, note: e.target.value })}
            placeholder="Əlavə məlumat"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default DisciplineRecordForm;
