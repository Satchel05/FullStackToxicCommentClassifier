import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CommentDialogue({ isOpen, setIsOpen, setIsSubmitted }) {
  async function handleSubmit() {
    setIsOpen(false);
    setIsSubmitted(true);
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you absolutely sure you want to post this?
          </DialogTitle>
          <DialogDescription>
            <br></br>
            Your commment was flagged as being toxic.
            <br></br>
            <br></br>
            Repeated vialotions of our Terms & Services could result in a
            permanent ban from the platform.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
              variant='outline'>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            type='submit'>
            Post Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
