
import { Button } from "@/components/ui/button";

type Subject = {
  id: string;
  name: string;
  icon: string;
};

interface SubjectSelectorProps {
  subjects: Subject[];
  onSelectSubject: (subject: string) => void;
}

const SubjectSelector = ({ subjects, onSelectSubject }: SubjectSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {subjects.map((subject) => (
        <Button
          key={subject.id}
          variant="outline"
          className="h-auto py-4 justify-start gap-2"
          onClick={() => onSelectSubject(subject.name)}
        >
          <span className="text-2xl">{subject.icon}</span>
          <span>{subject.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default SubjectSelector;
