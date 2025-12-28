import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction } from 'react';

interface toxicityModalProps {
  score: number;
  category: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handleConfirmPost: () => void;
}

const ToxicityModal = ({
  score,
  category,
  open,
  setOpen,
  setShowModal,
  handleConfirmPost,
}: toxicityModalProps) => {
  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to post this?
          </AlertDialogTitle>
          <AlertDialogDescription>
            There is a{' '}
            <span className='font-bold'>{(score * 100).toFixed(2)}%</span>{' '}
            chance your comment is <span className='font-bold'>{category}</span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowModal(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmPost}>
            Post Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ToxicityModal };
