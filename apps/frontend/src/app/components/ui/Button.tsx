type Props = {
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  className?: string // <-- para aceptar clases adicionales
}

export function Button({ children, variant = 'primary', className }: Props) {
  const base =
    'px-6 py-2 md:px-8 md:py-3 font-semibold text-sm md:text-base transition-colors duration-300 hover:cursor-pointer'

  const styles = {
    primary: 'bg-black text-white hover:bg-campomaq hover:text-black',
    outline: 'bg-campomaq text-black hover:bg-white hover:text-black'
  }

  // En móvil el botón tiene ancho 90% y centrado (para columna)
  const responsive = 'max-[515px]:w-[90%] max-[515px]:mx-auto'

  return (
    <button className={`${base} ${styles[variant]} ${responsive} ${className || ''}`}>
      {children}
    </button>
  )
}
