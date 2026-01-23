import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Description as DocumentIcon,
  Image as ImageIcon,
  Error as ErrorIcon,
  OpenInFull as OpenInFullIcon,
} from "@mui/icons-material";
import { useAuth0 } from "@auth0/auth0-react";
import { ImagePreviewer } from "../ImagePreviewer";

import { ButtonGeneric } from "../../../../../../shared/presentation/styles/Button.styles";

interface DocumentViewerProps {
  absenceId: string;
  documentPath: string;
  fileName?: string;
  onDownload?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Componente para visualizar y descargar documentos de ausencias
 * Soporta imágenes, PDFs y otros tipos de archivos
 *
 * El componente maneja:
 * - Visualización previa de imágenes
 * - Preview de PDFs
 * - Descarga de cualquier tipo de archivo
 * - Manejo robusto de errores
 */
export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  absenceId,
  documentPath,
  fileName,
  onDownload,
  onError,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);

  // Extraer nombre del archivo y extensión
  const extractFileName = (path: string): { name: string; ext: string } => {
    const parts = path.split("/");
    const fullName = parts[parts.length - 1];
    const nameParts = fullName.split(".");
    const ext = nameParts[nameParts.length - 1].toLowerCase();
    const name = nameParts.slice(0, -1).join(".");
    return { name, ext };
  };

  const { name, ext } = extractFileName(fileName || documentPath);

  // Verificar si es una imagen
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(documentPath);

  // Verificar si es PDF
  const isPdf = ext === "pdf";

  // Obtener icono según el tipo de archivo
  const getFileIcon = () => {
    if (isImage) return <ImageIcon sx={{ mr: 1 }} />;
    return <DocumentIcon sx={{ mr: 1 }} />;
  };

  // Construir URL para cargar el documento
  const getDocumentUrl = (): string => {
    // Si ya es una URL completa, usarla directamente
    if (documentPath.startsWith("http")) {
      return documentPath;
    }

    // Si es una ruta relativa, construir la URL completa
    // El backend retorna rutas como /uploads/ausencias/filename
    // y sirve los archivos estáticos desde /uploads directamente (sin /api)
    if (documentPath.startsWith("/uploads")) {
      return documentPath;
    }

    // Fallback
    return documentPath;
  };

  // Manejar descarga
  const handleDownload = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener token de autenticación
      let token = "";
      try {
        token = await getAccessTokenSilently();
      } catch (tokenError) {
        console.warn(
          "No se pudo obtener token Auth0, intentando sin autenticación",
        );
      }

      // Usar el endpoint específico de descarga
      const downloadUrl = `/api/ausencias/${absenceId}/documento`;

      // Usar fetch para mantener autenticación
      const headers: HeadersInit = {
        Accept: "application/octet-stream",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(downloadUrl, {
        method: "GET",
        credentials: "include", // Incluir cookies
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Obtener el nombre del archivo del header Content-Disposition si está disponible
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = fileName || `ausencia-${absenceId}`;

      if (contentDisposition) {
        const match = contentDisposition.match(
          /filename[^;=\n]*=(["\']?)([^"\';]*)\1/,
        );
        if (match) {
          filename = match[2];
        }
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      if (onDownload) {
        onDownload();
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al descargar el documento";
      setError(errorMsg);
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMsg));
      }
      console.error("Error descargando documento:", err);
    } finally {
      setLoading(false);
    }
  };

  // Manejar error al cargar imagen
  const handleImageError = () => {
    setImageError(true);
    const err = new Error(
      "No se pudo cargar la imagen. El archivo podría estar corrupto o no estar disponible. Puedes descargarla para verla en tu dispositivo.",
    );
    setError(err.message);
    if (onError) {
      onError(err);
    }
  };

  if (!documentPath) {
    return (
      <Alert severity="info">
        No hay documentación de respaldo asociada a esta ausencia
      </Alert>
    );
  }

  const documentUrl = getDocumentUrl();

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Información del archivo */}
        <Card>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", flex: 1, gap: 1 }}
            >
              {getFileIcon()}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ color: "#94a3b8" }}>
                  Archivo
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffffff",
                    wordBreak: "break-word",
                    fontSize: "0.875rem",
                  }}
                >
                  {fileName || name || "documento"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#64748b", display: "block", mt: 0.5 }}
                >
                  Tipo: {ext.toUpperCase()}
                </Typography>
              </Box>
            </Box>
            {isImage && !imageError && (
              <Tooltip title="Ver en pantalla completa">
                <IconButton
                  size="small"
                  onClick={() => setShowFullscreenPreview(true)}
                  sx={{
                    color: "#3b82f6",
                    "&:hover": { color: "#2563eb" },
                  }}
                >
                  <OpenInFullIcon />
                </IconButton>
              </Tooltip>
            )}
          </CardContent>
        </Card>

        {/* Mostrar preview si es imagen */}
        {isImage && !imageError && (
          <Box
            sx={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 1,
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              minHeight: 200,
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: "#475569",
                backgroundColor: "#1e293b",
              },
            }}
            onClick={() => setShowFullscreenPreview(true)}
          >
            <Box
              component="img"
              src={documentUrl}
              alt={`Documento: ${name}`}
              sx={{
                maxWidth: "100%",
                maxHeight: 350,
                borderRadius: 1,
                border: "1px solid #475569",
                objectFit: "contain",
              }}
              onError={handleImageError}
            />
          </Box>
        )}

        {/* Mostrar preview si es PDF */}
        {isPdf && !imageError && (
          <Box
            sx={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 1,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              minHeight: 200,
              justifyContent: "center",
            }}
          >
            <DocumentIcon sx={{ fontSize: 64, color: "#64748b" }} />
            <Typography
              sx={{ color: "#94a3b8", textAlign: "center", fontWeight: 500 }}
            >
              Documento PDF
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748b", textAlign: "center" }}
            >
              Haz clic en "Descargar Documento" para ver el contenido
            </Typography>
          </Box>
        )}

        {/* Mostrar fallback para otros tipos */}
        {!isImage && !isPdf && !imageError && (
          <Box
            sx={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 1,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              minHeight: 200,
              justifyContent: "center",
            }}
          >
            <DocumentIcon sx={{ fontSize: 64, color: "#64748b" }} />
            <Typography
              sx={{ color: "#94a3b8", textAlign: "center", fontWeight: 500 }}
            >
              Archivo: {ext.toUpperCase()}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748b", textAlign: "center" }}
            >
              Descarga el archivo para verlo en tu aplicación
            </Typography>
          </Box>
        )}

        {/* Mostrar error si ocurrió alguno */}
        {error && (
          <Alert
            severity="error"
            icon={<ErrorIcon />}
            sx={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#fca5a5",
              "& .MuiAlert-icon": { color: "#ef4444" },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Botón de descarga */}
        <ButtonGeneric
          variant="contained"
          startIcon={loading ? <CircularProgress /> : <DownloadIcon />}
          onClick={handleDownload}
          disabled={loading}
          fullWidth
        >
          {loading ? "Descargando..." : "Descargar Documento"}
        </ButtonGeneric>
      </Box>

      {/* Preview en pantalla completa para imágenes */}
      <ImagePreviewer
        open={showFullscreenPreview}
        imageUrl={documentUrl}
        onClose={() => setShowFullscreenPreview(false)}
        title={`${name}.${ext}`}
      />
    </>
  );
};

export default DocumentViewer;
