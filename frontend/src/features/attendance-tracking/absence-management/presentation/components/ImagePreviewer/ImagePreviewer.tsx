import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
} from '@mui/icons-material';

interface ImagePreviewerProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
  title?: string;
}

/**
 * Componente para visualizar imágenes en full-screen con zoom
 */
export const ImagePreviewer: React.FC<ImagePreviewerProps> = ({
  open,
  imageUrl,
  onClose,
  title = 'Vista Previa de Imagen'
}) => {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#0f172a',
          backgroundImage: 'repeating-linear-gradient(45deg, #1e293b 25%, transparent 25%, transparent 75%, #1e293b 75%, #1e293b), repeating-linear-gradient(45deg, #1e293b 25%, #0f172a 25%, #0f172a 75%, #1e293b 75%, #1e293b)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }
      }}
    >
      <DialogContent
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          p: 2,
          backgroundColor: 'rgba(15, 23, 42, 0.95)'
        }}
      >
        {/* Botón Cerrar */}
        <Tooltip title="Cerrar">
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: '#94a3b8',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(30, 41, 59, 1)',
                color: '#ffffff'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>

        {/* Controles de Zoom */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            display: 'flex',
            gap: 1,
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderRadius: 1,
            p: 1
          }}
        >
          <Tooltip title="Alejar">
            <IconButton
              size="small"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              sx={{ color: '#94a3b8' }}
            >
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              color: '#94a3b8',
              minWidth: '60px',
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { color: '#ffffff' }
            }}
            onClick={handleResetZoom}
            title="Click para resetear"
          >
            {zoom}%
          </Box>
          <Tooltip title="Acercar">
            <IconButton
              size="small"
              onClick={handleZoomIn}
              disabled={zoom >= 300}
              sx={{ color: '#94a3b8' }}
            >
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Imagen con Scroll */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(100, 116, 139, 0.1)',
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(100, 116, 139, 0.5)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(100, 116, 139, 0.7)'
              }
            }
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt="Vista previa"
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: `${zoom}%`,
              height: 'auto',
              transition: 'width 0.2s ease-in-out',
              borderRadius: 1
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewer;
