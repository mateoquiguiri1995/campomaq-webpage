interface Props {
  title: string;
  count: number;
}

export default function CategoryCard({ title, count }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white text-center hover:shadow-lg cursor-pointer">
      <div className="text-sm font-bold uppercase">{title}</div>
      <div className="text-xs text-gray-500">({count})</div>
      <div className="text-red-500 mt-2 text-xs hover:underline">
        Mostrar Todos
      </div>
    </div>
  );
}
