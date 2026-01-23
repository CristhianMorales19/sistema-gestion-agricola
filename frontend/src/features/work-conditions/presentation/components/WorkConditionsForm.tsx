import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { AlertTriangle, AlertCircle } from "lucide-react";
import {
  GlassCard,
  CardContentStyled,
  StyledAlert,
  StyledFormLabel,
  ConditionButton,
  ConditionButtonContent,
  ConditionIcon,
  ConditionLabel,
  DifficultyButton,
  DifficultyButtonContent,
} from "./WorkConditionsForm.styles";

import {
  ButtonContainer,
  FormContainer,
  GridItem,
} from "../../../../shared/presentation/styles/Form.styles";

import { ButtonGeneric } from "../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../shared/presentation/styles/TextField.styles";
import { TextGeneric } from "../../../../shared/presentation/styles/Text.styles";
import { BackButtonGeneric } from "../../../../shared/presentation/styles/BackButton.styles";

interface WorkCondition {
  fecha: string;
  condicionGeneral: "despejado" | "lluvioso" | "muy_caluroso" | "nublado";
  nivelDificultad: "normal" | "dificil" | "muy_dificil";
  observaciones?: string;
}

interface WorkConditionsFormProps {
  onSubmit?: (data: WorkCondition) => Promise<boolean> | boolean;
  selectedCondition?: WorkCondition | null;
  selectedDate?: string | null;
  onDateSelected?: (fecha: string) => void;
}

const CONDICIONES_GENERALES = [
  { value: "despejado", label: "Despejado", icon: "☀️", color: "#fbbf24" },
  { value: "lluvioso", label: "Lluvioso", icon: "🌧️", color: "#3b82f6" },
  {
    value: "muy_caluroso",
    label: "Muy Caluroso",
    icon: "🔥",
    color: "#ef4444",
  },
  { value: "nublado", label: "Nublado", icon: "☁️", color: "#6b7280" },
];

const NIVELES_DIFICULTAD = [
  { value: "normal", label: "Normal", color: "#10b981" },
  { value: "dificil", label: "Difícil", color: "#f97316" },
  { value: "muy_dificil", label: "Muy Difícil", color: "#ef4444" },
];

export const WorkConditionsForm: React.FC<WorkConditionsFormProps> = ({
  onSubmit,
  selectedCondition,
  selectedDate,
  onDateSelected,
}) => {
  const [formData, setFormData] = useState<WorkCondition>({
    fecha: new Date().toISOString().split("T")[0],
    condicionGeneral: "despejado",
    nivelDificultad: "normal",
    observaciones: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");

  // Obtener fecha máxima permitida (hoy)
  const maxDate = new Date().toISOString().split("T")[0];

  // Cuando se selecciona un día del calendario con registro existente
  useEffect(() => {
    if (selectedDate) {
      console.log("📅 Día seleccionado:", selectedDate);
      console.log("🔍 Condición seleccionada:", selectedCondition);

      setSubmitted(false);
      setSubmissionMessage("");
      setFormData((prev) => ({ ...prev, fecha: selectedDate }));

      if (selectedCondition) {
        console.log("✏️ Cargando datos existentes:", selectedCondition);
        setFormData({
          fecha: selectedCondition.fecha,
          condicionGeneral: selectedCondition.condicionGeneral,
          nivelDificultad: selectedCondition.nivelDificultad,
          observaciones: selectedCondition.observaciones || "",
        });
        setIsEditingExisting(true);
      } else {
        console.log("🆕 Nuevo día, sin registro anterior");
        setFormData((prev) => ({
          ...prev,
          fecha: selectedDate,
          observaciones: "",
        }));
        setIsEditingExisting(false);
      }
    }
  }, [selectedDate, selectedCondition]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setFormData({ ...formData, fecha: newDate });

    if (newDate > maxDate) {
      setDateError("❌ No se pueden registrar días futuros");
    } else {
      setDateError("");
    }

    onDateSelected?.(newDate);
  };

  const handleCondicionChange = (value: string) => {
    setFormData({ ...formData, condicionGeneral: value as any });
  };

  const handleNivelChange = (value: string) => {
    setFormData({ ...formData, nivelDificultad: value as any });
  };

  const handleObservacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, observaciones: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit");

    if (formData.fecha > maxDate) {
      setDateError("❌ No se pueden registrar días futuros");
      return;
    }

    console.log("📝 Enviando formulario:", formData);
    const result = await onSubmit?.(formData);
    console.log("✅ Resultado de onSubmit:", result);

    if (result) {
      if (isEditingExisting) {
        setSubmissionMessage("✔️ Condición actualizada exitosamente");
      } else {
        setSubmissionMessage("✔️ Registro guardado exitosamente");
      }

      console.log(
        "📢 Mostrando mensaje:",
        isEditingExisting ? "actualización" : "creación",
      );

      setFormData({
        fecha: new Date().toISOString().split("T")[0],
        condicionGeneral: "despejado",
        nivelDificultad: "normal",
        observaciones: "",
      });
      setIsEditingExisting(false);
      setSubmitted(true);

      setTimeout(() => {
        console.log("🔇 Ocultando mensaje");
        setSubmitted(false);
      }, 5000);
    } else {
      console.log("❌ Error al guardar");
    }
  };

  return (
    <GlassCard>
      <CardContentStyled>
        <TextGeneric variant="h6">Registrar Condiciones del Día</TextGeneric>

        {submitted && (
          <StyledAlert severity="success">{submissionMessage}</StyledAlert>
        )}

        <FormContainer component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <GridItem item xs={12}>
              <TextFieldGeneric
                type="date"
                label="Fecha"
                value={formData.fecha}
                onChange={handleDateChange}
                inputProps={{ max: maxDate }}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={dateError !== ""}
                helperText={dateError}
              />
            </GridItem>

            {/* Condición General */}
            <Grid item xs={12}>
              <StyledFormLabel sx={{ mb: 2 }}>
                Condición General
              </StyledFormLabel>
              <Grid container spacing={2}>
                {CONDICIONES_GENERALES.map((condicion) => (
                  <GridItem item xs={6} sm={3} key={condicion.value}>
                    <ConditionButton
                      fullWidth
                      onClick={() => handleCondicionChange(condicion.value)}
                      isSelected={formData.condicionGeneral === condicion.value}
                      buttonColor={condicion.color}
                    >
                      <ConditionButtonContent>
                        <ConditionIcon>{condicion.icon}</ConditionIcon>
                        <ConditionLabel>{condicion.label}</ConditionLabel>
                      </ConditionButtonContent>
                    </ConditionButton>
                  </GridItem>
                ))}
              </Grid>
            </Grid>

            {/* Nivel de Dificultad */}
            <Grid item xs={12}>
              <StyledFormLabel sx={{ mb: 2 }}>
                Nivel de Dificultad
              </StyledFormLabel>
              <Grid container spacing={2}>
                {NIVELES_DIFICULTAD.map((nivel) => (
                  <GridItem item xs={12} sm={4} key={nivel.value}>
                    <DifficultyButton
                      fullWidth
                      onClick={() => handleNivelChange(nivel.value)}
                      isSelected={formData.nivelDificultad === nivel.value}
                      buttonColor={nivel.color}
                    >
                      <DifficultyButtonContent>
                        {nivel.value === "dificil" && (
                          <AlertTriangle
                            size={18}
                            style={{ color: nivel.color }}
                          />
                        )}
                        {nivel.value === "muy_dificil" && (
                          <AlertCircle
                            size={18}
                            style={{ color: nivel.color }}
                          />
                        )}
                        <Typography variant="body2">{nivel.label}</Typography>
                      </DifficultyButtonContent>
                    </DifficultyButton>
                  </GridItem>
                ))}
              </Grid>
            </Grid>

            <GridItem item xs={12}>
              <TextFieldGeneric
                label="Obervación breve (opcional)"
                placeholder="Añade cualquier comentario relevante..."
                value={formData.observaciones}
                onChange={handleObservacionChange}
                fullWidth
              />
            </GridItem>
          </Grid>

          {/* Buttons */}
          <ButtonContainer>
            <BackButtonGeneric>Cancelar</BackButtonGeneric>
            <ButtonGeneric type="submit">Guardar</ButtonGeneric>
          </ButtonContainer>
        </FormContainer>
      </CardContentStyled>
    </GlassCard>
  );
};
