const CommentSkeleton = () => (
  <div className='py-3 animate-pulse'>
    <div className='flex items-center gap-x-3 mb-3'>
      <div className='h-8 w-8 rounded-full bg-muted' />
      <div className='h-4 w-24 bg-muted rounded' />
      <div className='h-3 w-16 bg-muted rounded' />
    </div>
    <div className='space-y-2'>
      <div className='h-4 bg-muted rounded w-full' />
      <div className='h-4 bg-muted rounded w-3/4' />
    </div>
  </div>
);

export { CommentSkeleton };
