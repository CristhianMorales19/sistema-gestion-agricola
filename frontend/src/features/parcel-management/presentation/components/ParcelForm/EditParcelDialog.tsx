// src/features/parcel-management/presentation/components/ParcelForm/EditParcelDialog.tsx
import React, { useState, useCallback, useEffect } from "react";
import { MenuItem, FormControl } from "@mui/material";
import {
  Parcel,
  UpdateParcelDTO,
  TIPOS_TERRENO_CATALOGO,
} from "../../../domain/entities/Parcel";

import { ButtonGeneric } from "../../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../../shared/presentation/styles/TextField.styles";
import { TextGeneric } from "../../../../../shared/presentation/styles/Text.styles";
import { BackButtonGeneric } from "../../../../../shared/presentation/styles/BackButton.styles";
import {
  GlassDialog,
  SlideTransition,
} from "../../../../../shared/presentation/styles/Dialog.styles";

import {
  ButtonContainer,
  FormContainer,
  GridItem,
  InputSection,
  StyledArrowBackIcon,
} from "../../../../../shared/presentation/styles/Form.styles";
import { Grid } from "@mui/material";

interface EditParcelDialogProps {
  open: boolean;
  parcel: Parcel | null;
  onClose: () => void;
  onSave: (id: number, data: UpdateParcelDTO) => Promise<boolean>;
}

// Colores del tema

// Estados disponibles para parcelas
const ESTADOS_PARCELA = [
  { value: "disponible", label: "Disponible" },
  { value: "ocupada", label: "Ocupada" },
  { value: "mantenimiento", label: "En Mantenimiento" },
  { value: "inactiva", label: "Inactiva" },
];

export const EditParcelDialog: React.FC<EditParcelDialogProps> = ({
  open,
  parcel,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UpdateParcelDTO>({
    nombre: "",
    ubicacionDescripcion: "",
    areaHectareas: 0,
    tipoTerreno: null,
    tipoTerrenoOtro: null,
    descripcion: null,
    estado: "disponible",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showOtroField, setShowOtroField] = useState(false);

  // Cargar datos cuando se abre el dialog
  useEffect(() => {
    if (parcel && open) {
      const tipoTerreno = parcel.tipoTerreno || null;
      setFormData({
        nombre: parcel.nombre || "",
        ubicacionDescripcion: parcel.ubicacionDescripcion || "",
        areaHectareas: parcel.areaHectareas || 0,
        tipoTerreno: tipoTerreno,
        tipoTerrenoOtro: parcel.tipoTerrenoOtro || null,
        descripcion: parcel.descripcion || null,
        estado: parcel.estado || "disponible",
      });
      setShowOtroField(tipoTerreno === "otro");
      setErrors({});
    }
  }, [parcel, open]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "areaHectareas"
            ? value === ""
              ? 0
              : parseFloat(value)
            : value,
      }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors],
  );

  const handleSelectChange = useCallback((name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value || null }));

    // Mostrar/ocultar campo "otro" cuando cambia tipo de terreno
    if (name === "tipoTerreno") {
      setShowOtroField(value === "otro");
      if (value !== "otro") {
        setFormData((prev) => ({ ...prev, tipoTerrenoOtro: null }));
      }
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre?.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    if (!formData.ubicacionDescripcion?.trim()) {
      newErrors.ubicacionDescripcion = "La ubicación es obligatoria";
    }
    if (!formData.areaHectareas || formData.areaHectareas <= 0) {
      newErrors.areaHectareas = "El área debe ser mayor a 0";
    }
    if (formData.tipoTerreno === "otro" && !formData.tipoTerrenoOtro?.trim()) {
      newErrors.tipoTerrenoOtro = "Especifique el tipo de terreno";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !parcel?.id) return;

    setLoading(true);
    try {
      const success = await onSave(parcel.id, formData);
      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassDialog
      TransitionComponent={SlideTransition}
      open={open}
      onClose={onClose}
    >
      <FormContainer>
        <TextGeneric variant="h5">Editar Parcela</TextGeneric>

        <InputSection>
          <Grid container spacing={3}>
            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                fullWidth
                label="Nombre de la parcela"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                size="small"
              />
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                fullWidth
                name="ubicacionDescripcion"
                value={formData.ubicacionDescripcion}
                onChange={handleChange}
                error={!!errors.ubicacionDescripcion}
                label="Ubicación"
                size="small"
              />
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                fullWidth
                name="areaHectareas"
                type="number"
                value={formData.areaHectareas || ""}
                onChange={handleChange}
                error={!!errors.areaHectareas}
                helperText={errors.areaHectareas}
                inputProps={{ min: 0, step: 0.01 }}
                label="Área (hectáreas)"
                size="small"
              />
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <TextFieldGeneric
                  select
                  name="tipoTerreno"
                  value={formData.tipoTerreno || ""}
                  onChange={(e) =>
                    handleSelectChange("tipoTerreno", e.target.value)
                  }
                  label="Tipo de terreno (opcional)"
                >
                  <MenuItem value="">
                    <em>Sin especificar</em>
                  </MenuItem>
                  {TIPOS_TERRENO_CATALOGO.map((tipo) => (
                    <MenuItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </MenuItem>
                  ))}
                </TextFieldGeneric>
              </FormControl>
            </GridItem>

            {showOtroField && (
              <GridItem item xs={12} sm={6}>
                <TextFieldGeneric
                  fullWidth
                  label="Especifique el tipo de terreno"
                  name="tipoTerrenoOtro"
                  value={formData.tipoTerrenoOtro || ""}
                  onChange={handleChange}
                  error={Boolean(errors.tipoTerrenoOtro)}
                  helperText={errors.tipoTerrenoOtro}
                  required
                  placeholder="Ej: Rocoso, Arenoso, etc."
                />
              </GridItem>
            )}

            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                fullWidth
                label="Descripción adicional"
                name="descripcion"
                value={formData.descripcion || ""}
                onChange={handleChange}
                placeholder="Incluye características relevantes como tipo de suelo, drenaje, sistemas instalados, etc."
                size="small"
              />
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <TextFieldGeneric
                  select
                  label="Estado"
                  value={formData.estado || "disponible"}
                  onChange={(e) => handleSelectChange("estado", e.target.value)}
                >
                  {ESTADOS_PARCELA.map((estado) => (
                    <MenuItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </MenuItem>
                  ))}
                </TextFieldGeneric>
              </FormControl>
            </GridItem>
          </Grid>
        </InputSection>

        <ButtonContainer>
          <BackButtonGeneric
            onClick={onClose}
            startIcon={<StyledArrowBackIcon />}
          >
            Cancelar
          </BackButtonGeneric>
          <ButtonGeneric onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Actualizar"}
          </ButtonGeneric>
        </ButtonContainer>
      </FormContainer>
    </GlassDialog>
  );
};
