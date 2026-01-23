// src/features/parcel-management/presentation/components/ParcelForm/NewParcelForm.tsx
import React, { useState, useCallback, useEffect } from "react";
import { Grid, MenuItem, FormControl } from "@mui/material";
import {
  CreateParcelDTO,
  Parcel,
  TIPOS_TERRENO_CATALOGO,
} from "../../../domain/entities/Parcel";

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

interface NewParcelFormProps {
  open: boolean;
  onSubmit: (data: CreateParcelDTO) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Parcel;
  isEditing?: boolean;
}

export const NewParcelForm: React.FC<NewParcelFormProps> = ({
  open,
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<CreateParcelDTO>({
    nombre: initialData?.nombre || "",
    ubicacionDescripcion: initialData?.ubicacionDescripcion || "",
    areaHectareas: initialData?.areaHectareas || 0,
    tipoTerreno: (initialData?.tipoTerreno as any) || null,
    tipoTerrenoOtro: initialData?.tipoTerrenoOtro || null,
    descripcion: initialData?.descripcion || null,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateParcelDTO, string>>
  >({});
  // Inicializar showOtroField basado en datos iniciales
  const [showOtroField, setShowOtroField] = useState(
    initialData?.tipoTerreno === "otro",
  );

  // Manejar cambio de tipo de terreno
  useEffect(() => {
    setShowOtroField(formData.tipoTerreno === "otro");
  }, [formData.tipoTerreno]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      let cleanedValue: any = value;

      // Limpiar valor según campo
      if (name === "nombre") {
        cleanedValue = value.replace(/\s+/g, " ").trimStart();
      } else if (name === "areaHectareas") {
        cleanedValue = value === "" ? 0 : parseFloat(value);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: cleanedValue,
      }));

      // Limpiar error del campo al escribir
      setErrors((prev) => {
        if (prev[name as keyof CreateParcelDTO]) {
          return {
            ...prev,
            [name]: "",
          };
        }
        return prev;
      });
    },
    [],
  );

  const handleSelectChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || null,
    }));

    setErrors((prev) => {
      if (prev[name as keyof CreateParcelDTO]) {
        return { ...prev, [name]: "" };
      }
      return prev;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof CreateParcelDTO, string>> = {};

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
      newErrors.tipoTerrenoOtro = "Debe especificar el tipo de terreno";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      // Limpiar datos antes de enviar
      const cleanedData: any = {
        nombre: formData.nombre.trim(),
        ubicacionDescripcion: formData.ubicacionDescripcion.trim(),
        areaHectareas: formData.areaHectareas,
        tipoTerreno: formData.tipoTerreno || null,
        tipoTerrenoOtro:
          formData.tipoTerreno === "otro"
            ? formData.tipoTerrenoOtro?.trim() || null
            : null,
        descripcion: formData.descripcion?.trim() || null,
      };

      const result = await onSubmit(cleanedData);
      if (result) {
        setFormData({
          nombre: "",
          ubicacionDescripcion: "",
          areaHectareas: 0,
          tipoTerreno: null,
          tipoTerrenoOtro: null,
          descripcion: null,
        });
      }
    },
    [validateForm, formData, onSubmit],
  );

  return (
    <GlassDialog
      TransitionComponent={SlideTransition}
      open={open}
      onClose={onCancel}
    >
      <FormContainer component="form" onSubmit={handleSubmit}>
        <TextGeneric variant="h6">Crear Parcela</TextGeneric>

        <InputSection>
          <Grid container spacing={3}>
            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                fullWidth
                label="Nombre de la parcela"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={Boolean(errors.nombre)}
                helperText={errors.nombre}
                required
              />
            </GridItem>
            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                fullWidth
                label="Área (hectáreas)"
                name="areaHectareas"
                type="number"
                value={formData.areaHectareas || ""}
                onChange={handleChange}
                error={Boolean(errors.areaHectareas)}
                helperText={errors.areaHectareas}
                required
              />
            </GridItem>
            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                fullWidth
                label="Ubicación aproximada"
                name="ubicacionDescripcion"
                value={formData.ubicacionDescripcion || ""}
                onChange={handleChange}
                error={Boolean(errors.ubicacionDescripcion)}
                required
              />
            </GridItem>
            {/* Tipo de terreno */}
            <GridItem item xs={12} sm={showOtroField ? 6 : 6}>
              <FormControl fullWidth>
                <TextFieldGeneric
                  select
                  name="tipoTerreno"
                  value={formData.tipoTerreno || ""}
                  onChange={handleSelectChange}
                  label="Tipo de terreno"
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

            {/* Tipo de terreno personalizado (solo si es "Otro") */}
            {showOtroField && (
              <GridItem item xs={12} sm={12}>
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

            <GridItem item xs={12} sm={12}>
              <TextFieldGeneric
                fullWidth
                label="Descripción adicional"
                name="descripcion"
                value={formData.descripcion || ""}
                onChange={handleChange}
                placeholder="Características relevantes de la parcela..."
                required
              />
            </GridItem>
          </Grid>
        </InputSection>

        {/* Botones */}
        <ButtonContainer>
          <BackButtonGeneric
            onClick={onCancel}
            startIcon={<StyledArrowBackIcon />}
          >
            Cancelar
          </BackButtonGeneric>
          <ButtonGeneric type="submit">
            {isEditing ? "Guardar Cambios" : "Crear Parcela"}
          </ButtonGeneric>
        </ButtonContainer>
      </FormContainer>
    </GlassDialog>
  );
};
