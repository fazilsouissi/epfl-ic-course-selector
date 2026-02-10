import { useState } from 'react'
import { Button } from './ui/button'
import { Copy, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

export default function ImportExportModal({ isOpen, onClose, type, content = '', onConfirm }) {
  const [inputContent, setInputContent] = useState('')
  const [copied, setCopied] = useState(false)

  const displayContent = type === 'export' ? content : inputContent

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirm = () => {
    if (inputContent.trim()) {
      onConfirm(inputContent)
      setInputContent('')
    }
  }

  const handleClose = () => {
    setInputContent('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'export' ? 'Exporter la configuration' : 'Importer une configuration'}
          </DialogTitle>
          <DialogDescription>
            {type === 'export' 
              ? 'Copiez cette configuration pour la partager ou la sauvegarder.'
              : 'Collez votre configuration JSON pour l\'importer.'}
          </DialogDescription>
        </DialogHeader>

        <textarea
          value={displayContent}
          onChange={(e) => type !== 'export' && setInputContent(e.target.value)}
          placeholder={type === 'export' ? 'Votre configuration JSON s\'affichera ici...' : 'Collez votre configuration JSON ici...'}
          className="w-full h-64 p-3 bg-background border border-border rounded-md font-mono text-sm focus:outline-none focus:border-primary resize-none"
          readOnly={type === 'export'}
        />

        <div className="flex gap-2 mt-4">
          {type === 'export' && (
            <Button
              onClick={handleCopy}
              variant={copied ? 'default' : 'outline'}
              className="flex-1 gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copié!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copier
                </>
              )}
            </Button>
          )}
          {type === 'import' && (
            <Button
              onClick={handleConfirm}
              disabled={!inputContent.trim()}
              className="flex-1"
            >
              Importer
            </Button>
          )}
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1"
          >
            {type === 'export' ? 'Fermer' : 'Annuler'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
