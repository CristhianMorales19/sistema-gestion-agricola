// Tokens de estilo específicos del módulo de Asistencia.
// Se encapsulan para cumplir Open/Closed y limitar impacto a este módulo.

export const colors = {
  bgPage: '#0f172a',
  bgCard: '#1e293b',
  border: '#334155',
  // Aumentamos contraste (más cercanos a blanco)
  textPrimary: '#f1f5f9', // antes #e2e8f0
  textSecondary: '#cbd5e1', // antes #94a3b8
  inputBg: '#1e293b', // slate-800
  inputBorder: '#334155',
  inputBorderFocus: '#10b981', // emerald-500
  btnPrimary: '#059669', // emerald-600
  btnPrimaryHover: '#047857', // emerald-700
  btnSecondary: '#475569', // slate-600
  btnSecondaryHover: '#334155', // slate-700
  badge: {
    success: { bg: '#047857', color: '#a7f3d0' }, // emerald-700 / emerald-200
    error: { bg: '#b91c1c', color: '#fecaca' }, // red-700 / red-200
    info: { bg: '#1d4ed8', color: '#bfdbfe' } // blue-700 / blue-200
  }
};

export const cardSx = {
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.border}`,
  borderRadius: 2,
  color: colors.textPrimary
};

export const inputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: colors.inputBg,
    color: colors.textPrimary,
    borderRadius: 1,
    '& fieldset': { borderColor: colors.inputBorder },
    '&:hover fieldset': { borderColor: colors.inputBorderFocus },
    '&.Mui-focused fieldset': { borderColor: colors.inputBorderFocus },
    '&.Mui-disabled': {
      opacity: 0.55,
      backgroundColor: '#1e293b'
    }
  },
  '& .MuiInputBase-input': { color: colors.textPrimary },
  '& .MuiInputLabel-root': { color: colors.textSecondary },
  '& .MuiInputLabel-root.Mui-focused': { color: colors.textPrimary }
};

export const primaryButtonSx = {
  backgroundColor: colors.btnPrimary,
  color: '#fff',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': { backgroundColor: colors.btnPrimaryHover },
  '&.Mui-disabled': {
    backgroundColor: '#064e3b',
    color: '#94a3b8',
    opacity: 0.6
  }
};

export const secondaryButtonSx = {
  backgroundColor: colors.btnSecondary,
  color: '#fff',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': { backgroundColor: colors.btnSecondaryHover },
  '&.Mui-disabled': {
    backgroundColor: '#1e293b',
    color: '#64748b',
    opacity: 0.55
  }
};

export const badgeSx = {
  success: { backgroundColor: colors.badge.success.bg, color: colors.badge.success.color, fontWeight: 600 },
  error: { backgroundColor: colors.badge.error.bg, color: colors.badge.error.color, fontWeight: 600 },
  info: { backgroundColor: colors.badge.info.bg, color: colors.badge.info.color, fontWeight: 600 }
};

export const smallCardItemSx = {
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.border}`,
  borderRadius: 1.5,
  padding: '6px 8px'
};
