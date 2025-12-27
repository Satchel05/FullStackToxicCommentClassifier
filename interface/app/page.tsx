import { CommentsSidebar } from '@/components/CommentSidebar';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center gap-3 text-gray-800'>
      <h1 className='text-3xl text-semibold'>Nothing to see here just yet.</h1>
      <h3 className='text-lg text-muted-foreground font-medium'>
        Stay tuned for more updates soon...
      </h3>
      <CommentsSidebar />
    </div>
  );
}
