import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Check, Copy } from 'lucide-react';

const ExploreListModal = ({ isOpen, onClose, sharedCourses }) => {
  const [selectedBAs, setSelectedBAs] = useState([3, 4, 5, 6]);
  const [copied, setCopied] = useState(false);

  const toggleBA = (ba) => {
    setSelectedBAs(prev => 
      prev.includes(ba) 
        ? prev.filter(b => b !== ba)
        : [...prev, ba].sort()
    );
  };

  const generateTextExport = () => {
    let text = '';
    
    selectedBAs.forEach(ba => {
      const courses = Object.entries(sharedCourses)
        .filter(([, courseInfo]) => courseInfo.ba === ba)
        .sort(([, a], [, b]) => Number(b.credits) - Number(a.credits));
      
      if (courses.length > 0) {
        text += `BA${ba} :\n`;
        courses.forEach(([courseName, courseInfo]) => {
          text += `${courseName} ${courseInfo.credits}\n`;
        });
        text += '\n';
      }
    });
    
    return text.trim();
  };

  const handleCopy = async () => {
    const text = generateTextExport();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const textExport = generateTextExport();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Explorer la liste des cours</DialogTitle>
          <DialogDescription>
            Sélectionnez les semestres à exporter
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          {[3, 4, 5, 6].map(ba => (
            <Button
              key={ba}
              onClick={() => toggleBA(ba)}
              variant={selectedBAs.includes(ba) ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-1.5"
            >
              {selectedBAs.includes(ba) && <Check className="h-3.5 w-3.5" />}
              BA{ba}
            </Button>
          ))}
        </div>

        <div className="flex-1 overflow-auto border rounded-md bg-muted/30 p-4">
          <pre className="text-sm font-mono whitespace-pre-wrap">
            {textExport || 'Aucun cours sélectionné'}
          </pre>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="gap-2"
            disabled={!textExport}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copié !
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copier
              </>
            )}
          </Button>
          <Button onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExploreListModal;
