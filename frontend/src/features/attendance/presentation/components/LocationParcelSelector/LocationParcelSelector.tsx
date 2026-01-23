import React, { useState, useEffect, useRef } from "react";
import { MapPin, ChevronDown, AlertTriangle } from "lucide-react";
import { TextFieldGeneric } from "../../../../../shared/presentation/styles/TextField.styles";

import { styled } from "@mui/material/styles";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
} from "@mui/material";

// Interfaz y tipos manteniendo los originales
export interface ParcelOption {
  id: number;
  nombre: string;
  ubicacionDescripcion: string;
}

export type LocationType = "parcel" | "not-applicable" | "other";

export interface LocationValue {
  type: LocationType;
  parcelId?: number;
  parcelName?: string;
  customText?: string;
}

interface LocationParcelSelectorProps {
  parcels: ParcelOption[];
  loadingParcels?: boolean;
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

// Contenedor estilizado para el dropdown
const DropdownContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  marginTop: theme.spacing(1),
  background: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[8],
  zIndex: 1300,
  maxHeight: 300,
  overflowY: "auto",
}));

const ParcelListItem = styled(ListItem)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&.selected": {
    backgroundColor: theme.palette.action.selected,
  },
  cursor: "pointer",
}));

const SpecialOptionItem = styled(ListItem)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&.selected": {
    backgroundColor: theme.palette.action.selected,
  },
  cursor: "pointer",
  color: theme.palette.text.secondary,
}));

export const LocationParcelSelector: React.FC<LocationParcelSelectorProps> = ({
  parcels,
  loadingParcels = false,
  value,
  onChange,
  error,
  disabled = false,
  required = true,
  fullWidth = true,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleTypeSelect = (type: LocationType, parcel?: ParcelOption) => {
    if (type === "parcel" && parcel) {
      onChange({
        type: "parcel",
        parcelId: parcel.id,
        parcelName: parcel.nombre,
        customText: undefined,
      });
    } else if (type === "not-applicable") {
      onChange({
        type: "not-applicable",
        parcelId: undefined,
        parcelName: undefined,
        customText: undefined,
      });
    } else if (type === "other") {
      onChange({
        type: "other",
        parcelId: undefined,
        parcelName: undefined,
        customText: value.customText || "",
      });
    }
    setIsDropdownOpen(false);
  };

  const handleCustomTextChange = (text: string) => {
    onChange({
      ...value,
      type: "other",
      customText: text,
    });
  };

  const getDisplayText = (): string => {
    if (value.type === "parcel" && value.parcelName) {
      return value.parcelName;
    }
    if (value.type === "not-applicable") {
      return "No aplica";
    }
    if (value.type === "other") {
      return "Otro (texto libre)";
    }
    return "Seleccionar ubicación...";
  };

  const getInputValue = (): string => {
    if (loadingParcels) return "Cargando parcelas...";
    return getDisplayText();
  };

  const isValid = (): boolean => {
    if (!required) return true;

    if (value.type === "parcel") {
      return !!value.parcelId;
    }
    if (value.type === "not-applicable") {
      return true;
    }
    if (value.type === "other") {
      return !!value.customText?.trim();
    }
    return false;
  };

  return (
    <Box ref={containerRef} sx={{ position: "relative" }}>
      {/* Selector principal usando TextFieldGeneric */}
      <TextFieldGeneric
        fullWidth={fullWidth}
        label={`Ubicación / Parcela`}
        value={getInputValue()}
        onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
        disabled={disabled}
        required={required}
        error={!!error}
        helperText={error}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <MapPin
              style={{
                width: 16,
                height: 16,
                marginRight: 8,
                color: "#9CA3AF",
              }}
            />
          ),
          endAdornment: (
            <ChevronDown
              style={{
                width: 16,
                height: 16,
                color: "#9CA3AF",
                transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          ),
        }}
      />

      {/* Dropdown */}
      {isDropdownOpen && !disabled && (
        <DropdownContainer>
          {/* Sección: Parcelas */}
          {parcels.length > 0 && (
            <>
              <Box
                sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider" }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  PARCELAS DISPONIBLES
                </Typography>
              </Box>
              <List disablePadding>
                {parcels.map((parcel) => (
                  <ParcelListItem
                    key={parcel.id}
                    onClick={() => handleTypeSelect("parcel", parcel)}
                    className={
                      value.type === "parcel" && value.parcelId === parcel.id
                        ? "selected"
                        : ""
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <MapPin
                        style={{ width: 16, height: 16, color: "#10B981" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={parcel.nombre}
                      secondary={parcel.ubicacionDescripcion}
                      secondaryTypographyProps={{
                        variant: "caption",
                        color: "text.secondary",
                      }}
                    />
                  </ParcelListItem>
                ))}
              </List>
            </>
          )}

          {/* Separador si hay parcelas */}
          {parcels.length > 0 && <Divider />}

          {/* Opciones especiales */}
          <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="bold"
            >
              OTRAS OPCIONES
            </Typography>
          </Box>
          <List disablePadding>
            {/* No aplica */}
            <SpecialOptionItem
              onClick={() => handleTypeSelect("not-applicable")}
              className={value.type === "not-applicable" ? "selected" : ""}
            >
              <ListItemIcon sx={{ minWidth: 32, justifyContent: "center" }}>
                <span style={{ fontSize: 14, color: "#6B7280" }}>—</span>
              </ListItemIcon>
              <ListItemText primary="No aplica" />
            </SpecialOptionItem>

            {/* Otro (texto libre) */}
            <SpecialOptionItem
              onClick={() => handleTypeSelect("other")}
              className={value.type === "other" ? "selected" : ""}
            >
              <ListItemIcon sx={{ minWidth: 32, justifyContent: "center" }}>
                <span style={{ fontSize: 14, color: "#F59E0B" }}>✎</span>
              </ListItemIcon>
              <ListItemText primary="Otro (texto libre)" />
            </SpecialOptionItem>
          </List>
        </DropdownContainer>
      )}

      {/* Campo de texto libre (solo si se selecciona "Otro") */}
      {value.type === "other" && (
        <Box sx={{ mt: 2 }}>
          <TextFieldGeneric
            fullWidth={fullWidth}
            value={value.customText || ""}
            onChange={(e) => handleCustomTextChange(e.target.value)}
            placeholder="Ej: Invernadero 3, Bodega principal..."
            disabled={disabled}
            helperText="Ingresa una ubicación personalizada"
          />
        </Box>
      )}

      {/* Mensaje informativo si no hay parcelas */}
      {!loadingParcels && parcels.length === 0 && (
        <Typography
          variant="caption"
          color="warning.main"
          sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}
        >
          <AlertTriangle style={{ width: 14, height: 14 }} />
          No hay parcelas registradas. Puede usar "Otro" para ingresar ubicación
          manual.
        </Typography>
      )}
    </Box>
  );
};

// Funciones auxiliares (manteniendo las originales)
export const getLocationString = (value: LocationValue): string => {
  if (value.type === "parcel" && value.parcelName) {
    return value.parcelName;
  }
  if (value.type === "not-applicable") {
    return "N/A";
  }
  if (value.type === "other" && value.customText) {
    return value.customText.trim();
  }
  return "";
};

export const isLocationValid = (
  value: LocationValue,
  required: boolean = true,
): boolean => {
  if (!required) return true;

  if (value.type === "parcel") {
    return !!value.parcelId;
  }
  if (value.type === "not-applicable") {
    return true;
  }
  if (value.type === "other") {
    return !!value.customText?.trim();
  }
  return false;
};

export default LocationParcelSelector;
