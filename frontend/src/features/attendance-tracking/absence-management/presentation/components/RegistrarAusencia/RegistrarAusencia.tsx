// src/absence-management/presentation/components/RegistrarAusencia/RegistrarAusencia.tsx
import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  MenuItem,
  Alert,
  SelectChangeEvent,
  Autocomplete,
  Grid,
} from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import {
  CreateAbsenceData,
  ABSENCE_REASONS,
} from "../../../domain/entities/Absence";
import { useTrabajadores } from "../../../application/hooks/useTrabajadores";

import {
  ButtonContainer,
  FormContainer,
  GridItem,
  InputSection,
  StyledArrowBackIcon,
} from "../../../../../../shared/presentation/styles/Form.styles";
import { ButtonGeneric } from "../../../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../../../shared/presentation/styles/TextField.styles";
import { BackButtonGeneric } from "../../../../../../shared/presentation/styles/BackButton.styles";
import { TextGeneric } from "../../../../../../shared/presentation/styles/Text.styles";
import {
  GlassDialog,
  SlideTransition,
} from "../../../../../../shared/presentation/styles/Dialog.styles";

export interface RegistrarAusenciaFormData {
  trabajador_id: string; // Se mantiene como string en el formulario para facilitar el input
  fecha_ausencia: string;
  motivo: string;
  motivo_personalizado?: string;
  comentarios?: string;
  documento?: File;
}

interface RegistrarAusenciaProps {
  open: boolean;
  trabajadorId?: string;
  trabajadorNombre?: string;
  onSubmit: (data: CreateAbsenceData, documento?: File) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export const RegistrarAusencia: React.FC<RegistrarAusenciaProps> = ({
  open,
  trabajadorId: propTrabajadorId,
  trabajadorNombre,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    trabajadores,
    loading: loadingTrabajadores,
    error: errorTrabajadores,
  } = useTrabajadores();

  // Log para debugging
  console.log("📊 Estado del hook useTrabajadores:", {
    trabajadores,
    count: trabajadores.length,
    loading: loadingTrabajadores,
    error: errorTrabajadores,
  });

  const [formData, setFormData] = useState<RegistrarAusenciaFormData>({
    trabajador_id: propTrabajadorId || "",
    fecha_ausencia: new Date().toISOString().split("T")[0],
    motivo: "",
    motivo_personalizado: "",
    comentarios: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegistrarAusenciaFormData, string>>
  >({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent,
    ) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Limpiar error del campo
      if (errors[name as keyof RegistrarAusenciaFormData]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }

      // Limpiar motivo personalizado si no es "otro"
      if (name === "motivo" && value !== "otro") {
        setFormData((prev) => ({
          ...prev,
          motivo_personalizado: "",
        }));
      }
    },
    [errors],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        // Validar tipo de archivo
        const allowedTypes = [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/jpg",
        ];
        if (!allowedTypes.includes(file.type)) {
          setErrors((prev) => ({
            ...prev,
            documento: "Solo se permiten archivos PDF, JPG y PNG",
          }));
          return;
        }

        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            documento: "El archivo no debe superar los 5MB",
          }));
          return;
        }

        setSelectedFile(file);
        setErrors((prev) => ({
          ...prev,
          documento: undefined,
        }));
      }
    },
    [],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof RegistrarAusenciaFormData, string>> =
      {};

    if (!formData.trabajador_id) {
      newErrors.trabajador_id = "Debe seleccionar un trabajador";
    }

    if (!formData.fecha_ausencia) {
      newErrors.fecha_ausencia = "La fecha es requerida";
    }

    if (!formData.motivo) {
      newErrors.motivo = "Debe seleccionar un motivo";
    }

    if (formData.motivo === "otro" && !formData.motivo_personalizado?.trim()) {
      newErrors.motivo_personalizado = "Debe especificar el motivo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);

      if (!validateForm()) {
        return;
      }

      try {
        const submitData: CreateAbsenceData = {
          trabajador_id: parseInt(formData.trabajador_id), // Convertir a número
          fecha_ausencia: formData.fecha_ausencia,
          motivo: formData.motivo,
          motivo_personalizado: formData.motivo_personalizado,
          comentarios: formData.comentarios,
        };

        await onSubmit(submitData, selectedFile || undefined);

        // Limpiar formulario en caso de éxito
        setFormData({
          trabajador_id: propTrabajadorId || "",
          fecha_ausencia: new Date().toISOString().split("T")[0],
          motivo: "",
          motivo_personalizado: "",
          comentarios: "",
        });
        setSelectedFile(null);
      } catch (error: any) {
        setSubmitError(error.message || "Error al registrar la ausencia");
      }
    },
    [validateForm, formData, selectedFile, onSubmit, propTrabajadorId],
  );

  const showMotivopersonalizado = formData.motivo === "otro";

  return (
    <GlassDialog
      TransitionComponent={SlideTransition}
      open={open}
      onClose={onCancel}
    >
      <FormContainer component="form" onSubmit={handleSubmit}>
        <TextGeneric variant="h6">Registrar Ausencia</TextGeneric>

        {submitError && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setSubmitError(null)}
          >
            {submitError}
          </Alert>
        )}

        {errorTrabajadores && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Error al cargar trabajadores: {errorTrabajadores}
          </Alert>
        )}

        <InputSection>
          <Grid container spacing={3}>
            <GridItem item xs={12} sm={6}>
              {!propTrabajadorId && (
                <Autocomplete
                  options={trabajadores}
                  getOptionLabel={(option) =>
                    `${option.nombre_completo} - ${option.documento_identidad}`
                  }
                  loading={loadingTrabajadores}
                  value={
                    trabajadores.find(
                      (t) =>
                        t.trabajador_id.toString() === formData.trabajador_id,
                    ) || null
                  }
                  onChange={(_, newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      trabajador_id: newValue
                        ? newValue.trabajador_id.toString()
                        : "",
                    }));
                    if (errors.trabajador_id) {
                      setErrors((prev) => ({
                        ...prev,
                        trabajador_id: undefined,
                      }));
                    }
                  }}
                  renderInput={(params) => (
                    <TextFieldGeneric
                      {...params}
                      label="Empleado"
                      error={!!errors.trabajador_id}
                      helperText={errors.trabajador_id}
                    />
                  )}
                />
              )}
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                fullWidth
                required
                type="date"
                name="fecha_ausencia"
                label="Fecha de Ausencia"
                value={formData.fecha_ausencia}
                onChange={handleChange}
                error={!!errors.fecha_ausencia}
                helperText={errors.fecha_ausencia}
                InputLabelProps={{ shrink: true }}
              />
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.motivo}>
                <TextFieldGeneric
                  select
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  label="Motivo de la Ausencia"
                >
                  <MenuItem value="">
                    <em>Seleccione un motivo</em>
                  </MenuItem>
                  {ABSENCE_REASONS.map((reason) => (
                    <MenuItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </MenuItem>
                  ))}
                </TextFieldGeneric>
                {errors.motivo && (
                  <Typography variant="caption" color="error">
                    {errors.motivo}
                  </Typography>
                )}
              </FormControl>
            </GridItem>

            {/* Motivo Personalizado (solo si selecciona "otro") */}
            {showMotivopersonalizado && (
              <GridItem item xs={12} sm={6}>
                <TextFieldGeneric
                  fullWidth
                  required
                  name="motivo_personalizado"
                  label="Motivo específico"
                  value={formData.motivo_personalizado}
                  onChange={handleChange}
                  error={!!errors.motivo_personalizado}
                  helperText={errors.motivo_personalizado}
                />
              </GridItem>
            )}
            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                fullWidth
                name="comentarios"
                label="Comentarios (opcional)"
                value={formData.comentarios}
                onChange={handleChange}
              />
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <Box>
                <Typography
                  variant="body2"
                  sx={(theme) => ({
                    color: theme.palette.text.secondary,
                    mb: 1,
                  })}
                >
                  Documentación de Respaldo (opcional)
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                >
                  {selectedFile ? selectedFile.name : "Seleccionar Archivo"}
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </Button>
                {errors.documento && (
                  <Typography
                    variant="caption"
                    color="error"
                    display="block"
                    sx={{ mt: 1 }}
                  >
                    {errors.documento}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  sx={(theme) => ({
                    color: theme.palette.text.secondary,
                    mb: 1,
                  })}
                >
                  Formatos permitidos: PDF, JPG, PNG (máx. 5MB)
                </Typography>
              </Box>
            </GridItem>
          </Grid>
        </InputSection>

        <ButtonContainer>
          <BackButtonGeneric
            startIcon={<StyledArrowBackIcon />}
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </BackButtonGeneric>
          <ButtonGeneric type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Registrar"}
          </ButtonGeneric>
        </ButtonContainer>
      </FormContainer>
    </GlassDialog>
  );
};
