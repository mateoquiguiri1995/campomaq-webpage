type Props = {
  children: React.ReactNode
  variant?: 'primary' | 'outline'
}

export function Button({ children, variant = 'primary' }: Props) {
  const base = 'px-6 py-2 md:px-8 md:py-3 rounded-md font-semibold text-sm md:text-base transition-colors duration-300'
  const styles = {
    primary: 'bg-yellow-600 text-white hover:bg-yellow-700',
    outline: 'border border-white text-white hover:bg-white hover:text-black'
  }

  return <button className={`${base} ${styles[variant]}`}>{children}</button>
}
