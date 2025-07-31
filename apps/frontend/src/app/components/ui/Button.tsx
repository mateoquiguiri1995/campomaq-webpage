type Props = {
  children: React.ReactNode
  variant?: 'primary' | 'outline'
}

export function Button({ children, variant = 'primary' }: Props) {
  const base = 'px-6 py-2 md:px-8 md:py-3 font-semibold text-sm md:text-base transition-colors duration-300'
  const styles = {
    primary: 'bg-black text-white hover:bg-yellow-600',
    outline: 'border border-white text-white hover:bg-white hover:text-black'
  }

  return <button className={`${base} ${styles[variant]}`}>{children}</button>
}
