import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
export default function LazyTable({ data }: { data: { x: number; y: number }[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>X</TableHead>
          <TableHead>Y</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, idx) => (
          <TableRow key={idx}>
            <TableCell>{row.x}</TableCell>
            <TableCell>{row.y}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}