const StatusChip = ({ ativo }: { ativo: boolean }) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-medium ${
        ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {ativo ? "Ativo" : "Inativo"}
    </span>
  );
};

export default StatusChip;
