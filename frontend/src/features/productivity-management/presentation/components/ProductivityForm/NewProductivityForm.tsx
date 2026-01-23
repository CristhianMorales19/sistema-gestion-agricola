import React, { useState, useEffect } from "react";
import { MenuItem, Autocomplete, Grid } from "@mui/material";
import { ProductivityRecord } from "../../../domain/entities/Productivity";
import { useTrabajadores } from "../../../application/hooks/useTrabajadores";

import {
  ButtonContainer,
  FormContainer,
  GridItem,
  InputSection,
  StyledArrowBackIcon,
} from "../../../../../shared/presentation/styles/Form.styles";
import { ButtonGeneric } from "../../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../../shared/presentation/styles/TextField.styles";
import { BackButtonGeneric } from "../../../../../shared/presentation/styles/BackButton.styles";
import { TextGeneric } from "../../../../../shared/presentation/styles/Text.styles";

import {
  GlassDialog,
  SlideTransition,
} from "../../../../../shared/presentation/styles/Dialog.styles";

export interface NewProductivityFormData {
  workerId: string;
  taskId: string;
  producedQuantity: number;
  date: string;
}

interface ProductivityFormProps {
  open: boolean;
  records: ProductivityRecord[];
  onSubmit: (data: NewProductivityFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: NewProductivityFormData;
}

interface TaskOption {
  id: string;
  name: string;
  unit: string;
  standardPerformance: number;
}

export const ProductivityForm: React.FC<ProductivityFormProps> = ({
  open,
  records,
  onSubmit,
  onCancel,
  initialData,
}) => {
  // Hook para cargar trabajadores desde la API
  const {
    trabajadores,
    loading: loadingTrabajadores,
    error: errorTrabajadores,
  } = useTrabajadores();

  const [formData, setFormData] = useState<NewProductivityFormData>(
    initialData || { workerId: "", taskId: "", producedQuantity: 0, date: "" },
  );
  const [tasks, setTasks] = useState<TaskOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Obtener tareas únicas de los registros existentes
  useEffect(() => {
    const uniqueTasks: TaskOption[] = Array.from(
      new Map(records.map((r) => [r.task.id, r.task])).values(),
    ).map((t) => ({
      id: t.id,
      name: t.name,
      unit: t.unit,
      standardPerformance: t.standardPerformance,
    }));
    setTasks(uniqueTasks);
  }, [records]);

  const handleChange =
    (field: keyof NewProductivityFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]:
          field === "producedQuantity"
            ? Number(e.target.value)
            : e.target.value,
      }));
    };

  const handleAutocompleteChange =
    (field: keyof NewProductivityFormData) => (_: any, value: any | null) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value ? value.trabajador_id.toString() : "",
      }));
    };

  const getTaskUnit = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    return task?.unit || "";
  };

  const getTaskLimit = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.standardPerformance === undefined) return Infinity;
    return task.standardPerformance * 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limit = getTaskLimit(formData.taskId);
    if (formData.producedQuantity < 0 || formData.producedQuantity > limit) {
      alert(`Cantidad inválida. Debe ser entre 0 y ${limit}`);
      return;
    }
    if (new Date(formData.date) > new Date()) {
      alert("La fecha no puede ser futura");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassDialog
      TransitionComponent={SlideTransition}
      open={open}
      onClose={onCancel}
    >
      <FormContainer component="form" onSubmit={handleSubmit}>
        <TextGeneric variant="h6">
          {initialData
            ? "Editar Registro de Productividad"
            : "Nuevo Registro de Productividad"}
        </TextGeneric>

        <InputSection>
          <Grid container spacing={3}>
            <GridItem item xs={12} sm={6}>
              <Autocomplete
                options={trabajadores}
                getOptionLabel={(option) =>
                  `${option.nombre_completo} (${option.documento_identidad})`
                }
                value={
                  trabajadores.find(
                    (t) => t.trabajador_id.toString() === formData.workerId,
                  ) || null
                }
                onChange={handleAutocompleteChange("workerId")}
                loading={loadingTrabajadores}
                renderInput={(params) => (
                  <TextFieldGeneric {...params} label="Empleado" required />
                )}
              />
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                select
                label="Tarea / Producto"
                value={formData.taskId}
                onChange={handleChange("taskId")}
                fullWidth
                required
              >
                {tasks.map((task) => (
                  <MenuItem key={task.id} value={task.id}>
                    {task.name} ({task.unit})
                  </MenuItem>
                ))}
              </TextFieldGeneric>
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                type="number"
                label="Cantidad Producida"
                value={formData.producedQuantity}
                onChange={handleChange("producedQuantity")}
                fullWidth
                required
              />
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                type="date"
                label="Fecha"
                value={formData.date}
                onChange={handleChange("date")}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </GridItem>

            <GridItem item xs={12} sm={6}></GridItem>
          </Grid>
        </InputSection>

        <ButtonContainer>
          <BackButtonGeneric
            onClick={onCancel}
            startIcon={<StyledArrowBackIcon />}
          >
            Cancelar
          </BackButtonGeneric>

          <ButtonGeneric type="submit" disabled={loading}>
            {loading ? "Guardando..." : initialData ? "Guardar" : "Registrar"}
          </ButtonGeneric>
        </ButtonContainer>
      </FormContainer>
    </GlassDialog>
  );
};
