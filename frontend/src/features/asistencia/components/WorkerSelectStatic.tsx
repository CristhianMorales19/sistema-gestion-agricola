import React, { useEffect, useState } from "react";
import { MenuItem, CircularProgress, Box } from "@mui/material";
import { AsistenciaService } from "../services/AsistenciaService";
import { TextFieldGeneric } from "../../../shared/presentation/styles/TextField.styles";

interface WorkerStaticOption {
  value: number;
  label: string;
  trabajador_id: number;
  documento_identidad: string;
  nombre_completo: string;
}

interface WorkerSelectStaticProps {
  service: AsistenciaService;
  value: number | null;
  onChange: (id: number | null, meta?: WorkerStaticOption | null) => void;
  label?: string;
  helperText?: string;
}

export const WorkerSelectStatic: React.FC<WorkerSelectStaticProps> = ({
  service,
  value,
  onChange,
  label = "Trabajador",
  helperText,
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<WorkerStaticOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    service
      .listarTrabajadoresActivos()
      .then((data) => {
        if (active) setOptions(data);
      })
      .catch((e) => {
        if (active) setError(e.message || "Error cargando trabajadores");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [service]);

  return (
    <TextFieldGeneric
      select
      size="small"
      fullWidth
      label={label}
      value={value ?? ""}
      error={!!error}
      helperText={error || helperText || "Lista de trabajadores activos"}
      onChange={(e) => {
        const val = e.target.value === "" ? null : Number(e.target.value);
        const meta = options.find((o) => o.value === val) || null;
        onChange(val, meta);
      }}
      SelectProps={{
        renderValue: (val: any) => {
          if (val === "" || val === null) return "Seleccione";
          const meta = options.find((o) => o.value === Number(val));
          return meta ? meta.label : String(val);
        },
      }}
    >
      <MenuItem value="">
        <em>Seleccione un trabajador</em>
      </MenuItem>

      {loading && (
        <MenuItem disabled value="loading">
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={16} />
            Cargando...
          </Box>
        </MenuItem>
      )}

      {!loading && !error && options.length === 0 && (
        <MenuItem disabled value="no-data">
          No hay trabajadores activos
        </MenuItem>
      )}

      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextFieldGeneric>
  );
};

export default WorkerSelectStatic;
