import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { FamilyMember } from "@/types";

interface FamilyMemberFormProps {
  member: Partial<FamilyMember>;
  onChange: (member: Partial<FamilyMember>) => void;
  onRemove: () => void;
}

const FamilyMemberForm = ({ member, onChange, onRemove }: FamilyMemberFormProps) => {
  return (
    <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-foreground">Ailə üzvü</h4>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Qohumluq əlaqəsi</Label>
          <Select
            value={member.relation || ''}
            onValueChange={(value) => onChange({ ...member, relation: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ata">Ata</SelectItem>
              <SelectItem value="Ana">Ana</SelectItem>
              <SelectItem value="Qardaş">Qardaş</SelectItem>
              <SelectItem value="Bacı">Bacı</SelectItem>
              <SelectItem value="Qohum">Qohum</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Ad, Soyad, Ata adı</Label>
          <Input
            value={member.fullName || ''}
            onChange={(e) => onChange({ ...member, fullName: e.target.value })}
            placeholder="Tam ad daxil edin"
          />
        </div>

        <div>
          <Label>Doğum tarixi</Label>
          <Input
            type="date"
            value={member.birthDate || ''}
            onChange={(e) => onChange({ ...member, birthDate: e.target.value })}
          />
        </div>

        <div>
          <Label>Doğulduğu yer</Label>
          <Input
            value={member.birthPlace || ''}
            onChange={(e) => onChange({ ...member, birthPlace: e.target.value })}
            placeholder="Şəhər, rayon"
          />
        </div>

        <div>
          <Label>Ünvan</Label>
          <Input
            value={member.address || ''}
            onChange={(e) => onChange({ ...member, address: e.target.value })}
            placeholder="Yaşayış ünvanı"
          />
        </div>

        <div>
          <Label>İş yeri</Label>
          <Input
            value={member.job || ''}
            onChange={(e) => onChange({ ...member, job: e.target.value })}
            placeholder="İş yeri və vəzifə"
          />
        </div>

        <div>
          <Label>Mobil telefon</Label>
          <Input
            value={member.phoneMobile || ''}
            onChange={(e) => onChange({ ...member, phoneMobile: e.target.value })}
            placeholder="+994"
          />
        </div>

        <div>
          <Label>Ev telefonu</Label>
          <Input
            value={member.phoneHome || ''}
            onChange={(e) => onChange({ ...member, phoneHome: e.target.value })}
            placeholder="+994"
          />
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberForm;
