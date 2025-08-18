import Link from 'next/link';

type Props = {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  variant = 'primary', 
  className, 
  href,
  onClick,
  type = 'button'
}: Props) {
  const base = 'px-6 py-2 md:px-8 md:py-3 font-semibold text-sm md:text-base transition-colors duration-300 hover:cursor-pointer';
  
  const styles = {
    primary: 'bg-black text-white hover:bg-campomaq hover:text-black',
    outline: 'bg-campomaq text-black hover:bg-white hover:text-black'
  };

  const responsive = 'max-[515px]:w-[90%] max-[515px]:mx-auto pt-2';

  // Si tiene href, usamos Link de Next.js
  if (href) {
    return (
      <Link
        href={href}
        className={`${base} ${styles[variant]} ${responsive} ${className || ''}`}
      >
        {children}
      </Link>
    );
  }

  // Si no tiene href, usamos button normal
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${styles[variant]} ${responsive} ${className || ''}`}
    >
      {children}
    </button>
  );
}