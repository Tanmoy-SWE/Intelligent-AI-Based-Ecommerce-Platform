import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
} & Omit<React.ComponentProps<typeof Image>, 'src'> & { src?: string | import('next/dist/shared/lib/get-img-props').StaticImport }) {
  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black',
        {
          relative: label,
          'border-2 border-blue-600': active,
          'border-neutral-200 dark:border-neutral-800': !active
        }
      )}
    >
      {props.src ? (
        <Image
          className={clsx('relative h-full w-full object-contain', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
          })}
          {...props}
          src={props.src}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
          <div className="text-center">
            <div className="text-6xl">
              {label?.title.includes('T-Shirt') && '👕'}
              {label?.title.includes('Hoodie') && '🧥'}
              {label?.title.includes('Cap') && '🧢'}
              {label?.title.includes('Mug') && '☕'}
              {label?.title.includes('Bag') && '🎒'}
              {label?.title.includes('Backpack') && '🎒'}
              {label?.title.includes('Sticker') && '🏷️'}
              {label?.title.includes('Cup') && '🥤'}
              {label?.title.includes('Bottle') && '🍾'}
              {label?.title.includes('Socks') && '🧦'}
              {label?.title.includes('Notebook') && '📓'}
              {!label?.title.match(/(T-Shirt|Hoodie|Cap|Mug|Bag|Backpack|Sticker|Cup|Bottle|Socks|Notebook)/i) && '🛍️'}
            </div>
          </div>
        </div>
      )}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
