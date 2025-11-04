import clsx from 'clsx';

const dots = 'mx-[1px] inline-block h-1.5 w-1.5 animate-blink rounded-full';

const LoadingDots = ({ className }: { className: string }) => {
  return (
    <span className="mx-2 inline-flex items-center gap-0.5">
      <span className={clsx(dots, className)} style={{ animationDelay: '0ms' }} />
      <span className={clsx(dots, className)} style={{ animationDelay: '150ms' }} />
      <span className={clsx(dots, className)} style={{ animationDelay: '300ms' }} />
    </span>
  );
};

export default LoadingDots;
